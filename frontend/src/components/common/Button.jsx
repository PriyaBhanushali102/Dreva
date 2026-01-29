import React from "react";

function Button({
    children,
    onClick,
    variant = 'secondary',
    className = '',
    type = 'button',
    disabled = false,
    fullWidth = false,
    ...props
}) {

    const baseClasses = 'px-6 py-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg'
    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-slate-800 text-white hover:bg-gray-600',
        danger: 'bg-red-600 text-white hover:bg-red-700',
        outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
        dark: 'bg-gray-900 text-white border border-gray-700 hover:bg-gray-800',
        hero: 'bg-white text-black-500 hover:bg-gray-300'
    }

    const widthClass = fullWidth ? 'w-full' : '';
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variants[variant]} ${widthClass} ${className}`} {...props}>
            { children }
        </button>
    )

}

export default Button;