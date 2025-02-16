const axios =require('axios');
const agent=__require('utils/db/agent')
const knowledge=__require('utils/db/knowledge')
const joi=require('joi')
const index=async (req,res)=>{
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
    let prompt=`<|begin_of_text|><|start_header_id|>system<|end_header_id|>
    Nama anda adalah ${agentData.name} , namun anda tidak perlu menyebutkan nama anda jika tidak ada yang menanyakan
    identitas anda, 
    ${agentData.context}
    berikut adalah informasi tambahan yang bisa anda pakai, 
    dimana setiap informasi dibuat dalam bentuk json dengan dua objek, label dan content :
    ${knowledgeData}
     <|eot_id|>
     <|start_header_id|>user<|end_header_id|> 
     berikut pertanyaannya: ${req.body.prompt}.
      <|eot_id|><|start_header_id|>assistant<|end_header_id|>`;
      let payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 5000,
            "temperature": 0.01,
            "top_k": 50,
            "top_p": 0.95,
            "return_full_text": false
        }
    }
    payload=JSON.stringify(payload)
    const response = await axios.post(`https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct`
      ,{
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 5000,
            "temperature": 0.01,
            "top_k": 50,
            "top_p": 0.95,
            "return_full_text": false
        }
    },{
        headers:{
            'content-type':'application/json',
            'Authorization': `Bearer ${process.env.HUGGINGFACE_TOKEN}`
        }
    });
    console.log(response.status);
      if(response.status==200){
        const data = response.data;
      if (data) {
        return res.status(200).json({
          status:'success',
          data:data[0].generated_text.replace(/\n+/g, " ")
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