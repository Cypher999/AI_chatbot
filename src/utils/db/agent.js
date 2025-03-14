import prisma from "../prismaClient";
export const getAll=function (params=null){
    return prisma.agent.findMany(params!==null&&{...params});
}

export const count=function (params=null){
    return prisma.agent.count(params!==null&&{...params});
}

export const getOne=function (params=null){
    return prisma.agent.findFirst(params!==null&&{...params});
}

export const add=function (data){
    const user = prisma.agent.create({data});
    return user
}

export const update=function (data,where=null){
    const user = prisma.agent.update({
        data,
        where
    })
    return user
}

export const remove=function (where=null){
    const user = prisma.agent.delete({where})
    return user
}