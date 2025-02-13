const prisma=__require('utils/prismaClient')

const getAll=async ()=>{
    let data=await prisma.knowledge.findMany()
    return data;
}

const getOne=async (id)=>{
    let data=await prisma.knowledge.findFirst({
        where : { id }
    })
    return data;
}
const countByUserId=async (userId)=>{
    let data=await prisma.knowledge.count({
        where:{
            agent:{
                userId
            }
        }
    })
    return data;
}
const getAgentId=async (agentId)=>{
    let data=await prisma.knowledge.findMany({
        where : { agentId }
    })
    return data;
}

const add=async (data)=>{
    const newUser=await prisma.knowledge.create({ data
     });
     return newUser;
 }

 const update=async (data,id)=>{
    const results=await prisma.knowledge.update({ data,
       where:{id} 
     });
     return results;
 }
 const del=async (id)=>{
    const results=await prisma.knowledge.delete({
       where:{id} 
     });
     return results;
 }

 const countAll=async ()=>{
    let data=await prisma.knowledge.count()
    return data;
}
const countLabel=async (agentId,label)=>{
    let data=await prisma.knowledge.count({
        where : { agentId,label }
    })
    return data;
}
module.exports={getAll,countByUserId,getOne,add,update,del,getAgentId,countAll,countLabel}