const router = require("./restaurants")
import express from "express"

export const Routes = (app: express.Express) => {
    app.use("/restaurants", router)
};


