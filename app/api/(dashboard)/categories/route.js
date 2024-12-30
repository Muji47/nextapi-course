import connect from "@/lib/db"
import User from "@/lib/models/users";
import Category from "@/lib/models/category";
import mongoose, { Types } from "mongoose";
import { NextResponse } from "next/server"

export const GET = async (req) =>{
try {
     const {searchParams}=new URL(req.url)
     const userId = searchParams.get('userId')
     console.log(userId)
     if(!userId||!Types.ObjectId.isValid(userId)){
        return new NextResponse(JSON.stringify({message: !userId?"User Id required":"Invalid User Id"}),{status:400})
     }
     const user=await User.findById(userId);
     if(!user){
        return new NextResponse(JSON.stringify({message: "User not found"}),{status:404})
     }
     await connect();
     const categories=await Category.find({user:userId})
     return new NextResponse(JSON.stringify(categories))
} catch (error) {
   return new NextResponse(JSON.stringify({message:"An error occurred to find category"}),{status:500}) 
}
}
export const POST= async (req) =>{
    try{
    const {searchParams}=new URL(req.url)
    const userId = searchParams.get('userId')
    const {title}=await req.json()
    if(!userId||!Types.ObjectId.isValid(userId)){
        return new NextResponse(JSON.stringify({message: !userId?"User Id required":"Invalid User Id"}),{status:400})
     }
     const user=await User.findById(userId);
     if(!user){
        return new NextResponse(JSON.stringify({message: "User not found"}),{status:404})
     }
     await connect();
     const category=new Category({title,user:userId})
     await category.save()
     return new NextResponse(JSON.stringify({message:"Category created",categories:category}),{status:200})
    }catch(error){
        return new NextResponse(JSON.stringify({message:"An error occurred to create category ",error:error.message}),{status:500})
    }
}
