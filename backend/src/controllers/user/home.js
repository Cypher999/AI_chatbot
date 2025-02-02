const userUtils=__require('utils/db/users')
const botUtils=__require('utils/db/botType')
const knowledgeUtils=__require('utils/db/knowledge')

const index=async(req,res)=>{
    const data={
        botType:await botUtils.countByUserId(req.user_id),
        knowledge:await knowledgeUtils.countByUserId(req.user_id)
    }
    return res.status(200).json({status:'success',data});
}
module.exports={index};