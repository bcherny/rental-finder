const server = require('./data-server')

server.startServer().then(server.fetchData)