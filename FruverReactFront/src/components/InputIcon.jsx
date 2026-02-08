import React, { useRef } from 'react'
import Icon from 'react-icons-kit'

const InputIcon = ({value, placeholder, icon, onChange, name, id}) => {
  const inputRef = useRef(null);
  const focusInput = () => inputRef.current?.focus();
  return (
    <div onClick={focusInput} className="flex gap-2 bg-gray-100 px-3 py-2 rounded-lg items-center cursor-text w-full">
      <Icon icon={icon} size={24} color={"#F4A261"} />
      <input
        ref={inputRef}
        name={name}
        value={value}
        className="focus:outline-none bg-transparent px-1 caret-black w-full"
        placeholder={placeholder}
        type="text"
        onChange={onChange}
      />
    </div>
  );
}

export default InputIcon
