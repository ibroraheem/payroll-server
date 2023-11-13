import mongoose, { Document, Schema } from 'mongoose'

interface Admin extends Document {
    email: string;
    username: string;
    password: string;
    resetToken: string;
    resetTokenExpiry: number;
}

const adminSchema = new Schema<Admin>({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    resetToken: {
        token: String,
    },
    resetTokenExpiry: {
        type: Number
    }
},
    { timestamps: true }
)

const AdminModel = mongoose.model<Admin>('Admin', adminSchema)

export default AdminModel