import { count as countAgent } from "@/utils/db/agent"
import { count as countUser } from "@/utils/db/users"
import { count as countKnowledge } from "@/utils/db/knowledge"
import getToken from "@/utils/getToken"
export async function GET(req) {
  const token=await getToken(req);
  try {
    const agent = await countAgent({
      where:{
        userId:token.id
      }
    })
    const knowledge = await countKnowledge({
      where:{
        agent:{
          userId:token.id
        }
      }
    })
    return Response.json({ 
        status:"success",
        data:{agent,knowledge}
     }, { status: 200 })
  } catch (error) {
    console.log(error)
    return Response.json({ status:"error",message: "Encountered an error" }, { status: 500 })
  }
}
