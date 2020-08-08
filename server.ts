import http from 'http'
import app from './src/app'
import config from './src/utils/config'
import { infoLogger } from './src/utils/logger'

(async function () {
    try {
        const { PORT } = config

        const server = http.createServer(app)

        server.listen(PORT)

        infoLogger('Server is started.')

    } catch (err) {

        infoLogger(err.message)

    }
})()

/**
 * TODO
 *  1) refactor user & article controller, clear convulated if statement **done
 *  2) Fix UI, remove dropdown navbar to page **done
 *  3) Create schema for DB so only valid data is inserted: interface
 */

