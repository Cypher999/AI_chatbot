import Agent from "@/Components/Admin/Agent/Agent"
import Knowledge from "@/Components/Admin/Knowledge/Knowledge"
export default async ({params})=>{
    const id=(await params).id;
    return (
        <Knowledge id={id}/>
    )
}