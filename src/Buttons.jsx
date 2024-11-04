import React from "react";

const Buttons = ({text, otherClass, onClick}) => {
    return (
        <div 
            onClick={onClick}
            className={`bg-sky-900 text-white py-2 w-36 rounded-md hover:bg-sky-600 cursor-pointer ${otherClass}`}
        >
            {text}
        </div>
    );
}

export default Buttons;