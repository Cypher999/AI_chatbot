const prisma=__require('utils/prismaClient')
const getAll=async ()=>{
    let data=await prisma.botType.findMany({
        include:{
            user:{
                select:{
                    username:true
                }
            }
        }
    })
    return data;
}
const countAll=async ()=>{
    let data=await prisma.botType.count()
    return data;
}
const getOne=async (id)=>{
    let data=await prisma.botType.findFirst({
        where : { id }
    })
    return data;
}
const countName=async (name)=>{
    let data=await prisma.botType.count({
        where : { name }
    })
    return data;
}
const add=async (data)=>{
    const newUser=await prisma.botType.create({ data
     });
     return newUser;
 }
 const update=async (data,id)=>{
    const results=await prisma.botType.update({ data,
       where:{id} 
     });
     return results;
 }
 const del=async (id)=>{
    const results=await prisma.botType.delete({
       where:{id} 
     });
     return results;
 }
module.exports={getAll,getOne,add,update,del,countAll,countName}