const axios =require('axios');
const joi=require('joi')
const index=async (req,res)=>{
    console.log(process.env.HUGGINGFACE_TOKEN)
    const validator = joi.object({
        prompt: joi.string()
          .required()
          .messages({
            'any.required': 'Please enter your prompt'
          })
      });
    const { error } = validator.validate(req.body,{ abortEarly: false });
    if (error) {
        return res.status(500).json({code:500, status:'error',message: error.details.map(detail => {return {[detail.path]:detail.message}}) });
    }
    let prompt=`<|begin_of_text|><|start_header_id|>system<|end_header_id|>
    anda adalah sebuah chatbot asisten untuk pertanyaan yang umum, dalam menjawab pertanyaan, anda harus menggunakan bahasa indonesia,
    kecuali jika didalam pertanyaan tersebut, terdapat perintah untuk menggunakan bahasa sebaliknya,
    berikut adalah informasi tambahan yang bisa anda pakai, dimana setiap informasi dibuat dalam bentuk json dengan dua objek, topik dan deskripsi :
    [
        {topik:nama pencipta anda,deskripsi:anda diciptakan oleh seseorang bernama ratskull, dengan menggunakan meta llama sebagai base model},
        {topik:nama anda,deskripsi:anda bernama ratbot, adapaun nama tersebut berasal dari pencipta saya, ratskull },
        {topik:channel youtube dari ratskull,deskripsi:pencipta anda memiliki channel youtube bernama r@tdev }
    ]
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
    const response = await axios.post(`https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct`,{
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
    const data = response.data;
    if (data) {
      return res.status(200).json({
        status:'success',
        data:data[0].generated_text.replace(/\n+/g, " ")
      })
      
    } else {
      // reCAPTCHA failed
      return res.status(500).json({code:500,status:'error','message':'reCAPTCHA verification failed. Please try again.'});
    }
}

module.exports={index};