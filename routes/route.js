import getMessage from '../controllers/controller.js';

const getMessageOpts = {
    method: 'GET',
    url: '/',
    handler: getMessage
}
const routes = (fastify, options, done) => {
    fastify.route(getMessageOpts)
    done()
}
export default routes