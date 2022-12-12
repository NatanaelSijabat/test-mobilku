import { Request, Response } from "express";
import IController from "./ControllerInterface";
import sharp from "sharp";
import fs from 'fs'
import path from 'path'

const db = require('../db/models')

class UserController implements IController {
    index = async (req: Request, res: Response): Promise<Response> => {
        try {
            const data = await db.User.findAll({
                attributes: ['nama', 'tanggal_lahir', 'usia', 'no_wa', 'asal_kota', 'pendidikan_terakhir']
            })

            return res.status(200).json({ data })
        } catch (error) {
            return res.send({ error: 'No data' })
        }

    }
    create = async (req: Request, res: Response): Promise<Response> => {
        const { nama, tanggal_lahir, usia, no_wa, asal_kota, pendidikan_terakhir } = req.body
        const foto: any = req.file?.originalname

        if (!req.file || Object.keys(req.file).length === 0) {
            return res.status(400).json({
                message: 'no files upload'
            })
        }

        sharp(req.file.path).resize({ width: 500, height: 500 }).toFile(`public/users/500px/${req.file.originalname}`)

        sharp(req.file.path).resize({ width: 1000, height: 1000 }).toFile(`public/users/1000px/${req.file.originalname}`)

        const data = await db.User.create({
            nama,
            tanggal_lahir,
            usia,
            no_wa,
            asal_kota,
            pendidikan_terakhir,
            foto
        })

        return res.status(201).json({ data })
    }
    show = async (req: Request, res: Response): Promise<Response> => {
        const { id } = req.params
        const data = await db.User.findOne({
            where: {
                id: id
            },
            attributes: ['nama', 'tanggal_lahir', 'usia', 'no_wa', 'asal_kota', 'pendidikan_terakhir', 'foto']
        })

        if (!data) return res.status(404).json({ message: 'no data found' })

        return res.json(data)
    }

    update = async (req: Request, res: Response): Promise<Response> => {
        const { id } = req.params
        const data = await db.User.findOne({
            where: {
                id: id
            },
            attributes: ['nama', 'tanggal_lahir', 'usia', 'no_wa', 'asal_kota', 'pendidikan_terakhir', 'foto']
        })

        if (!data) return res.status(404).json({ message: 'no data found' })

        let foto: string = ""
        if (req.file === null) {
            foto = data.foto
        } else {
            const foto = req.file?.originalname

            // const fotoPath = `./public/users/${data.foto}`
            // fs.unlinkSync(fotoPath)
            // const fotoPath500px = `./public/users/500px/${data.foto}`
            // fs.unlinkSync(fotoPath500px)
            // const fotoPath1000px = `./public/users/1000px/${data.foto}`
            // fs.unlinkSync(fotoPath1000px)

            // sharp(req.file?.path).resize({ width: 500, height: 500 }).toFile(`public/users/500px/${foto}`)
            // sharp(req.file?.path).resize({ width: 1000, height: 1000 }).toFile(`public/users/1000px/${foto}`)
        }

        const { nama, tanggal_lahir, usia, no_wa, asal_kota, pendidikan_terakhir } = req.body
        const f = req.file?.originalname

        const update = await db.User.update({
            nama, tanggal_lahir, usia, no_wa, asal_kota, pendidikan_terakhir, foto: f
        }, {
            where: { id }
        })
        return res.json({
            data: update,
            message: "user updated"
        })
    }
    delete(req: Request, res: Response): Response {
        throw new Error("Method not implemented.");
    }
}

export default new UserController()