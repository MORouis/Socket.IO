import mongoose from "mongoose";
import { User } from "../collections/user-schema.js";
import bcrypt from "bcrypt"
import fastify from "../server.js";

const addUser = async (req, reply) => {
    try {
        const { username, password } = req.body
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save()
        reply.send(newUser)
        reply.status(201).json(newUser);
    } catch (error) {
        reply.status(500).json({ error: error.message })
    }
}

const login = async(req, reply) => {
    try {
        const {username, password} = req.body
        const user = await User.findOne({username})
        if(!user){
            return reply.status(404).send({msg: 'Invalid username'})
        }
        const validPassword = await bcrypt.compare(password, user.password)
        if(validPassword){
            const token = fastify.jwt.sign({username})
            reply.send({token})
        }else{
            return reply.status(404).send({msg: 'Invalid password'})
        }
    } catch (error) {
        reply.status(500).send({error: error.message})
    }
}

const validateToken = async (req, reply) => {
    console.log(req.user.username);
    reply.send(`Hello ${req.user.username}!`);
  };  

const getUser = async (req, reply) => {
    try {
        const users = await User.find()
        reply.send(users)
    } catch (error) {
        reply.status(500).json({ error: error.message })
    }
}

const deleteUser = async (req, reply) => {
    try {
        const { _id } = req.params
        if(!mongoose.Types.ObjectId.isValid(_id)){
            reply.status(404).send({msg: `No user with _id: ${_id}`})
            return
        }
        await User.findByIdAndDelete(_id)
        reply.send({ msg: `user ${_id} deleted` })
    } catch (error) {
        reply.status(500).json({ error: error.message })
    }
}

const updateUser = async (req, reply) => {
    try {
        const { _id } = req.params
        if(!mongoose.Types.ObjectId.isValid(_id)){
            reply.status(404).send({msg: `No user with _id: ${_id}`})
            return
        }
        await User.findByIdAndUpdate(_id, req.body)
        reply.send({ msg: `user ${_id} modified` })
    } catch (error) {
        reply.status(500).json({error: error.message})
    }
}

const getSingleUser = async(req, reply) => {
    try {
        const {_id} = req.params
        if(!mongoose.Types.ObjectId.isValid(_id)){
            reply.status(404).send({msg: `No user with _id: ${_id}`})
            return
        }
        const singleUser = await User.findById(_id)
        reply.send(singleUser)
    } catch (error) {
        reply.status(500).json({error: error.message})
    }
}

export { addUser, getUser, deleteUser, updateUser, getSingleUser, login, validateToken }