import React from 'react'
import CloseWindows from './CloseWindows';

const Modal = (props) => {
  return (
    <div>
      <div className="absolute grid place-content-center w-96 h-138 z-10 top-0 left-0 right-0 bottom-0 m-auto bg-lime-400 text-black rounded-lg shadow-2xl">
        <CloseWindows handleClick={props.handleModal}/>
        {props.children}
      </div>
      <div className="grid z-0 place-content-center absolute w-screen h-screen top-0 bg-black/70 opacity-50">
      </div>
    </div>
  );
}

export default Modal