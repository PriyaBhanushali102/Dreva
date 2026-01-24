import React, { useId} from "react";

const Input = React.forwardRef(function Input({
    label,
    type = "text",
    className = "",
    value="",
    ...props
}, ref) {
    const id = useId()

    return (
        <div className="w-full">
            {label && <label className="inline-block mb-1 pl-1" htmlFor={id}>
                {label}
            </label>
            }
            <input
                type={type}
                value={value}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none transition ${className}`}
                ref={ref}
                {...props}
                id={id}  
            />
        </div>
    )

})

export default Input;