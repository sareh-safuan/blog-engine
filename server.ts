import http from 'http'
import app from './src/app'
import Database from './src/model/Database'


Database
    .init()
    .then(() => {
        const port: string = process.env.PORT || '3001'
        const server = http.createServer(app)

        server.listen(port, function () {
            console.log(`Server is running at port ${port}`)
        })
    })
    .catch((err: any) => {
        console.log('Error when starting the server')
        console.log()
        throw err
    })

/**
 * TODO
 *  1) refactor user & article controller, clear convulated if statement
 *  2) Fix UI, remove dropdown navbar to page **done
 *  3) Create schema for DB so only valid data is inserted: interface
 */

