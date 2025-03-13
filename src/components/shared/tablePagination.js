import Button from "../ui/button"
import { ChevronLeft, ChevronRight,  } from "lucide-react";
export default function TablePagination({
    pagination,
    minPage,
    maxPage,
    setPagination
}){
    return (
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button
            onClick={() => {
              if(pagination.pageIndex>0){
                setPagination(n=>({
                  ...n,
                  ['pageIndex']:n.pageIndex-1
                }))
              }
            }}
            outline={true}
            variant="secondary"
            disabled={pagination.pageIndex==0}
          >
            <ChevronLeft size={16} />
            Prev
          </Button>
          {Array.from({ length: maxPage - minPage + 1 }, (_, i) => (
            <Button
              key={i + minPage - 1}
              onClick={() => {
                setPagination(n=>({
                  ...n,
                  ['pageIndex']:i
                }))
              }}
              variant="secondary"
              outline={pagination.pageIndex !== i + minPage - 1}
              disabled={pagination.pageIndex === i + minPage - 1}
            >
              {i + minPage}
            </Button>
          ))}
          <Button
            onClick={() => {
              if(pagination.pageIndex<maxPage-1){
                setPagination(n=>({
                  ...n,
                  ['pageIndex']:n.pageIndex+1
                }))
              }
            }}
            outline={true}
            variant="secondary"
            disabled={pagination.pageIndex==maxPage}
          >
            Next
            <ChevronRight size={16} />
          </Button>
        </div>
    )
}