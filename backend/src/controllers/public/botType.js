const botType=__require('utils/db/botType')
const index=async (req,res)=>{
    const data = await botType.getAll();
    if (data) {
      return res.status(200).json(data)
      
    } else {
      return res.status(500).json({status:'error','message':''});
    }
}
const getOne=async (req,res)=>{
    const data = await botType.getOne(parseInt(req.params.id));
    if (data) {
      return res.status(200).json(data)
      
    } else {
      return res.status(500).json({status:'error','message':''});
    }
}
module.exports={index,getOne};