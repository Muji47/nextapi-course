import { NextResponse } from "next/server";
import { authMiddleware } from "./middlewares/api/authMiddleware";

export const config={
    matcher:"/api/:path*"
}
export default function(req){
    const authorise= authMiddleware(req)
    if(!authorise.isValid&&req?.url.includes('/api/users')) return NextResponse.json({error:"Unauthorised user"},{status:401})
    return NextResponse.next()
}