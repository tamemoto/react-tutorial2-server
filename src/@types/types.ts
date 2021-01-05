export type UserType = {
    id: number,
    sub: string,
    nickname: string,
    createdAt: string,
    updatedAt: string
}

export type ReviewType = {
    id: number,
    restaurantId: number,
    title: string,
    comment: string,
    userId: number,
    user: UserType,
    createdAt: string,
    updatedAt: string
}

export type RestaurantType = {
    id: number,
    name: string,
    image: string | null,
    map: string,
    reviews: ReviewType[]
    createdAt: string,
    updatedAt: string
}
