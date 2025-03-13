import { get,post,put,del } from "../fetch"

export const getAll=async function(agentId,page,size,filter){
    const req=await get(`/api/admin/knowledge/${agentId}?page=${page}&size=${size}&filter=${filter}`)
    return req
}

export const add=async function(agentId,fr){
    const req=await post(`/api/admin/knowledge/${agentId}`,fr)
    return req
}

export const getOne=async function(agentId,id){
    const req=await get(`/api/admin/knowledge/${agentId}/${id}`)
    return req
}

export const update=async function(agentId,id,fr){
    const req=await put(`/api/admin/knowledge/${agentId}/${id}`,fr)
    return req
}

export const remove=async function(agentId,id){
    const req=await del(`/api/admin/knowledge/${agentId}/${id}`)
    return req
}
