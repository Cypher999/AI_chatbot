import { getOne } from "@/utils/db/users"
import { getToken } from "next-auth/jwt";
export async function GET(req) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: "ai-chatbot-token", 
  });
  try {
    const data=await getOne({
        select:{
          username:true,
          role:true,
          photo:true
        },
        where: {
          id:token.id}
      });
    return Response.json({ status:'success',data} , { status: 200 })
  } catch (error) {
    console.log(error)
    return Response.json({ status:"error",message: "Encountered an error" }, { status: 500 })
  }
}