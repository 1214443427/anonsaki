import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap/gsap-core'
import React, { useState } from 'react'

function Toast({message, active}) {
  const [displayMessage, setDisplayMessage] = useState()

  useGSAP(()=>{
    if(message!=null){
      gsap.set(".toast", {opacity: 1})
      gsap.fromTo(".toast", 
        {
          yPercent: -100
        },
        {
          yPercent: 100
        }
      )
      setDisplayMessage(message)
    }else{
      gsap.fromTo(".toast", 
        {
          opacity: 1
        }, 
        {
          opacity: 0, 
          duration: 1,
        }
      )
    }
  }, [message])

  return (
    <div className={`toast ${active?"active":""}`}>
        {displayMessage}
    </div>
  )
}

export default Toast