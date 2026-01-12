import React, { useState } from 'react'
import PopUpModal from '../components/PopupModal'

function DatePage() {
    const doNotRemind = useState(()=>localStorage.getItem("doNotRemind")||false)
    const [showModal, setShowModal] = useState(true)
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