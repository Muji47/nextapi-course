import { Schema,model,models } from "mongoose";
const userSchema=new Schema(
    {
        email:{type:String,require:true,unique:true},
        username:{type:String,require:true,unique:true},
        password:{type:String,require:true},
    },
    {
        timestamps:true,
    }
)
const User=models.User||model("User",userSchema);
export default User;