import React from 'react'
import "./RedirectPages.css"

function StudentCouncilPage({navigateTo}) {
    return (
        <div className='flex sc-room-page flex-col'>
            <div className='flex flex-col'>
                <img src='/assets/notebook.webp' 
                    className='notebook-img' 
                    alt="笔记本"
                    onClick={()=>navigateTo("/challenge")}
                ></img>
            </div>
            <div className='flex flex-col'>
                <div className='polaroid-container'
                    onClick={()=>navigateTo("/relays")}
                >
                    <div className='tape'></div>
                    <img src='/assets/relays/爱的交祥曲封面.webp'></img>
                </div>
            </div>
        </div>
    )
}

export default StudentCouncilPage