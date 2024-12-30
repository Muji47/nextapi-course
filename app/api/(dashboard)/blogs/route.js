import connect from "@/lib/db"
import User from "@/lib/models/users";
import Category from "@/lib/models/category";
import mongoose, { Types } from "mongoose";
import { NextResponse } from "next/server"
import Blog from "@/lib/models/blog";

export const GET = async (req) =>{
try {
     const {searchParams}=new URL(req.url)
     const userId = searchParams.get('userId')
     const categoryId = searchParams.get('categoryId')
     const searchKeyword = searchParams.get('keyword')
     const startDate = searchParams.get('startDate')
     const endDate = searchParams.get('endDate')
     const limit = searchParams.get('limit')||"2"
     const page = searchParams.get('page')||"1"
     if(!userId||!Types.ObjectId.isValid(userId)){
        return new NextResponse(JSON.stringify({message: !userId?"User Id required":"Invalid User Id"}),{status:400})
     }
     if(!categoryId||!Types.ObjectId.isValid(categoryId)){
        return new NextResponse(JSON.stringify({message:!categoryId?"Category Id required":"Invalid Category Id"}),{status:400})
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
     const filter={
        userId:userId,
        categoryId:categoryId,
       
     }
     if (searchKeyword) {
        filter.$or = [
            {
                title: {
                    $regex: new RegExp(searchKeyword, "i"),
                },
            },
            {
                description: {
                    $regex: new RegExp(searchKeyword, "i"),
                },
            },
        ];
    }
    if(startDate&&endDate) {
      filter.createdAt = {
         $gte: new Date(startDate),
         $lte: new Date(endDate)
      }
    } else if(startDate){
      filter.createdAt = {
         $gte: new Date(startDate)
      }
    }
    else if(endDate){
      filter.createdAt = {
         $lte: new Date(endDate)
      }
    }
    const skip =(page-1)*limit
     const blogs=await Blog.find(filter).sort({createdAt:"asc"}).skip(skip).limit(limit)
     return new NextResponse(JSON.stringify(blogs),{status:200})

} catch(err){
    return new NextResponse(JSON.stringify({error:err.message,message:"Error getting blogs for user"},{status :500}));
}}
export const POST = async (req) => {
   try {
       const contentType = req.headers.get("content-type");
       if (!contentType || !contentType.includes("multipart/form-data")) {
           return new NextResponse(
               JSON.stringify({ message: "Invalid Content-Type. Expected multipart/form-data." }),
               { status: 400 }
           );
       }
       const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const categoryId = searchParams.get("categoryId");
       // Parse form data
       const formData = await req.formData();

       // Extract fields
       const title = formData.get("title");
       const description = formData.get("description");
       const file = formData.get("file"); // Extract the image file

       // Validate required fields
       if (!title) {
           return new NextResponse(JSON.stringify({ message: "Title is required" }), { status: 400 });
       }
       if (!userId || !Types.ObjectId.isValid(userId)) {
           return new NextResponse(
               JSON.stringify({ message: !userId ? "User Id required" : "Invalid User Id" }),
               { status: 400 }
           );
       }
       if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
           return new NextResponse(
               JSON.stringify({ message: !categoryId ? "Category Id required" : "Invalid Category Id" }),
               { status: 400 }
           );
       }

       // Fetch user and category
       await connect();
       const user = await User.findById(userId);
       if (!user) {
           return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 404 });
       }
       const category = await Category.findById(categoryId);
       if (!category) {
           return new NextResponse(JSON.stringify({ message: "Category not found" }), { status: 404 });
       }

       // Process image file
       let imageBuffer = null;
       if (file) {
           const bufferData = await file.arrayBuffer();
           imageBuffer = Buffer.from(bufferData);
       }

       // Create and save the blog
       const blog = new Blog({
           userId,
           categoryId,
           title,
           description: description || "",
           image: imageBuffer, // Save image buffer if present
       });
       await blog.save();

       return new NextResponse(
           JSON.stringify({ message: "Blog created successfully!", blog }),
           { status: 200 }
       );
   } catch (error) {
       console.error("Error creating blog:", error);
       return new NextResponse(
           JSON.stringify({ message: "An error occurred while creating the blog", error: error.message }),
           { status: 500 }
       );
   }
};
