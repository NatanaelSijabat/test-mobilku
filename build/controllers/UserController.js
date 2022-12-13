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
            const data = yield db.user.findAll({
                attributes: ['nama', 'tanggal_lahir', 'usia', 'no_wa', 'asal_kota', 'pendidikan_terakhir', 'foto', 'foto_url']
            });
            return res.status(200).json({ data });
        });
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            const { nama, tanggal_lahir, usia, no_wa, asal_kota, pendidikan_terakhir } = req.body;
            const foto = (_a = req.file) === null || _a === void 0 ? void 0 : _a.originalname;
            yield (0, sharp_1.default)((_b = req.file) === null || _b === void 0 ? void 0 : _b.buffer).resize({ width: 500, height: 500 }).toFile('public/users/500/' + ((_c = req.file) === null || _c === void 0 ? void 0 : _c.originalname));
            yield (0, sharp_1.default)((_d = req.file) === null || _d === void 0 ? void 0 : _d.buffer).resize({ width: 1000, height: 1000 }).toFile('public/users/1000/' + ((_e = req.file) === null || _e === void 0 ? void 0 : _e.originalname));
            if (!req.file || Object.keys(req.file).length === 0) {
                return res.status(400).json({
                    message: 'no files upload'
                });
            }
            const foto_url = `${req.protocol}://${req.get("host")}/users/500/${foto}`;
            const data = yield db.user.create({
                nama,
                tanggal_lahir,
                usia,
                no_wa,
                asal_kota,
                pendidikan_terakhir,
                foto,
                foto_url
            });
            return res.status(201).send({
                data
            });
        });
        this.show = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = yield db.user.findOne({
                where: {
                    id: id
                },
                attributes: ['nama', 'tanggal_lahir', 'usia', 'no_wa', 'asal_kota', 'pendidikan_terakhir', 'foto', 'foto_url']
            });
            if (!data)
                return res.status(404).json({ message: 'no data found' });
            return res.json(data);
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _f, _g, _h, _j;
            const { id } = req.params;
            const data = yield db.user.findOne({
                where: {
                    id: id
                },
                attributes: ['nama', 'tanggal_lahir', 'usia', 'no_wa', 'asal_kota', 'pendidikan_terakhir', 'foto', 'foto_url']
            });
            if (!data)
                return res.status(404).json({ message: 'no data found' });
            const { nama, tanggal_lahir, usia, no_wa, asal_kota, pendidikan_terakhir } = req.body;
            let foto = '';
            if (((_f = req.file) === null || _f === void 0 ? void 0 : _f.originalname) == null) {
                foto = data.foto;
                const foto_url = `${req.protocol}://${req.get("host")}/users/500/${foto}`;
                yield db.user.update({
                    nama, tanggal_lahir, usia, no_wa, asal_kota, pendidikan_terakhir, foto, foto_url
                }, {
                    where: { id }
                });
            }
            else {
                const foto = (_g = req.file) === null || _g === void 0 ? void 0 : _g.originalname;
                const fotoPath500 = `./public/users/500/${data.foto}`;
                fs_1.default.unlinkSync(fotoPath500);
                const fotoPath1000 = `./public/users/1000/${data.foto}`;
                fs_1.default.unlinkSync(fotoPath1000);
                yield (0, sharp_1.default)((_h = req.file) === null || _h === void 0 ? void 0 : _h.buffer).resize({ width: 500, height: 500 }).toFile('public/users/500/' + foto);
                yield (0, sharp_1.default)((_j = req.file) === null || _j === void 0 ? void 0 : _j.buffer).resize({ width: 1000, height: 1000 }).toFile('public/users/1000/' + foto);
                const foto_url = `${req.protocol}://${req.get("host")}/users/500/${foto}`;
                yield db.user.update({
                    nama, tanggal_lahir, usia, no_wa, asal_kota, pendidikan_terakhir, foto, foto_url
                }, {
                    where: { id }
                });
            }
            return res.status(200).json({
                message: "user updated"
            });
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = yield db.user.findOne({
                where: {
                    id: id
                },
            });
            const fotoPath500 = `./public/users/500/${data.foto}`;
            fs_1.default.unlinkSync(fotoPath500);
            const fotoPath1000 = `./public/users/1000/${data.foto}`;
            fs_1.default.unlinkSync(fotoPath1000);
            yield db.user.destroy({
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
