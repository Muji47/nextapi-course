import connect from "@/lib/db"
import User from "@/lib/models/users";
import Category from "@/lib/models/category";
import mongoose, { Types } from "mongoose";
import { NextResponse } from "next/server"

export const PATCH = async (req,context) => {
    const categoryId= context.params.category
    try {
        
        const body=await req.json();
        const {title}=body;
        const {searchParams}= new URL(req.url)
        const userId = searchParams.get('userId')
        if(!userId||!Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({message:!userId?"User id required":"Invalid User Id"}),{status:400})
        }
        if(!title){
            return new NextResponse(JSON.stringify({message: "Title is required"}),{status:400})
        }
        if(!categoryId||!Types.ObjectId.isValid(categoryId)){
            return new NextResponse(JSON.stringify({message:!categoryId?"Category id required":"Invalid Category Id"}),{status:400})
        }
        await connect();
        const category =await Category.findOne({_id:categoryId,user:userId})
        if(!category){
            return new NextResponse(JSON.stringify({message: "Category not found"}),{status:400})
        }
        if(category.title==title){
            return new NextResponse(JSON.stringify({message:"No changes made"}),{status:400})
        }
        const updatedCategory = await Category.findByIdAndUpdate(categoryId,{title:title},{new:true})
        return new NextResponse(JSON.stringify({message:"Category updated successfully",category:updatedCategory}),{status:200})
    } catch (error) {
        return new NextResponse(JSON.stringify({message:"Error to updating category "+error.message}),{status:500});
    }
}
export const DELETE =async (req,context)=>{
    const categoryId = context.params.category;
    try {
        const {searchParams}= new URL(req.url)
        const userId = searchParams.get('userId')
        if(!userId||!Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({message:!userId?"User id required":"Invalid User Id"}),{status:400})
        }
        if(!categoryId||!Types.ObjectId.isValid(categoryId)){
            return new NextResponse(JSON.stringify({message:!categoryId?"Category id required":"Invalid Category Id"}),{status:400})
        }
        await connect();
        const category =await Category.findOne({_id:categoryId,user:userId})
        if(!category){
            return new NextResponse(JSON.stringify({message: "Category not found"}),{status:400})
        }
        await Category.findByIdAndDelete(categoryId)
        return new NextResponse(JSON.stringify({message:"Category deleted successfully",category:category}),{status:200})  
    } catch (error) {
       return new NextResponse(JSON.stringify({message: "Error deleting category, error: ",error:error.message}),{status:500})
    }
 }