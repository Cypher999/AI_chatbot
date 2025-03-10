import { hash } from "bcrypt"
import { getOne } from "@/utils/db/users"
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username"); 

    const checkUser = await getOne({
        select:{
            role:true
        },
        where: { username } 
    })
    if (!checkUser) {
      return Response.json({ error: "user not found" }, { status: 404 })
    }

    return Response.json({ data: checkUser }, { status: 200 })
  } catch (error) {
    console.log(error)
    return Response.json({ error: "Encountered an error" }, { status: 500 })
  }
}