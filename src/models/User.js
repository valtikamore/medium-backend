import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required:true,
        unique: true
    },
    passwordHash: {
        type: String,
        required:true,
    },
    avatarUrl: String
}, {
    timestamps: true
});

export default mongoose.model('User', UserSchema)
