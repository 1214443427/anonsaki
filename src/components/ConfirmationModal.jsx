import React, { useRef, useState } from 'react'
import { createPortal } from 'react-dom';
import './ConfirmationModal.css'
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap/gsap-core';


function ConfirmationModal({url, children, className}) {
    const [showModal, setShowModal] = useState(false);
    const modalRef = useRef(null)
    const handleClick = (e) =>{
        e.preventDefault();
        e.stopPropagation();
        setShowModal(true)
        modelAnimation()
    }
    
    const { contextSafe } = useGSAP()

    const modelAnimation = contextSafe(()=>{
      gsap.to(modalRef.current,
        {
          duration: 0.25,
          pointerEvents: "all",
          opacity:1,
        })
      gsap.fromTo(".confirmation-modal", 
        {
          scale: 0.8,
          y: +20
        },
        {
          duration: 0.25,
          scale: 1,
          y: 0
        },
      )
    })
  
  function openURL(urlLink){
    open(urlLink,"_blank")
    setShowModal(false)
  }

  const closeModal = contextSafe((e)=>{
    e.preventDefault();
    e.stopPropagation();
    gsap.to(modalRef.current, {
      opacity: 0,
      pointerEvents: "none",
      duration: 0.25,
    })
    setShowModal(false)
  })


  return (
    <>
      <span onClick={handleClick} className={`confirmation-link-div ${className}`}>
        {children}
      </span>

      {createPortal(
        <div className='confirmation-modal-back-drop' onClick={(e)=>closeModal(e)} ref={modalRef}>
          <div className={`confirmation-modal`} onClick={(e)=>e.stopPropagation()}>
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

export default ConfirmationModal