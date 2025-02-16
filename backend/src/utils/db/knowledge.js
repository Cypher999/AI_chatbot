const prisma=__require('utils/prismaClient')

const getMany=async (where=null)=>{
    let data=null
    if(where==null){
        data=await prisma.knowledge.findMany()
    }
    else{
        data=await prisma.knowledge.findMany({where})
    }
    return data;
}

const getOne=async (where)=>{
    let data=await prisma.knowledge.findFirst({
        where 
    })
    return data;
}
const count=async (where=null)=>{
    let data=null;
    if(where==null){
        data=await prisma.knowledge.count()
    }
    else{
        data=await prisma.knowledge.count({
            where})
    }
    return data;
}


const add=async (data)=>{
    const newUser=await prisma.knowledge.create({ data
     });
     return newUser;
 }

 const update=async (data,where)=>{
    const results=await prisma.knowledge.update({ data,
       where 
     });
     return results;
 }
 const del=async (where)=>{
    const results=await prisma.knowledge.delete({
       where
     });
     return results;
 }

module.exports={getMany,count,getOne,add,update,del}