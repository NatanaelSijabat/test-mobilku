"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const multer_1 = __importDefault(require("multer"));
const dotenv_1 = require("dotenv");
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const referrer_policy_1 = __importDefault(require("referrer-policy"));
//routes
const UserRoute_1 = __importDefault(require("./routes/UserRoute"));
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.plugins();
        this.storage = multer_1.default.memoryStorage();
        this.upload = (0, multer_1.default)({ storage: this.storage });
        this.route();
        (0, dotenv_1.config)();
    }
    plugins() {
        this.app.use((0, cors_1.default)({ credentials: true, origin: process.env.API_APP, methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ["Content-Type", "*"] }));
        this.app.use((0, helmet_1.default)());
        this.app.use((0, morgan_1.default)('dev'));
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use((0, compression_1.default)());
        this.app.use(express_1.default.static('public'));
        this.app.use((0, referrer_policy_1.default)({ policy: 'same-origin' }));
    }
    route() {
        this.app.route('/').get((req, res) => {
            res.send("test");
        });
        this.app.use("/api/v1/users", this.upload.single('image'), UserRoute_1.default);
    }
}
const port = 8000;
const app = new App().app;
app.listen(port, () => {
    console.log("server up " + port);
});
// http.createServer(app).listen(port, () => {
//     console.log("server " + port);
// })
