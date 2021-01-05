import express from "express";
import {Restaurant, Review, User} from "../model/model";
import { Sequelize } from "sequelize";
import { getUser } from "../service/auth";

export const RestaurantController = {
    getRestaurantsData: async (req: express.Request, res: express.Response): Promise<any> => {
        const limit = Number(req.query.limit) || 5;
        const offset = Number(req.query.offset) || 0;

        const restaurants = await Restaurant.findAndCountAll({
            attributes: {
                include: [
                    [
                        Sequelize.literal(
                            `(SELECT COUNT(*) FROM reviews AS r WHERE r.restaurant_id = restaurant.id)`,
                        ),
                        "review_count"
                    ],
                ],
            },
            include: [{model: Review, limit: 3,include: [{ model: User}]},],
            order: [[Sequelize.literal("review_count"), "DESC"]],
            limit,
            offset
        })
        res.json(restaurants)
    },

    getRestaurantData: async (req: express.Request, res: express.Response): Promise<any> => {
        const restaurantId = req.params.restaurantId
        const restaurant = await Restaurant.findByPk(restaurantId)
        if(!restaurant) {
            res.status(404).send("Not Found")
            return
        }
        res.json(restaurant)
    },

    getRestaurantReviews: async (req: express.Request, res: express.Response) => {
        const restaurantId = req.params.restaurantId
        const limit = Number(req.query.limit) || 5
        const offset = Number(req.query.offset) || 0
        const restaurant = await Restaurant.findByPk(restaurantId)
        if(!restaurant) {
            res.status(404).send("Not Found")
            return
        }

        const review = await Review.findAndCountAll({
            include: [{ model: User }],
            where: { restaurantId },
            limit,
            offset
        })

        res.json(review)
    },

    postRestaurantReview: async (req: express.Request, res: express.Response) => {
        const authUser = await getUser(req.get("Authorization"))
        const [user, created]: any = await User.findOrCreate({
            where: { sub: authUser.sub },
            defaults: {
                nickname: authUser.nickname
            }
        })

        console.log(user)
        console.log(created)

        if(!created){
            user.nickname = authUser.nickname
            await user.save()
        }

        const restaurantId = req.params.restaurantId
        const restaurant = await Restaurant.findByPk(restaurantId)
        if(!restaurant) {
            res.status(404).send("not found")
            return
        }
        const record = {
            title: req.body.title,
            comment: req.body.comment,
            userId: user.id,
            restaurantId
        }

        console.log(record)

        if(!record.title || !record.comment) {
            res.status(400).send("bad request")
        }

        const review = await Review.create(record)
        res.json(review)
    }
}
