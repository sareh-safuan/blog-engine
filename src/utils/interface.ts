import { 
    Request as Req,
    Response as Res, 
    NextFunction as NF
} from 'express'

interface SetFlashFunction {
    (message: string | Array<string>, redirect?: boolean): void
}

interface GetFlashFunction {
    (): string | boolean
}

export interface Request extends Req {
    setFlash?: SetFlashFunction,
    getFlash?: GetFlashFunction,
    session?: any
}

export interface NextFunction extends NF {}

export interface Response extends Res {}

export interface Article {
    id?: string,
    image?: string,
    imagecaption?: string,
    title?: string,
    slug?: string,
    category?: string,
    content?: string,
    author?: string,
    publisheddate?: Date
}

export interface ArticleSave extends Article {
    title: string,
    slug: string,
    category: string,
    content: string,
    author: string,
    publisheddate: Date
}

export interface ArticleUpdate extends Article {
    title: string,
    category: string,
    content: string,
    updatedate: Date
}

export interface User {
    id?: string,
    username?: string,
    email?: string,
    hash?: string
}

export interface UserSave extends User {
    username: string,
    email: string,
    hash: string
}

export interface UserUpdatePassword extends User {
    hash: string
}