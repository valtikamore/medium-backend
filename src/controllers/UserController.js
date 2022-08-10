import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {validationResult} from "express-validator";

export const login = async (req,res) => {
    try {
        const user = await UserModel.findOne({login: req.body.login})
        if(!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

        if(!isValidPass) {
            return res.status(404).json({
                message: 'invalid login or password'
            })
        }

        const token = jwt.sign({
            _id: user._id
        }, 'secret', {
            expiresIn: '30d'
        })
        const {passwordHash, ...userData} = user._doc
        res.json({ ...userData, token})

    } catch (e) {
        res.status(500).json({
            message: 'failed to register'
        })
    }
}
export const register = async  (req,res) => {
    try {
        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password,salt)

        const doc = new UserModel({
            login: req.body.login,
            password: req.body.password,
            avatarUrl: req.body.avatarUrl,
            fullName: req.body.fullName,
            passwordHash: hash
        })
        const user = await doc.save()

        const token = jwt.sign({
            _id: user._id
        }, 'secret', {
            expiresIn: '30d'
        })
        const {passwordHash, ...userData} = user._doc
        res.json({ ...userData, token})
    } catch (e){
        res.status(500).json({
            message: 'failed to register'
        })
    }
}
export const me = async (req,res) => {
    try {
        const user = await UserModel.findById(req.userId)

        if(!user) {
            return res.status(404).json({
                message: 'user not founded'
            })
        }
        const {passwordHash,password, ...userData} = user._doc
        res.json(userData)

    } catch (e) {
        res.status(500).json({
            message: 'failed to auth'
        })
    }
}
