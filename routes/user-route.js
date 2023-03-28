import fastify from 'fastify';
import {addUser, getUser, deleteUser, updateUser, getSingleUser, login, validateToken} from '../controllers/user-controller.js';

const addUserOpts = {
    method: 'POST',
    url: '/add-user',
    handler: addUser
}
const getUsersOpts = {
    method: 'GET',
    url: '/users',
    handler: getUser
}
const deleteUserOpts = {
    method: 'DELETE',
    url: '/user/:_id',
    handler: deleteUser
}
const updateUserOpts = {
    method: 'PUT',
    url: '/user/:_id',
    handler: updateUser
}
const getSingleUserOpts = {
    method: 'GET',
    url: '/user/:_id',
    handler: getSingleUser
}
const loginOpts = {
    method: 'POST',
    url: '/login',
    handler: login
}
const validateTokenOpts = {
    method: 'GET',
    url: '/validate-token',
    preHandler: fastify.authentication,
    handler: validateToken
}       

export const userRoutes = (fastify, options, done) => {
    fastify.route(addUserOpts)
    fastify.route(getUsersOpts)
    fastify.route(deleteUserOpts)
    fastify.route(updateUserOpts)
    fastify.route(getSingleUserOpts)
    fastify.route(loginOpts)
    fastify.route(validateTokenOpts)

    done()
}