import connect from "@/lib/db"
import User from "@/lib/models/users";
import mongoose, { Types } from "mongoose";
import { NextResponse } from "next/server"

const objectId=mongoose.Types.ObjectId;
export const GET= async ()=>{
    try {
        await connect();
        const users = await User.find();
        return new NextResponse(JSON.stringify(users))
    } catch (error) {
        return new NextResponse("Error to fetch users " + error.message,{status: 500})
    }
}
export const POST= async (request)=>{
    try {
        const body = await request.json()
        await connect();
        const newUser = new User(body)
        await newUser.save();
        return new NextResponse(JSON.stringify({message:"User has created successfully!", user:newUser}) ,{status: 200})
    } catch (error) {
        return new NextResponse("Error to create user " + error.message,{status: 500})
    }
}

export const PATCH= async (request)=>{
    try {
        const body = await request.json();
        const {userId,newUsername}=body;
        await connect();
        if(!userId || !newUsername){
            return new NextResponse(JSON.stringify({message:!userId?"user id":"new username" + " required"},{status:400}))
        }
        if(!Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({message:"Invalid userId"},{status:400}))
        }
        const updateUser= await User.findByIdAndUpdate({
            _id: userId,},
            {username: newUsername,},
            { new: true
        })
        if(!updateUser){
            return new NextResponse(JSON.stringify({message:"User not found"},{status:404}))
        }
        return new NextResponse(JSON.stringify({message:"User has updated successfully!", user:updateUser}) ,{status: 200})
    } catch (error) {
        return new NextResponse(JSON.stringify({message:"There is an error in updating user"},{status:500}))
    }
}
export const DELETE = async (request)=>{
    try {
        // const searchParams = request.params.searchParams
        const searchParam= new URL(request.url)
        const userId = searchParam.searchParams.get("userId");
        if(!userId){
            return new NextResponse(JSON.stringify({message:"user id" + " required"}),{status:400})
        }
        if(!Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({message:"Invalid userId"},{status:400}))
        }
        await connect();
        const deletedUser= await User.findByIdAndDelete({_id: userId})
        if(!deletedUser){
            return new NextResponse(JSON.stringify({message:"User not found"},{status:404}))
        }
        return new NextResponse(JSON.stringify({message:"User has deleted successfully!", user:deletedUser}) ,{status: 200})
    } catch (error) {
        return new NextResponse(JSON.stringify({message:"Error in deleting user " + error.message},{status:500}))
    }
}