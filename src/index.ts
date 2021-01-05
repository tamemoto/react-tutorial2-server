import express from "express"
import cors from "cors"
import { Routes } from "./routes/routes"


const app: express.Express = express()
app.use(cors())
app.use(express.json())
Routes(app)


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
