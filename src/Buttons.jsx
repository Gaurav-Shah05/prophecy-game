import React from "react";

const Buttons = ({text, otherClass, onClick}) => {
    return (
        <div 
            onClick={onClick}
            className={`bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 md:py-3 
            w-full md:w-36 rounded-xl hover:from-blue-600 hover:to-blue-700 cursor-pointer 
            transition-all duration-300 transform hover:-translate-y-1 
            shadow-lg hover:shadow-xl text-center ${otherClass}`}
        >
            {text}
        </div>
    );
}

export default Buttons;