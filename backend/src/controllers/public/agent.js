const agent=__require('utils/db/agent')
const index=async (req,res)=>{
    const data = await agent.getMany();
    if (data) {
      return res.status(200).json({status:'success',data})
      
    } else {
      return res.status(500).json({status:'error','message':''});
    }
}
const getOne=async (req,res)=>{
    const data = await agent.getOne(parseInt(req.params.id));
    if (data) {
      return res.status(200).json({status:'success',data})
      
    } else {
      return res.status(500).json({status:'error','message':''});
    }
}
module.exports={index,getOne};