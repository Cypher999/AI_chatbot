const axios =require('axios');
const agent=__require('utils/db/agent')
const knowledge=__require('utils/db/knowledge')
const joi=require('joi')
const {GoogleGenerativeAI}=require('@google/generative-ai')
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);

const index=async (req,res)=>{
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    const validator = joi.object({
        prompt: joi.string()
          .required()
          .messages({
            'any.required': 'Please enter your prompt'
          })
      });
    const { error } = validator.validate(req.body,{ abortEarly: false });
    const agentId=parseInt(req.params.agentId);;
    const agentData=await agent.getOne({id:agentId})
    if(!agentData) return res.status(500).json({status:'error','message':'bot id not found'});
    if(!agentData.enable) return res.status(500).json({status:'error','message':'bot is disabled by admin'});
    let knowledgeData=await knowledge.getMany({agentId})    
    knowledgeData=JSON.stringify(knowledgeData.map(n=>({label:n.label,content:n.content})))
    if (error) {
        return res.status(500).json({code:500, status:'error',message: error.details.map(detail => {return {[detail.path]:detail.message}}) });
    }
    let prompt = `
      Nama anda adalah ${agentData.name} , namun anda tidak perlu menyebutkan nama anda jika tidak ada yang menanyakan
      identitas anda, 

      ${agentData.context}
      berikut adalah informasi tambahan yang bisa anda pakai, 
      dimana setiap informasi dibuat dalam bentuk json dengan dua objek, label dan content :
      ${knowledgeData}
      Harap jawab pertanyaan berikut berdasarkan informasi di atas:
      ${req.body.prompt}
    `;
    const result = await model.generateContent(prompt);
      if(result){
        const data = result.response.text();
      if (data) {
        return res.status(200).json({
          status:'success',
          data
        })
        
      } else {
        return res.status(500).json({status:'error','message':''});
      }
    }
    else{
      return res.status(500).json({status:'error','message':'there is problem with AI model, please stand by'});
    }
    
}

module.exports={index};