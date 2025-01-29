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

const getBotId=async (botTypeId)=>{
    let data=await prisma.knowledge.findMany({
        where : { botTypeId }
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

module.exports={getAll,getOne,add,update,del,getBotId}