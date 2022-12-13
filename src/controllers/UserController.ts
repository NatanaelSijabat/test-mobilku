import { Request, Response } from "express";
import IController from "./ControllerInterface";
import sharp from "sharp";
import fs from 'fs'

const db = require('../db/models')

class UserController implements IController {
    index = async (req: Request, res: Response): Promise<Response> => {
        const data = await db.user.findAll({
            attributes: ['nama', 'tanggal_lahir', 'usia', 'no_wa', 'asal_kota', 'pendidikan_terakhir', 'foto', 'foto_url']
        })
        return res.status(200).json({ data })
    }

    create = async (req: Request, res: Response): Promise<Response> => {
        const { nama, tanggal_lahir, usia, no_wa, asal_kota, pendidikan_terakhir } = req.body
        const foto: any = req.file?.originalname

        await sharp(req.file?.buffer).resize({ width: 500, height: 500 }).toFile('public/users/500/' + req.file?.originalname)

        await sharp(req.file?.buffer).resize({ width: 1000, height: 1000 }).toFile('public/users/1000/' + req.file?.originalname)

        if (!req.file || Object.keys(req.file).length === 0) {
            return res.status(400).json({
                message: 'no files upload'
            })
        }

        const foto_url = `${req.protocol}://${req.get("host")}/users/500/${foto}`

        const data = await db.user.create({
            nama,
            tanggal_lahir,
            usia,
            no_wa,
            asal_kota,
            pendidikan_terakhir,
            foto,
            foto_url
        })

        return res.status(201).send({
            data
        })
    }
    show = async (req: Request, res: Response): Promise<Response> => {
        const { id } = req.params
        const data = await db.user.findOne({
            where: {
                id: id
            },
            attributes: ['nama', 'tanggal_lahir', 'usia', 'no_wa', 'asal_kota', 'pendidikan_terakhir', 'foto', 'foto_url']
        })

        if (!data) return res.status(404).json({ message: 'no data found' })

        return res.json(data)
    }

    update = async (req: Request, res: Response): Promise<Response> => {
        const { id } = req.params
        const data = await db.user.findOne({
            where: {
                id: id
            },
            attributes: ['nama', 'tanggal_lahir', 'usia', 'no_wa', 'asal_kota', 'pendidikan_terakhir', 'foto', 'foto_url']
        })

        if (!data) return res.status(404).json({ message: 'no data found' })

        const { nama, tanggal_lahir, usia, no_wa, asal_kota, pendidikan_terakhir } = req.body
        let foto: string = '';


        if (req.file?.originalname == null) {
            foto = data.foto
            const foto_url = `${req.protocol}://${req.get("host")}/users/500/${foto}`
            await db.user.update({
                nama, tanggal_lahir, usia, no_wa, asal_kota, pendidikan_terakhir, foto, foto_url
            }, {
                where: { id }
            })
        } else {
            const foto = req.file?.originalname

            const fotoPath500 = `./public/users/500/${data.foto}`
            fs.unlinkSync(fotoPath500)
            const fotoPath1000 = `./public/users/1000/${data.foto}`
            fs.unlinkSync(fotoPath1000)

            await sharp(req.file?.buffer).resize({ width: 500, height: 500 }).toFile('public/users/500/' + foto)
            await sharp(req.file?.buffer).resize({ width: 1000, height: 1000 }).toFile('public/users/1000/' + foto)

            const foto_url = `${req.protocol}://${req.get("host")}/users/500/${foto}`

            await db.user.update({
                nama, tanggal_lahir, usia, no_wa, asal_kota, pendidikan_terakhir, foto, foto_url
            }, {
                where: { id }
            })

        }

        return res.status(200).json({
            message: "user updated"
        })
    }

    delete = async (req: Request, res: Response): Promise<Response> => {
        const { id } = req.params
        const data = await db.user.findOne({
            where: {
                id: id
            },
        })

        const fotoPath500 = `./public/users/500/${data.foto}`
        fs.unlinkSync(fotoPath500)
        const fotoPath1000 = `./public/users/1000/${data.foto}`
        fs.unlinkSync(fotoPath1000)

        await db.user.destroy({
            data,
            where: {
                id
            }

        })
        return res.send({
            message: 'data delete'
        })
    }
}

export default new UserController()