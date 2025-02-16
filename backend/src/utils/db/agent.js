const prisma=__require('utils/prismaClient')
const getMany=async (where=null)=>{
    let data=null
    if(where==null){
        data=await prisma.agent.findMany({
            include:{
                user:{
                    select:{
                        username:true
                    }
                }
            }
        })
    }
    else{
        data=await prisma.agent.findMany({
            include:{
                user:{
                    select:{
                        username:true
                    }
                }
            },
            where
        })
    }
    return data;
}

const count=async (where=null)=>{
    let data=null
    if(where==null){
        data=await prisma.agent.count()
    }
    else{
        data=await prisma.agent.count({where})
    }
    return data;
}

const getOne=async(where)=>{
    let data=await prisma.agent.findFirst({
        where
    })
    return data;
}

const add=async (data)=>{
    const newUser=await prisma.agent.create({ data
     });
     return newUser;
 }
 const update=async (data,where)=>{
    const results=await prisma.agent.update({ data,
       where
     });
     return results;
 }
 const del=async (where)=>{
    const results=await prisma.agent.delete({
       where
     });
     return results;
 }
module.exports={getMany,getOne,add,update,del,count}