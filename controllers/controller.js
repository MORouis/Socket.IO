const getMessage = async(req, reply) => {
    await reply.send('hello')
}

export default getMessage