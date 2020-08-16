import BaseModel from './BaseModel'

interface User {
    id?: string,
    username: string,
    email: string,
    password?: string
}

class UserModel extends BaseModel {
    constructor() {
        super('users')
    }
}

export default UserModel