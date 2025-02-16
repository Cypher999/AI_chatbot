const userUtils=__require('utils/db/users')
const agentUtils=__require('utils/db/agent')
const knowledgeUtils=__require('utils/db/knowledge')

const index=async(req,res)=>{
    const data={
        agent:await agentUtils.countAll(),
        users:await userUtils.countAll(),
        knowledge:await knowledgeUtils.countAll()
    }
    return res.status(200).json({status:'success',data});
}
module.exports={index};