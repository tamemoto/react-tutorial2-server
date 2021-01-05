import express from "express"
import { checkJwt } from "../service/auth";
import { RestaurantController } from "../controller/RestaurantController";

const router: express.Router = express.Router()

router.get("/", RestaurantController.getRestaurantsData)
router.get("/:restaurantId",  RestaurantController.getRestaurantData)
router.get("/:restaurantId/reviews", RestaurantController.getRestaurantReviews)
router.post("/:restaurantId/reviews", checkJwt, RestaurantController.postRestaurantReview)

module.exports = router
