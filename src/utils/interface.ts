export interface Article {
    id?: string,
    image?: string,
    imagecaption?: string,
    title?: string,
    slug?: string,
    content?: string,
    author?: string,
    publisheddate?: Date
}

export interface ArticleSave extends Article {
    title: string,
    slug: string,
    content: string,
    author: string,
    publisheddate: Date
} 