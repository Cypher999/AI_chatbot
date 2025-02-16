const userUtils=__require('utils/db/users')
const agentUtils=__require('utils/db/agent')
const knowledgeUtils=__require('utils/db/knowledge')

const index=async(req,res)=>{
    const data={
        agent:await agentUtils.count(),
        users:await userUtils.count(),
        knowledge:await knowledgeUtils.count()
    }
    return res.status(200).json({status:'success',data});
}
module.exports={index};