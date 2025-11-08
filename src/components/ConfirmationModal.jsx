import React, { useState } from 'react'
import { createPortal } from 'react-dom';
import './ConfirmationModal.css'


function ConfrimationModal({url, children, className}) {
  const [showModal, setShowModal] = useState(false);
  const handleClick = (e) =>{
    e.preventDefault();
    e.stopPropagation();
    setShowModal(true)
  }
  
  function openURL(urlLink){
    open(urlLink,"_blank")
    setShowModal(false)
  }

  function closeModal(e){
    e.preventDefault();
    e.stopPropagation();
    setShowModal(false)
  }
  
  return (
    <>
      <span onClick={handleClick} className={`confirmation-link-div ${className}`}>
        {children}
      </span>

      {showModal && createPortal(
        <div className='confirmation-modal-back-drop' onClick={(e)=>closeModal(e)}>
          <div className='confirmation-modal' onClick={(e)=>e.stopPropagation()}>
            <p>即将打开外部网站, 请确定转跳</p>
            <div className='confirmation-button-container'>
                <button className='menu-button' onClick={(e)=>closeModal(e)}>取消</button>
                <button className='menu-button' onClick={()=>openURL(url)}>打开</button>
            </div>
          </div>
        </div>, document.getElementById('root')
      )}
    </>
  )
}

export default ConfrimationModal