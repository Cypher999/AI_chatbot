import { get,post,put,del } from "../fetch"

export const getAll=async function(page,size,filter){
    const req=await get(`/api/admin/agent?page=${page}&size=${size}&filter=${filter}`)
    return req
}

export const add=async function(fr){
    const req=await post(`/api/admin/agent`,fr)
    return req
}