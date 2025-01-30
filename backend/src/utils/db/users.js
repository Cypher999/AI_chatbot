const prisma=__require('utils/prismaClient')
const {UserType}=require('@prisma/client')
const fs=require('fs')
const getAll=async ()=>{
    let data=await prisma.users.findMany()
    return data;
}

const getOne=async (id)=>{
    let data=await prisma.users.findFirst({
        where : { id }
    })
    data._img='/img_user/man.jpg';
    if(data.img!=null){
        const filePath = path.join(process.cwd(), 'img/user', data.photo);
        console.log(filePath)
        if(fs.existsSync(filePath)){
            data._img='/img_user/'+data.img
        }
    }
    return data;
}

const getUsername=async (username)=>{
    let data=await prisma.users.findFirst({
        where : { username }
    })
    return data;
}

const checkUsername=async (username)=>{
    let data=await prisma.users.count({
        where : { username }
    })
    return data;
}

const add=async (data)=>{
    const newUser=await prisma.users.create({ data: {
         ...data,
         role:UserType[data.role]
       } 
     });
     return newUser;
 }

 const update=async (data,id)=>{
    const results=await prisma.users.update({ data: {
         ...data,
         role:UserType[user.role]
       },
       where:{id} 
     });
     return results;
 }
 const del=async (id)=>{
    const results=await prisma.users.delete({
       where:{id} 
     });
     return results;
 }
 const countAll=async ()=>{
    let data=await prisma.users.count()
    return data;
}
const countUsername=async (username)=>{
    let data=await prisma.users.count({
        where : {
            username
        }
    })
    return data;
}
module.exports={getAll,getOne,add,update,del,getUsername,checkUsername,countAll,countUsername}