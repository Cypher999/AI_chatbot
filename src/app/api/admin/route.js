import { count as countAgent } from "@/utils/db/agent"
import { count as countUser } from "@/utils/db/users"
import { count as countKnowledge } from "@/utils/db/knowledge"
export async function GET(req) {
  try {
    const agent = await countAgent()
    const user = await countUser()
    const knowledge = await countKnowledge()
    return Response.json({ 
        status:"success",
        data:{agent,user,knowledge}
     }, { status: 200 })
  } catch (error) {
    console.log(error)
    return Response.json({ status:"error",message: "Encountered an error" }, { status: 500 })
  }
}
