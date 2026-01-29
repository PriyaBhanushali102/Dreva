import React from "react";

function Loader({ fullScreen = false }) {
    const containerClass = fullScreen 
        ? "fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50"
        : "flex justify-center items-center min-h-[200px]"
    return (
        <div className={containerClass}>
            <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-slate-600"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="h-8 w-8 bg-slate-600 rounded-full"></div>
                </div>
            </div>
        </div>
    );
}

export default Loader;
