import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  lastLogin?: Date;
}

const UserSchema: Schema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    lastLogin: {
        type: Date
    },
}, {
    timestamps: true
});

UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });

export default mongoose.model<IUser>('User', UserSchema);