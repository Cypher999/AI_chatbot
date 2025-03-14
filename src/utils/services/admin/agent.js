import { get,post,put,del } from "../fetch"

export const getAll=async function(page,size,filter){
    const req=await get(`/api/admin/agent?page=${page}&size=${size}&filter=${filter}`)
    return req
}

export const add=async function(fr){
    const req=await post(`/api/admin/agent`,fr)
    return req
}

export const getOne=async function(id){
    const req=await get(`/api/admin/agent/${id}`)
    return req
}

export const update=async function(id,fr){
    const req=await put(`/api/admin/agent/${id}`,fr)
    return req
}

export const remove=async function(id){
    const req=await del(`/api/admin/agent/${id}`)
    return req
}

export const toggleBot=async function(id){
    const req=await put(`/api/admin/agent/toggle-bot/${id}`)
    return req
}