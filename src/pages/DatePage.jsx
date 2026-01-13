import React, { useEffect, useState } from 'react'
import PopUpModal from '../components/PopUpModal'

function DatePage() {
  const doNotRemind = useState(()=>localStorage.getItem("doNotRemind")||false)
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true
  const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent)
  const [showModal, setShowModal] = useState(true)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  useEffect(()=>{
    const handler = (e) => {
      setDeferredPrompt(e)
    }
  })

  return (
    <div>
        Date
        <PopUpModal showModal={showModal} closeModal={()=>setShowModal(false)}>
            <div>PWAhint</div>
        </PopUpModal>
    </div>
  )
}

export default DatePage