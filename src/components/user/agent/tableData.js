import { TBody, TD, TH, THead } from "@/components/ui/table";
import Loading from "@/components/shared/loading";
export const Head=function(){
    return (
        <THead>
            <THead.TR>
            <TH>
                {"#"}
            </TH>
            <TH>
                Name
            </TH>
            <TH>
                Description
            </TH>
            <TH>
                Options
            </TH>
            </THead.TR>
        </THead>
    )
}
export const TLoading=function(){
    return (
        <TBody.TR>
            <TD colSpan={4}>
            <Loading/>
            </TD>                  
        </TBody.TR>
    )
}
export const BodyRow=function({index,pagination,item,options}){
    return (
        <TBody.TR>
            <TD>
                {(index+1)+(pagination.pageSize*pagination.pageIndex)}
            </TD>
            <TD>
                {item.name}
            </TD>
            <TD>
                {item.description}
            </TD>
            <TD>
                {
                    options
                }
            </TD>
        </TBody.TR>
    )
}

export const NoData=function(){
    return (
        <TBody.TR>
            <TD colSpan={4}>
                No data found
            </TD>
        </TBody.TR>
    )
}