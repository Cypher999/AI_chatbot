import { get } from "../fetch"

export const getAll=async function(page,size,filter){
    const req=await get(`/api/user/`)
    return req
}