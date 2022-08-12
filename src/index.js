import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import multer from 'multer'
import checkAuth from './utils/checkAuth.js'
import {login, me, register, updateProfile} from "./controllers/UserController.js";
import {
    create, createComment,
    deleteOne,
    getAll, getLastTags,
    getOne,
    updateOne
} from "./controllers/PostController.js";
import {
    loginValidation,
    postCreateValidation,
    registerValidation
} from "./ validation.js";
import handleValidationError from './utils/hadleValidationError.js'
import * as fs from "fs";

const app = express()
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if (!fs.existsSync('src/images')) {
            fs.mkdirSync('src/images');
        }
        cb(null, 'src/images');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const PORT = process.env.PORT || 4000
const jsonBodyMiddleware = express.json()
const upload = multer({storage})

app.use(jsonBodyMiddleware)
app.use(cors())
app.use('/uploads', express.static('src/images'))

mongoose.
    connect('mongodb+srv://admin:admin@cluster0.oeiwm.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB connected'))
    .catch(err => console.log(err))


app.get('/',  (req, res) => {
    res.redirect('/posts');
});

app.post('/register',registerValidation, handleValidationError,  register)
app.post('/login', loginValidation, handleValidationError,  login)
app.get('/me',checkAuth ,me)
app.patch('/profile',checkAuth, updateProfile)


app.get('/posts/tags',getLastTags)
app.get('/posts',getAll)
app.get('/posts/:id',getOne)

app.post('/comment',checkAuth,createComment)


//protected routes
app.patch('/posts/:id',checkAuth,handleValidationError,updateOne)
app.delete('/posts/:id',checkAuth,deleteOne)
app.post('/posts',checkAuth,postCreateValidation,handleValidationError,create)
//uploads
app.post('/uploads',checkAuth, upload.single('image'), (req,res) => {
    res.json({
        url: `uploads/${req.file.originalname}`
    })
})


app.listen(PORT, (err) => {
    if(err) {
        console.log(err)
    }
    console.log('start')
})
