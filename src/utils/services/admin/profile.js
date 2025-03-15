import { get,put } from "../fetch"

export const getOne=async function(id){
    const req=await get(`/api/admin/profile`)
    return req
}

export const updateData=async function(fr){
    const req=await put(`/api/admin/profile/update-data`,fr)
    return req
}

export const updatePassword=async function(fr){
    const req=await put(`/api/admin/profile/update-password`,fr)
    return req
}

