export const Table=function({children,...props}){
    return (
        <table className="w-full border-collapse border border-gray-200">
            {children}
          </table>
    )
}

export const THead=function({children,...props}){
    
    return (
        <thead className="bg-gray-100">
            {children}
        </thead>
    )
}
THead.TR=function({children,...props}){
    return (
        <tr className="border-b">
            {children}
        </tr>
    )
}
export const TH=function({children,...props}){
    return (
        <th className="px-4 py-2 text-left" {...props}>
            {children}
        </th>
    )
}

export const TBody=function({children,...props}){
    
    return (
        <tbody {...props}>
            {children}
        </tbody>
    )
}
TBody.TR=function({children,...props}){
    return (
        <tr className="border-b hover:bg-gray-700" {...props}>
            {children}
        </tr>
    )
}
export const TD=function({children,...props}){
    return (
        <td className="px-4 py-2" {...props}>
            {children}
        </td>
    )
}