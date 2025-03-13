import Button from "@/components/ui/button"
import { BotIcon, BotOff, Edit,  ListCollapse,  Trash,} from "lucide-react";
import { useRouter } from "next/navigation";
export default function Options({
    onEditData,
    onDelete,
    onEditPassword,
    item
}){
    const router=useRouter()
    return (
        <div className="flex space-x-2 my-2 lg:my-0">
        <Button
            outline={true}
            variant="secondary"
            onClick={()=>{
                onEditData()
            }}
            className="px-3 py-1"
        >
            <Edit size={16} />
            <span className="ml-2">Edit</span>
        </Button>
        <Button
        outline={true}
        variant="danger"
            onClick={()=>{
                onDelete()
            }}
            className="px-3 py-1"
        >
            <Trash size={16} />
            <span className="ml-2">Delete</span>
        </Button>
    </div>
    )
}