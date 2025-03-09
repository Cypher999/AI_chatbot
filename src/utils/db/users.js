import prisma from "../prismaClient";
import {UserType} from "@prisma/client"
export const getAll=function (params=null){
    return prisma.users.findMany(params);
}

export const count=function (params=null){
    return prisma.users.count(params);
}

export const getOne=function (params=null){
    return prisma.users.findFirst(params);
}

export const add=function (data){
    const user = prisma.users.create({
        data:{
            ...data,
        ['role']:UserType[data.role]
        }
    });
    return user
}

export const update=function (data,where=null){
    const user = prisma.users.update({
        data:
        data.role?
        {...data,['role']:UserType[data.role]}
        :
        {...data},
        where
    })
    return user
}

export const remove=function (where=null){
    const user = prisma.users.delete(where)
    return user
}