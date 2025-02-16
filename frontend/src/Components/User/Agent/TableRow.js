"use client"
import { useEffect, useState } from "react"
import { Button,Spinner } from "react-bootstrap"
export default ({item,readOne,del})=>{
    const [loading,setLoading]=useState(false);
    const deleteHandler=async()=>{   
        const confirmDelete=confirm('delete data ?')
        if (confirmDelete){
            setLoading(true)
            await del(item.id)
            setLoading(false)
        }
    }
    const editHandler=async()=>{   
        setLoading(true)
        await readOne(item.id)
        setLoading(false)
    }
    return (
        <tr>
            <td>{item.name}</td>
            <td>{item.context}</td>
            <td>
            {
                loading
                ?
                    <div className="d-flex justify-content-between">
                        <Spinner/>
                    </div>
                :
                <>
                    <Button className="m-2"
                        onClick={editHandler}
                    variant="warning">
                        Edit
                    </Button>
                    <Button
                    onClick={deleteHandler}
                    className="m-2" variant="danger">
                        Delete
                    </Button>
                    <a href={"/user/knowledge/"+item.id}>
                        <Button className="m-2" variant="success">
                            Knowledge
                        </Button>
                    </a>
                </>
            }                
            </td>
        </tr>
    )
}