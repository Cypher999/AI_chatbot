import Button from "@/components/ui/button"
import { BotIcon, BotOff, Edit,  ListCollapse,  Trash,} from "lucide-react";
import { useRouter } from "next/navigation";
export default function Options({
    onEdit,
    onDelete,
    onToggleBot,
    item
}){
    const router=useRouter()
    return (
        <div className="flex space-x-2 my-2 lg:my-0">
        <Button
            outline={true}
            variant="secondary"
            onClick={()=>{
                onEdit()
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
        {
            item.enable
            ?
            <Button
            outline={true}
            variant="danger"
                onClick={()=>{
                    onToggleBot()
                }}
                className="px-3 py-1"
            >
                <BotOff size={16} />
                <span className="ml-2">Disable Bot</span>
            </Button>
            :
            <Button
            outline={true}
            variant="success"
                onClick={()=>{
                    onToggleBot(item.id,item.enable)
                }}
                className="px-3 py-1"
            >
                <BotIcon size={16} />
                <span className="ml-2">Enable Bot</span>
            </Button>
        }
        <Button
        outline={true}
        variant="success"
            onClick={()=>{
                router.push(`/admin/knowledge/${item.id}`)
            }}
            className="px-3 py-1"
        >
            <ListCollapse size={16} />
            <span className="ml-2">Knowledge list</span>
        </Button>
    </div>
    )
}