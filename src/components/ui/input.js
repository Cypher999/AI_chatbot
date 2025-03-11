
export default function Input({icon,className,label,...props}){
    return (
        <div className={`relative mb-3 ${className?className:""}`}>
            {label &&<label>{label}</label>}
            <div className={`relative ${label ? "mt-3":""}`}>
                {icon}
                <input
                    className={`w-full bg-gray-700 text-white rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 `}
                    {...props}
                />
            </div>
        </div>
    )
}