import { Request, Response } from "express";
import IController from "./ControllerInterface";
import sharp from "sharp";
import fs from 'fs'

const db = require('../db/models')

class UserController implements IController {
    index = async (req: Request, res: Response): Promise<Response> => {
        const data = await db.users.findAll({
            attributes: ['id', 'name', 'birth', 'usia', 'mobile', 'city', 'education', 'image']
        })
        return res.status(200).json({ data })
    }

    create = async (req: Request, res: Response): Promise<Response> => {
        if (!req.file || Object.keys(req.file).length === 0) {
            return res.status(400).json({
                message: 'no files upload'
            })
        }
        await sharp(req.file?.buffer).resize({ width: 500, height: 500 }).toFile('public/users/500/' + req.file?.originalname)
        await sharp(req.file?.buffer).resize({ width: 1000, height: 1000 }).toFile('public/users/1000/' + req.file?.originalname)

        const { name, birth, usia, mobile, city, education } = req.body
        const imageName: any = req.file?.originalname


        const image = `${req.protocol}://${req.get("host")}/users/500/${imageName}`

        const data = await db.users.create({
            name,
            birth,
            usia,
            mobile,
            city,
            education,
            image,
            imageName
        })

        return res.status(201).send({ data })
    }

    show = async (req: Request, res: Response): Promise<Response> => {
        const { id } = req.params
        const data = await db.users.findOne({
            where: {
                id: id
            },
            attributes: ['id', 'name', 'birth', 'usia', 'mobile', 'city', 'education', 'image']
        })

        if (!data) return res.status(404).json({ message: 'no data found' })

        return res.json({ data })
    }

    update = async (req: Request, res: Response): Promise<Response> => {
        const { id } = req.params
        const data = await db.users.findOne({
            where: {
                id: id
            },
            attributes: ['id', 'name', 'birth', 'usia', 'mobile', 'city', 'education', 'image', 'imageName']
        })

        if (!data) return res.status(404).json({ message: 'no data found' })

        const { name, birth, usia, mobile, city, education } = req.body
        const imageName = req.file?.originalname

        const fotoPath500 = `./public/users/500/${data.imageName}`
        fs.unlinkSync(fotoPath500)
        const fotoPath1000 = `./public/users/1000/${data.imageName}`
        fs.unlinkSync(fotoPath1000)

        await sharp(req.file?.buffer).resize({ width: 500, height: 500 }).toFile('public/users/500/' + imageName)
        await sharp(req.file?.buffer).resize({ width: 1000, height: 1000 }).toFile('public/users/1000/' + imageName)

        const image = `${req.protocol}://${req.get("host")}/users/500/${imageName}`

        await db.users.update({
            name, birth, usia, mobile, city, education, image, imageName
        }, {
            where: { id }
        })

        return res.status(200).json({
            message: "user updated"
        })
    }

    delete = async (req: Request, res: Response): Promise<Response> => {
        const { id } = req.params
        const data = await db.users.findOne({
            where: {
                id: id
            },
        })

        const fotoPath500 = `./public/users/500/${data.imageName}`
        fs.unlinkSync(fotoPath500)
        const fotoPath1000 = `./public/users/1000/${data.imageName}`
        fs.unlinkSync(fotoPath1000)

        await db.users.destroy({
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