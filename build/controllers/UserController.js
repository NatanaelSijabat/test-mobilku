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
const db = require('../db/models');
class UserController {
    constructor() {
        this.index = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield db.User.findAll({
                    attributes: ['nama', 'tanggal_lahir', 'usia', 'no_wa', 'asal_kota', 'pendidikan_terakhir']
                });
                return res.status(200).json({ data });
            }
            catch (error) {
                return res.send({ error: 'No data' });
            }
        });
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { nama, tanggal_lahir, usia, no_wa, asal_kota, pendidikan_terakhir } = req.body;
            const foto = (_a = req.file) === null || _a === void 0 ? void 0 : _a.originalname;
            if (!req.file || Object.keys(req.file).length === 0) {
                return res.status(400).json({
                    message: 'no files upload'
                });
            }
            (0, sharp_1.default)(req.file.path).resize({ width: 500, height: 500 }).toFile(`public/users/500px/${req.file.originalname}`);
            (0, sharp_1.default)(req.file.path).resize({ width: 1000, height: 1000 }).toFile(`public/users/1000px/${req.file.originalname}`);
            const data = yield db.User.create({
                nama,
                tanggal_lahir,
                usia,
                no_wa,
                asal_kota,
                pendidikan_terakhir,
                foto
            });
            return res.status(201).json({ data });
        });
        this.show = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = yield db.User.findOne({
                where: {
                    id: id
                },
                attributes: ['nama', 'tanggal_lahir', 'usia', 'no_wa', 'asal_kota', 'pendidikan_terakhir', 'foto']
            });
            if (!data)
                return res.status(404).json({ message: 'no data found' });
            return res.json(data);
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _b, _c;
            const { id } = req.params;
            const data = yield db.User.findOne({
                where: {
                    id: id
                },
                attributes: ['nama', 'tanggal_lahir', 'usia', 'no_wa', 'asal_kota', 'pendidikan_terakhir', 'foto']
            });
            if (!data)
                return res.status(404).json({ message: 'no data found' });
            let foto = "";
            if (req.file === null) {
                foto = data.foto;
            }
            else {
                const foto = (_b = req.file) === null || _b === void 0 ? void 0 : _b.originalname;
                // const fotoPath = `./public/users/${data.foto}`
                // fs.unlinkSync(fotoPath)
                // const fotoPath500px = `./public/users/500px/${data.foto}`
                // fs.unlinkSync(fotoPath500px)
                // const fotoPath1000px = `./public/users/1000px/${data.foto}`
                // fs.unlinkSync(fotoPath1000px)
                // sharp(req.file?.path).resize({ width: 500, height: 500 }).toFile(`public/users/500px/${foto}`)
                // sharp(req.file?.path).resize({ width: 1000, height: 1000 }).toFile(`public/users/1000px/${foto}`)
            }
            const { nama, tanggal_lahir, usia, no_wa, asal_kota, pendidikan_terakhir } = req.body;
            const f = (_c = req.file) === null || _c === void 0 ? void 0 : _c.originalname;
            const update = yield db.User.update({
                nama, tanggal_lahir, usia, no_wa, asal_kota, pendidikan_terakhir, foto: f
            }, {
                where: { id }
            });
            return res.json({
                data: update,
                message: "user updated"
            });
        });
    }
    delete(req, res) {
        throw new Error("Method not implemented.");
    }
}
exports.default = new UserController();
