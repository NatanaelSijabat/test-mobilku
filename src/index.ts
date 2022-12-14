import express, { Application, Request, Response } from "express";
import morgan from 'morgan'
import bodyParser from "body-parser";
import multer from "multer";
import { config as dotenv } from 'dotenv'
import compression from 'compression'
import cors from 'cors'
import helmet from "helmet"


import referrerPolicy from 'referrer-policy'

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
        this.app.use(cors({ credentials: true, origin: process.env.API_APP, methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ["Content-Type", "*"] }))
        this.app.use(helmet())
        this.app.use(morgan('dev'))
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(compression())
        this.app.use(express.static('public'))
        this.app.use(referrerPolicy({ policy: 'same-origin' }))
    }
    
    protected route(): void {
        this.app.route('/').get((req: Request, res: Response) => {
            res.send("test")
        })

        this.app.use("/api/v1/users", this.upload.single('image'), UserRoute)
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