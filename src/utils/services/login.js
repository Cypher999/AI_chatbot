import { get } from "./fetch";

export const checkUser=async function(username){
    const req=await get('/api/auth/check-user?username='+username)
    return req;
}