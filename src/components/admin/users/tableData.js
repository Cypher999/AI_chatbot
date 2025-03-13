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
                Username
            </TH>
            <TH>
                Role
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
                {item.username}
            </TD>
            <TD>
                {item.role}
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