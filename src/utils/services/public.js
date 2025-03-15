import { get,post } from "./fetch";

export const agentList=async function(){
    const req=await get('/api/agent-list')
    return req;
}

export const sendPrompt=async function(agentId,fr){
    const req=await post(`/api/send-prompt/${agentId}`,fr)
    return req;
}