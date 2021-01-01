import express from "express";
import { Restaurant, Review, User } from "./model/model";
import { Sequelize } from "sequelize";
import { checkJwt, getUser } from "./service/auth";
import cors from "cors"


const app = express()
app.use(cors())
app.use(express.json())

app.get("/restaurants", async (req, res) => {
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
    console.log(restaurants)
    res.json(restaurants)
});


app.get("/restaurants/:restaurantId", async (request, response): Promise<any> => {
    const restaurantId = request.params.restaurantId
    const restaurant = await Restaurant.findByPk(restaurantId)
    if(!restaurant) {
        response.status(404).send("Not Found")
        return
    }
    response.json(restaurant)
})

app.get("/restaurants/:restaurantId/reviews", async (request, response): Promise<any> => {
    const restaurantId = request.params.restaurantId
    const limit = Number(request.query.limit) || 5
    const offset = Number(request.query.offset) || 0
    const restaurant = await Restaurant.findByPk(restaurantId)
    if(!restaurant) {
        response.status(404).send("Not Found")
        return
    }

    const review = await Review.findAndCountAll({
        include: [{ model: User }],
        where: { restaurantId },
        limit,
        offset
    })

    response.json(review)
})

app.post("/restaurants/:restaurantId/reviews", checkJwt, async (req: any, res: any) => {
    const authUser = await getUser(req.get("Authorization"))
    const [user, created]: any = await User.findOrCreate({
        where: { sub: authUser.sub },
        defaults: {
            nickname: authUser.nickname
        }
    })

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
        userId: req.bosy.userId,
        restaurantId
    }

    if(!record.title || !record.comment) {
        res.status(400).send("bad request")
    }

    const review = await Review.create(record)
    res.json(review)
})


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
