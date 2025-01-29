const prisma=__require('utils/prismaClient')

const getAll=async ()=>{
    let data=await prisma.users.findMany()
    return data;
}

const getOne=async (id)=>{
    let data=await prisma.users.findFirst({
        where : { id }
    })
    return data;
}

module.exports={getAll,getOne}