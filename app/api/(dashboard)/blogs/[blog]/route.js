import connect from "@/lib/db"
import User from "@/lib/models/users";
import Category from "@/lib/models/category";
import mongoose, { Types } from "mongoose";
import { NextResponse } from "next/server"
import Blog from "@/lib/models/blog";

export const GET = async (req,context) =>{
    const blogId=context.params.blog
try {
     const {searchParams}=new URL(req.url)
     const userId = searchParams.get('userId')
     const categoryId = searchParams.get('categoryId')
     if(!userId||!Types.ObjectId.isValid(userId)){
        return new NextResponse(JSON.stringify({message: !userId?"User Id required":"Invalid User Id"}),{status:400})
     }
     if(!categoryId||!Types.ObjectId.isValid(categoryId)){
        return new NextResponse(JSON.stringify({message:!categoryId?"Category Id required":"Invalid Category Id"}),{status:400})
     }
     if(!blogId||!Types.ObjectId.isValid(blogId)){
        return new NextResponse(JSON.stringify({message:!blogId?"Blog Id required":"Invalid Blog Id"}),{status:400})
     }
     const user=await User.findById(userId);
     if(!user){
        return new NextResponse(JSON.stringify({message: "User not found"}),{status:404})
     }
     await connect();
     const category=await Category.findById(categoryId);
     if(!category){
        return new NextResponse(JSON.stringify({message: "Category not found"}),{status:404})
     }
     const blog=await Blog.findOne({categoryId:categoryId,userId:userId,_id:blogId})
     if(!blog){
        return new NextResponse(JSON.stringify({message: "Blog not found"}),{status:404})
     }
     return new NextResponse(JSON.stringify(blog),{status:200})

} catch(err){
    return new NextResponse(JSON.stringify({error:err,message:"Error getting blog for user"},{status :500}));
}}
export const PATCH = async (req,context) => {
    const blogId= context.params.blog
    try {
        
        const body=await req.json();
        const {title,description}=body;
        const {searchParams}= new URL(req.url)
        const userId = searchParams.get('userId')
        const categoryId = searchParams.get('categoryId')
        if(!userId||!Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({message:!userId?"User id required":"Invalid User Id"}),{status:400})
        }
        if(!title){
            return new NextResponse(JSON.stringify({message: "Title is required"}),{status:400})
        }
        if(!categoryId||!Types.ObjectId.isValid(categoryId)){
            return new NextResponse(JSON.stringify({message:!categoryId?"Category Id required":"Invalid Category Id"}),{status:400})
         }
        if(!blogId||!Types.ObjectId.isValid(blogId)){
            return new NextResponse(JSON.stringify({message:!blogId?"Blog id required":"Invalid Blog Id"}),{status:400})
        }
        const user=await User.findById(userId);
        if(!user){
            return new NextResponse(JSON.stringify({message: "User not found"}),{status:404})
        }
        await connect();
        const category=await Category.findById(categoryId);
        if(!category){
            return new NextResponse(JSON.stringify({message: "Category not found"}),{status:404})
        }
        const blog =await Blog.findOne({_id:blogId,userId:userId,categoryId:categoryId})
        if(!blog){
            return new NextResponse(JSON.stringify({message: "Blog not found"}),{status:404})
        }
        if(blog.title==title){
            return new NextResponse(JSON.stringify({message:"No changes made"}),{status:404})
        }
        const updatedBlog = await Blog.findByIdAndUpdate(blogId,{title:title,description:description},{new:true})
        return new NextResponse(JSON.stringify({message:"Category updated successfully",blog:updatedBlog}),{status:200})
    } catch (error) {
        return new NextResponse(JSON.stringify({message:"Error to updating blog ",error:error.message}),{status:500});
    }
}
export const DELETE =async (req,context)=>{
    const blogId = context.params.blog;
    try {
        const {searchParams}= new URL(req.url)
        const userId = searchParams.get('userId')
        const categoryId = searchParams.get('categoryId')
        if(!userId||!Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({message:!userId?"User id required":"Invalid User Id"}),{status:400})
        }
        if(!categoryId||!Types.ObjectId.isValid(categoryId)){
            return new NextResponse(JSON.stringify({message:!categoryId?"Category id required":"Invalid Category Id"}),{status:400})
        }
        if(!blogId||!Types.ObjectId.isValid(blogId)){
            return new NextResponse(JSON.stringify({message:!blogId?"Blog id required":"Invalid Blog Id"}),{status:400})
        }
        const user=await User.findById(userId);
        if(!user){
            return new NextResponse(JSON.stringify({message: "User not found"}),{status:404})
        }
        await connect();
        const category=await Category.findById(categoryId);
        if(!category){
            return new NextResponse(JSON.stringify({message: "Category not found"}),{status:404})
        }
        // const blog =await Blog.findOne({_id:blogId,userId:userId,categoryId:categoryId})
        // if(!blog){
        //     return new NextResponse(JSON.stringify({message: "Blog not found"}),{status:404})
        // }
        await Blog.findByIdAndDelete(blogId)
        return new NextResponse(JSON.stringify({message:"Category deleted successfully"}),{status:200})  
    } catch (error) {
       return new NextResponse(JSON.stringify({message: "Error deleting category, error: ",error:error.message}),{status:500})
    }
 }