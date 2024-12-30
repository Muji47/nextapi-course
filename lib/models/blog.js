import { Schema,models,model } from "mongoose";
const blogSchema = new Schema({
    title: { type: String, required: true },
    image:{type:Buffer},
    description: { type: String,required: false,default:null},
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
},{
    timestamps: true,
})
const Blog = models.Blog||model("Blog",blogSchema);
export default Blog