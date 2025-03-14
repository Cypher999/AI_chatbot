import { get,post,put,del } from "../fetch"

export const getAll=async function(page,size,filter){
    const req=await get(`/api/admin/users?page=${page}&size=${size}&filter=${filter}`)
    return req
}

export const add=async function(fr){
    const req=await post(`/api/admin/users`,fr)
    return req
}

export const getOne=async function(id){
    const req=await get(`/api/admin/users/${id}`)
    return req
}

export const updateData=async function(id,fr){
    const req=await put(`/api/admin/users/update-data/${id}`,fr)
    return req
}

export const updatePassword=async function(id,fr){
    const req=await put(`/api/admin/users/update-password/${id}`,fr)
    return req
}

export const remove=async function(id){
    const req=await del(`/api/admin/users/${id}`)
    return req
}
