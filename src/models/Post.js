import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required:true,
    },
    imageUrl: {
        type: String,
    },
    tags: {
        type: [String],
        default: []
    },
    views: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
            default: []
    }]
}, {
    timestamps: true
});

export default mongoose.model('Post', PostSchema)
