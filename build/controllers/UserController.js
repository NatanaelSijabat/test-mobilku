"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
const db = require('../db/models');
class UserController {
    constructor() {
        this.index = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield db.users.findAll({
                attributes: ['id', 'name', 'birth', 'usia', 'mobile', 'city', 'education', 'image']
            });
            return res.status(200).json({ data });
        });
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            if (!req.file || Object.keys(req.file).length === 0) {
                return res.status(400).json({
                    message: 'no files upload'
                });
            }
            yield (0, sharp_1.default)((_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer).resize({ width: 500, height: 500 }).toFile('public/users/500/' + ((_b = req.file) === null || _b === void 0 ? void 0 : _b.originalname));
            yield (0, sharp_1.default)((_c = req.file) === null || _c === void 0 ? void 0 : _c.buffer).resize({ width: 1000, height: 1000 }).toFile('public/users/1000/' + ((_d = req.file) === null || _d === void 0 ? void 0 : _d.originalname));
            const { name, birth, usia, mobile, city, education } = req.body;
            const imageName = (_e = req.file) === null || _e === void 0 ? void 0 : _e.originalname;
            const image = `${req.protocol}://${req.get("host")}/users/500/${imageName}`;
            const data = yield db.users.create({
                name,
                birth,
                usia,
                mobile,
                city,
                education,
                image,
                imageName
            });
            return res.status(201).send({ data });
        });
        this.show = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = yield db.users.findOne({
                where: {
                    id: id
                },
                attributes: ['id', 'name', 'birth', 'usia', 'mobile', 'city', 'education', 'image']
            });
            if (!data)
                return res.status(404).json({ message: 'no data found' });
            return res.json({ data });
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _f, _g, _h;
            const { id } = req.params;
            const data = yield db.users.findOne({
                where: {
                    id: id
                },
                attributes: ['id', 'name', 'birth', 'usia', 'mobile', 'city', 'education', 'image', 'imageName']
            });
            if (!data)
                return res.status(404).json({ message: 'no data found' });
            const { name, birth, usia, mobile, city, education } = req.body;
            const imageName = (_f = req.file) === null || _f === void 0 ? void 0 : _f.originalname;
            const fotoPath500 = `./public/users/500/${data.imageName}`;
            fs_1.default.unlinkSync(fotoPath500);
            const fotoPath1000 = `./public/users/1000/${data.imageName}`;
            fs_1.default.unlinkSync(fotoPath1000);
            yield (0, sharp_1.default)((_g = req.file) === null || _g === void 0 ? void 0 : _g.buffer).resize({ width: 500, height: 500 }).toFile('public/users/500/' + imageName);
            yield (0, sharp_1.default)((_h = req.file) === null || _h === void 0 ? void 0 : _h.buffer).resize({ width: 1000, height: 1000 }).toFile('public/users/1000/' + imageName);
            const image = `${req.protocol}://${req.get("host")}/users/500/${imageName}`;
            yield db.users.update({
                name, birth, usia, mobile, city, education, image, imageName
            }, {
                where: { id }
            });
            return res.status(200).json({
                message: "user updated"
            });
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = yield db.users.findOne({
                where: {
                    id: id
                },
            });
            const fotoPath500 = `./public/users/500/${data.imageName}`;
            fs_1.default.unlinkSync(fotoPath500);
            const fotoPath1000 = `./public/users/1000/${data.imageName}`;
            fs_1.default.unlinkSync(fotoPath1000);
            yield db.users.destroy({
                data,
                where: {
                    id
                }
            });
            return res.send({
                message: 'data delete'
            });
        });
    }
}
exports.default = new UserController();
