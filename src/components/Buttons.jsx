const Buttons = ({ text, otherClass = "", onClick }) => {
    return (
      <div
        onClick={onClick}
        className={`bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 
        rounded-xl hover:from-blue-600 hover:to-blue-700 cursor-pointer 
        transition-all duration-300 transform hover:-translate-y-1 
        shadow-lg hover:shadow-xl text-center w-fit mx-auto ${otherClass}`}
      >
        {text}
      </div>
    );
  };
  
  export default Buttons;