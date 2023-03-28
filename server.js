import Fastify from 'fastify'
import { Server } from 'socket.io'
import jwt from '@fastify/jwt'
import { userRoutes } from './routes/user-route.js'
import mongoose from 'mongoose'

const fastify = Fastify()
fastify.register(userRoutes)
fastify.register(jwt, {
    secret: "supersecret"
})
fastify.decorate("authentication", async(req, reply) => {
    try {
        await req.jwtVerify()
    } catch (error) {
        reply.send(error)
    }
})

const io = new Server(fastify.server)

//middleware example
const userIo = io.of('/user')
userIo.on('connection', (socket) => {
    //console.log(`a user connected to user namespace with username ${socket.username}`)
})
userIo.use((socket, next) => {
    const token = socket.handshake.auth.token
    if (token) {
        socket.username = token
        next()
    } else {
        next(new Error('Please sent token'))
    }
})

io.on('connection', (socket) => {
    console.log('a user connected')

    io.emit('broadcast', 'God is Great', { message: 'Hello' }, '5')
    socket.on('message', () => {
        //console.log('message event called')
    })
    socket.join('room')
    socket.on('send-message', (message, room) => {
        if (room === '') {
            io.emit('received-message', message)
        } else {
            io.to(room).emit('received-message', message)
        }
    })
    //socket.on('ping', n => console.log(n)) 

    //send private message to client(2) in room(2)
    socket.on('join-room2', room2 => {
        socket.join(room2)
        io.to(room2).emit('private-message', 'This is a private message to client2')
    })

    //Room for client1
    socket.on('join-room1', (room1, cb) => {
        socket.join(room1)
        cb(`joined ${room1}`)
        //console.log(socket.rooms);
    })

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
})

const connectToMongoDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/SocketIO', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error(error);
    }
}
connectToMongoDB()

const start = async () => {
    try {
        await fastify.listen({ port: 5000 })
        console.log(`Server is now listening on ${fastify.server.address().port}`)
    } catch (error) {
        fastify.log.error(error)
        process.exit(1)
    }
}
start()

export default fastify