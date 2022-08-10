import {body} from 'express-validator'

export const registerValidation = [
    body('login', 'its is not an email value').isEmail(),
    body('password', 'password should be more then 5 letters').isLength({min: 5}),
    body('avatarUrl', 'avatar field should be in url format').optional().isURL(),
    body('fullName', 'fullName is required').isString(),
]

export const loginValidation = [
    body('login', 'its is not an email value').isEmail(),
    body('password', 'password should be more then 5 letters').isLength({min: 5}),
]

export const postCreateValidation = [
    body('title', 'Title should be at least 2 characters long').isLength({min: 2}).isString(),
    body('description', 'Description should be at least 5 characters long').isLength({min: 5}).isString(),
    body('imageUrl', 'imageUrl field should be in url format').optional().isString(),
    body('tags', 'tags field only accepts an array').optional().isArray(),
]
