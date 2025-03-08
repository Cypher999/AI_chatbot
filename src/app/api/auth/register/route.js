import { hash } from "bcrypt"
import { getOne,add } from "@/utils/db/users"
export async function POST(req) {
  try {
    const fr=await req.formData();
    const newData={
        username:fr.get('username'),
        password:await hash(fr.get('password'),10),
        role:'user'
    }

    const existingUser = await getOne({ where: { username:newData.username } })
    if (existingUser) {
      return Response.json({ error: "User already exists" }, { status: 400 })
    }

    await add(newData)

    return Response.json({ message: "User registered successfully" }, { status: 200 })
  } catch (error) {
    console.log(error)
    return Response.json({ error: "Error registering user" }, { status: 500 })
  }
}