import express, { Application, Request, Response } from "express";
import morgan from 'morgan'
import bodyParser from "body-parser";
import multer from "multer";
import { config as dotenv } from 'dotenv'
import compression from 'compression'
import cors from 'cors'
import helmet from "helmet"
import http from 'http'

//routes
import UserRoute from "./routes/UserRoute";


class App {
    public app: Application
    public upload
    public storage

    constructor() {
        this.app = express()
        this.plugins()
        this.storage = multer.memoryStorage()
        this.upload = multer({ storage: this.storage })
        this.route()
        dotenv()
    }

    protected plugins(): void {
        this.app.use(bodyParser.json())
        this.app.use(morgan('dev'))
        this.app.use(compression())
        this.app.use(helmet())
        this.app.use(cors({ credentials: true, origin: process.env.API_APP, allowedHeaders: "Content-Type" }))
        this.app.use(express.urlencoded({ extended: false }))
        this.app.use(express.static('public'))
    }

    protected route(): void {
        this.app.route('/').get((req: Request, res: Response) => {
            res.send("test")
        })

        this.app.use("/api/v1/users", this.upload.single('foto'), UserRoute)
    }
}

const port: number = 8000
const app = new App().app

app.listen(port, () => {
    console.log("server up " + port);
})

// http.createServer(app).listen(port, () => {
//     console.log("server " + port);
// })