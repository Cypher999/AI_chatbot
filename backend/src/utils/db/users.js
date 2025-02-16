const prisma=__require('utils/prismaClient')
const {UserType}=require('@prisma/client')
const {existsSync}=require('fs')
const path=require('path');
const getMany=async (where=null)=>{
    let data=null
    if(where==null){
        data=await prisma.users.findMany();
    }
    else{
        data=await prisma.users.findMany({where});
    }
    data.forEach((item,index)=>{
            if(existsSync(path.join(process.cwd(),'/img/user/',item.photo))){
                data[index]._photo=__base_url('/img-user/'+item.photo)
            }
        })
    return data;
}

const getOne=async (where)=>{
    let data=await prisma.users.findFirst({
        where 
    })
    data._photo='/img-user/man.jpg';
    if(data.photo!=null){
        const filePath = path.join(process.cwd(), 'img/user', data.photo);
        if(existsSync(filePath)){
            
            data._photo=__base_url('/img-user/'+data.photo)
        }
    }
    return data;
}


const count=async (where=null)=>{
    let data=null
    if(where==null){
        data=await prisma.users.count()
    }
    else{
        data=await prisma.users.count({
            where 
        })
    }
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

 const update=async (data,where)=>{
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
       where
     });
     return results;
 }
 const del=async (where)=>{
    const results=await prisma.users.delete({
       where
     });
     return results;
 }
module.exports={getMany,count,getOne,add,update,del}