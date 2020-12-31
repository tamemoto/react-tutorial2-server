import express from "express";
import { restaurants, reviews } from "./usecase/sample-data";
import cors from "cors"


const app = express()
app.use(cors())

app.get("/restaurants", async (req, res) => {
    const limit = Number(req.query.limit) || 5;
    const offset = Number(req.query.offset) || 0;
    const datas = restaurants;
    res.json({
        rows: datas.slice(offset, offset + limit),
        count: datas.length,
    });
});


app.get("/restaurants/:restaurantId", async (request, response): Promise<any> => {
    const restaurantId = request.params.restaurantId
    const restaurant = restaurants.find((restaurant) => restaurant.id.toString()===restaurantId)
    if(!restaurant) {
        response.status(404).send("Not Found")
        return
    }
    response.json(restaurant)
})

app.get("/restaurants/:restaurantId/reviews", async (request, response): Promise<any> => {
    const restaurantId = request.params.restaurantId
    const restaurant = restaurants.find(restaurant => restaurant.id.toString() === restaurantId)

    if(!restaurant) {
        response.status(404).send("Not Found")
        return
    }

    const review = reviews.filter(review => review.restaurantId.toString() === restaurantId)

    response.json({
        count: review.length,
        rows: reviews.slice(0, 5)
    })
})


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
