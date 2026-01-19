import React, { useRef, useState } from 'react'
import { createPortal } from 'react-dom';
import './ConfirmationModal.css'
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap/gsap-core';


function PopUpModal({children, className, showModal, closeModal}) {
    const modalRef = useRef(null)
    
    const { contextSafe } = useGSAP(()=>{
      if(showModal === true){
        gsap.to(modalRef.current,
          {
            duration: 0.25,
            pointerEvents: "all",
            opacity:1,
          })
        gsap.fromTo(".confirmation-modal", 
          {
            scale: 0.8,
            yPercent: +20
          },
          {
            duration: 0.25,
            scale: 1,
            yPercent: -50
          },
        ) 
      }else{
        gsap.to(modalRef.current, {
          opacity: 0,
          pointerEvents: "none",
          duration: 0.25,
        })
      }
    },{ scope: modalRef.current, dependencies: [showModal] })

  return (
    <>
        <div className='confirmation-modal-back-drop' onClick={(e)=>closeModal(e)} ref={modalRef}>
          <div className={`confirmation-modal `+className} onClick={(e)=>e.stopPropagation()}>
            {children}
          </div>
        </div>
    </>
  )
}

export default PopUpModal