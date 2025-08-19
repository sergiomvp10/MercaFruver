import React from 'react'
import Icon from 'react-icons-kit'

const InputIcon = ({value, placeholder, icon, onChange, name, id}) => {
  return (
    <div className="flex gap-2 bg-lime-50 px-3 py-2 rounded-lg items-center hover:scale-105">
      <Icon icon={icon} size={32} color={"#F4A261"} />
      <input
        name={name}
        value={value}
        className="focus:outline-none bg-transparent px-1 caret-black"
        placeholder={placeholder}
        type="text"
        onChange={onChange}
      />
    </div>
  );
}

export default InputIcon