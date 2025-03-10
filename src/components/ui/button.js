export default function Button({className,children,...props}){
  return (
    <button className={`mx-3 relative flex group border border-1 rounded hover:bg-gray-600 p-2 text-teal-400 cursor-pointer hover:text-teal-300 `+className} {...props}>
      {children}
    </button>
  )
}