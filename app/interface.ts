export interface Item {
    id: string,
    collectionId: string
    collectionName: string,
    created: string,
    updated: string,
    task: string,
    user: string
}

export interface ListViewResponse {
    page: number,
    perPage: number,
    totalPages: number,
    totalItems: number,
    items: Item[]
}