import Knowledge from "@/components/user/knowledge/knowledge";
export const metadata = {
    title: "AI Knowledge",
  };
export default async function ({params}){
    const agentId=(await params).agentId;
    return (
        <Knowledge agentId={agentId}/>
    )
}