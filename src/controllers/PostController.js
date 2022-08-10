import PostModel from "../models/Post.js";
import CommentModel from "../models/Comment.js";

import {validationResult} from "express-validator";

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec()

        res.json(posts)
    } catch (e) {
        res.status(500).json({
            message: 'failed to fetch posts'
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const id = req.params.id
        const filter = {_id: id}

        PostModel.findOneAndUpdate(
            filter, {
                $inc: {views: 1}
            }, {
                returnDocument: 'after'
            }, async (err, doc) => {
                if(err) {
                    return res.status(500).json({
                        message: 'failed to return post'
                    })
                }
                if(!doc) {
                    return res.status(404).json({
                        message: 'post not found'
                    })
                }
                await doc.populate('user')
                await doc.populate('comments')
                res.json(doc)
            }
        )
    } catch (e) {
        res.status(500).json({
            message: 'failed to fetch post'
        })
    }
}

export const updateOne = async (req, res) => {
    try {
        const id = req.params.id
        const filter = {_id: id}
        const update = {
            title: req.body.title,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags
        }
        await PostModel.updateOne(filter, update)
        const post = await PostModel.findById(id)
        res.json(post);
    } catch (e) {
        res.status(500).json({
            message: 'failed to update'
        })
    }
}

export const deleteOne = async (req, res) => {
    try {
        const id = req.params.id
        await PostModel.findByIdAndDelete(id)
        res.json({
            postId: id
        })
    } catch (e) {
        res.status(500).json({
            message: 'failed to delete post'
        })
    }
}

export const create = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        const doc = new PostModel({
            title: req.body.title,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        })
        console.log(doc)
        const post = await doc.save()

        res.json(post)
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'failed to create post'
        })
    }
}

export const getLastTags = async (req,res) => {
    try {
        const posts = await PostModel.find().exec()
        const tags = posts
            .filter(post => post.tags.length > 0)
            .flatMap(post => post.tags.filter(Boolean))
            .slice(0,5)
        res.json(tags)
    } catch (e) {
        res.status(500).json({
            message: 'failed to fetch tags'
        })
    }
}

export const createComment = async (req,res) => {
    try {
        const comment = new CommentModel({
            userName: req.body.userName,
            content: req.body.content,
        })

        await comment.save()
        const post = await PostModel.findById(req.body.id)

        post.comments.push(comment)

        await post.save()

        res.json(comment)
    } catch (e) {
        res.status(500).json({
            message: 'failed to fetch create'
        })
    }
}
