import React from 'react'
import Icon from 'react-icons-kit';
import { u2716 } from "react-icons-kit/noto_emoji_regular/u2716";

const CloseWindows = ({handleClick}) => {
  return (
    <div className='absolute top-1 left-2 cursor-pointer hover:scale-110 hover:text-orange-500 duration-300' onClick={handleClick}><Icon icon={u2716} size={20}/></div>
  )
}

export default CloseWindows