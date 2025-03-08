export default function TextInput({icon,onChange,name,label,type,placeholder,required}){
    return (
        <div className="relative">
            {label &&<label>{label}</label>}
            <div className={`"relative ${label ? "mt-3":""}"`}>
                {icon}
                <input
                    type={type}
                    placeholder={placeholder}
                    name={name}
                    {...required && required}
                    className="w-full bg-gray-700 text-white rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={onChange}
                />
            </div>
        </div>
    )
}