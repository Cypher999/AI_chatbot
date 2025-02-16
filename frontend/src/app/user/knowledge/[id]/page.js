import Agent from "@/Components/User/Agent/Agent"
import Knowledge from "@/Components/User/Knowledge/Knowledge"
export default async ({params})=>{
    const id=(await params).id;
    return (
        <Knowledge id={id}/>
    )
}