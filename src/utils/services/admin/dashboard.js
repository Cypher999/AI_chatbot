import { get } from "../fetch"

export const getAll=async function(page,size,filter){
    const req=await get(`/api/admin/`)
    return req
}