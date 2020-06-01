import http from 'http'
import app from './src/app'

const port = process.env.PORT

const server = http.createServer(app)

server.listen(port, function () {
    console.log(`Server is running at port ${port}`)
})



