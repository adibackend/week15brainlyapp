import mongoose ,{ model, Schema } from "mongoose";
const UserSchema =new Schema({
    username:{type:String , required:true,unique:true},
    password:String
})

const ContentSchema = new Schema({
    title: String,
    link: String,
    tags: [{type: mongoose.Types.ObjectId, ref: 'Tag'}],
    type: String,
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true },
})


const LinkSchema = new Schema({
    hash: String,
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true, unique: true },
    contentId: {type:mongoose.Types.ObjectId, ref:'Content' ,required: true,unique:true}
})

export const LinkModel = model("Links", LinkSchema);
export const ContentModel = model("Content", ContentSchema);
export const UserModel=model("User",UserSchema);