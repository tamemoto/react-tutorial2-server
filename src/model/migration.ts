import { sequelize, Restaurant, Review, User } from "./model";
import { restaurants, reviews, users } from "../usecase/sample-data";

(async () => {
    await sequelize.sync({ force: true })
    for (const { name, image, map } of restaurants) {
        await Restaurant.create({ name, image, map })
    }
    for (const { sub, nickname } of users) {
        await User.create({ sub, nickname })
    }
    for (const { title, comment, userId, restaurantId } of reviews) {
        await Review.create({ title, comment, userId, restaurantId })
    }
})();
