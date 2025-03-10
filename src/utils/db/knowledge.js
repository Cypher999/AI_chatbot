import prisma from "../prismaClient";
export const getAll=function (params=null){
    return prisma.knowledge.findMany(params!==null&&{...params});
}

export const count=function (params=null){
    return prisma.knowledge.count(params!==null&&{...params});
}

export const getOne=function (params=null){
    return prisma.knowledge.findFirst(params!==null&&{...params});
}

export const add=function (data){
    const user = prisma.knowledge.create({data});
    return user
}

export const update=function (data,where=null){
    const user = prisma.knowledge.update({
        data,
        where
    })
    return user
}

export const remove=function (where=null){
    const user = prisma.knowledge.delete(where)
    return user
}