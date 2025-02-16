const prisma=__require('utils/prismaClient')
const {UserType}=require('@prisma/client')
const {existsSync}=require('fs')
const path=require('path');
const getAll=async ()=>{
    let data=await prisma.users.findMany();
    data.forEach((item,index)=>{
            if(existsSync(path.join(process.cwd(),'/img/user/',item.photo))){
                data[index]._photo=__base_url('/img-user/'+item.photo)
            }
        })
    return data;
}

const getOne=async (id)=>{
    let data=await prisma.users.findFirst({
        where : { id }
    })
    data._photo='/img_user/man.jpg';
    if(data.photo!=null){
        const filePath = path.join(process.cwd(), 'img/user', data.photo);
        if(existsSync(filePath)){
            
            data._photo=__base_url('/img_user/'+data.photo)
        }
    }
    return data;
}

const getUsername=async (username)=>{
    let data=await prisma.users.findFirst({
        where : { username }
    })
    data._photo='/img_user/man.jpg';
    if(data.photo!=null){
        const filePath = path.join(process.cwd(), 'img/user', data.photo);
        if(existsSync(filePath)){
            data._photo=__base_url('/img_user/'+data.photo)
        }
    }
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

 const update=async (data,{id})=>{
    const results=await prisma.users.update({ data: 
        data.role
        ?
        {
            ...data,
            role:UserType[data.role]
        }
        :
        {
            ...data
        }
        ,
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
module.exports={getAll,getOne,add,update,del,getUsername,checkUsername,countAll}