import { get,put } from "../fetch"

export const getOne=async function(){
    const req=await get(`/api/user/profile`)
    return req
}

export const updateData=async function(fr){
    const req=await put(`/api/user/profile/update-data`,fr)
    return req
}

export const updatePassword=async function(fr){
    const req=await put(`/api/user/profile/update-password`,fr)
    return req
}

