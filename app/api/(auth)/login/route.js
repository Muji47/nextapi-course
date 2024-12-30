import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'
const KEY = '455345kldhgkdjh345345345'
export const POST = async(req)=>{
    try{
    const body =await  req.json()
    if(!body){
        return new NextResponse(JSON.stringify({message: "No data provided"}),{status:400})
    }
    const {username , password} = body
    console.log(body)
    console.log(username, password)
    const token = jwt.sign({ username, password }, KEY, { expiresIn: '1h' });

    // Create response
    const response = new NextResponse(
      JSON.stringify({
        user: { name: username },
        message: "Login successfully",
      }),
      { status: 200 }
    );

    // Set the cookie
    response.cookies.set('authToken', token, {
      httpOnly: true, // Makes the cookie inaccessible via JavaScript
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      maxAge: 60 * 60, // 1 hour in seconds
      path: '/', // Cookie is valid for the entire site
    });

    return response;
    }catch(err){
        return new NextResponse(JSON.stringify({message: "Error creating token"}),{status:500})
    }
}