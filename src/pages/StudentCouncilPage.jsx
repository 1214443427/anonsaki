import React from 'react'
import "./RedirectPages.css"

function StudentCouncilPage() {
    return (
        <div className='flex sc-room-page flex-col'>
            <div className='flex flex-col'>
                <img src='/assets/notebook.webp'></img>
                <button className='menu-button'>粉蓝笔记</button>
            </div>
            <div className='flex flex-col'>
                <div className='polaroid-container'>
                    <div className='tape'></div>
                    <img src='/assets/relays/爱的交祥曲封面.webp'></img>
                </div>
            </div>
        </div>
    )
}

export default StudentCouncilPage