import {  getOne } from "@/utils/db/agent"
import Joi from "joi";
const { PrismaClient } = require("@prisma/client");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
const schema = Joi.object({
  prompt: Joi.string().min(3).required(),
});
async function searchKnowledge(agentId, query) {
  const prisma = new PrismaClient();
  const model = genAI.getGenerativeModel({ model: "models/embedding-001" });
  const embeddingResponse = await model.embedContent({
    content: { parts: [{ text: query }] }
  });
  const queryEmbedding = embeddingResponse.embedding.values;

  // Step 1: Use MySQL Full-Text Search to pre-filter relevant knowledge
  const knowledgeList = await prisma.$queryRaw`
    SELECT * FROM knowledge 
    WHERE agentId = ${agentId} 
    AND MATCH(content) AGAINST(${query} IN NATURAL LANGUAGE MODE)
    LIMIT 50
  `;
  function cosineSimilarity(vecA, vecB) {
    if (!Array.isArray(vecB)) {
      console.error("Invalid embedding format:", vecB);
      return 0; // Return 0 similarity if embedding is not an array
    }

    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }

  const rankedResults = knowledgeList
    .map((knowledge) => {
      const knowledgeEmbedding = JSON.parse(knowledge.embedding || "[]"); // Ensure it's an array
      console.log(cosineSimilarity(queryEmbedding, knowledgeEmbedding))
      return {
        ...knowledge,
        similarity: cosineSimilarity(queryEmbedding, knowledgeEmbedding),
      };
    })
    .sort((a, b) => b.similarity - a.similarity) 
    .slice(0, 5);  
  return rankedResults.slice(0, 5);
}
export async function POST(req,{params}){
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
  let agentId=parseInt((await params).agentId);
  let formData=await req.formData();
  const prompt=formData.get("prompt");
  const { error } = schema.validate({prompt},{ abortEarly: false });
  if (error) {
    const validationErrors = error.details.reduce((acc, detail) => {
      const key = detail.path[0]; // Get the field name
      if (!acc[key]) {
        acc[key] = []; // Initialize as an array if not exists
      }
      acc[key].push(detail.message); // Push the error message
      return acc;
    }, {});
  
    return Response.json({ status:"validation error",message:"data incomplete",data: validationErrors }, { status: 500 });
  }
  const data=await getOne({
    where: {
        id:agentId,
        enable:true
    }
    });
    if(!data) return Response.json({ status:'error',message:'agent not found or disabled' }, { status: 404 })
    const knowledgeBase=await searchKnowledge(agentId,prompt)
  console.log(knowledgeBase.map(item=>item.content))
 let context = `
    Nama anda adalah ${data.name} , namun anda tidak perlu menyebutkan nama anda jika tidak ada yang menanyakan
    identitas anda, 

    ${data.context}
    berikut adalah informasi tambahan yang bisa anda pakai, 
    dimana setiap informasi dibuat dalam bentuk json dengan dua objek, label dan content :
    ${JSON.stringify(knowledgeBase.map(item=>item.content))}
    Harap jawab pertanyaan berikut berdasarkan informasi di atas:
    ${prompt}
  `;
  const result = await model.generateContent(context);
  if(!result) return Response.json({ status:'error',message:'error when generating answer' }, { status: 500 })
  return Response.json({status:"success",data:result.response.text()},{status:200})
}
