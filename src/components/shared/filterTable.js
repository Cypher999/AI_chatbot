import Input from "../ui/input"
import { Search } from "lucide-react"
export default function FilterTable({
    onInputChange,
    onSizeChange,
    inputValue,
    sizeValue,
}){
    return (
        <div className="block md:flex justify-between items-center mb-4">
          <Input
            icon={<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />}
            type="text"
            value={inputValue}
            onChange={onInputChange}
            className="w-full mb-2 md:w-1/3 md:mb-0 text-sm"
          />
          <select
            value={sizeValue}
            onChange={onSizeChange}
            className="border px-3 py-2 rounded-md text-sm"
          >
            {[5, 10, 20].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
    )
}