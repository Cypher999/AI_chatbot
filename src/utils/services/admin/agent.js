import { get } from "../fetch"

export const getAll=async function(page,size,filter){
    const req=await get(`/api/admin/agent?page=${page}&size=${size}&filter=${filter}`)
    return req
}