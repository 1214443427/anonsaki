import React from 'react'
import "./RedirectPages.css"

function StudentCouncilPage({navigateTo}) {
    return (
        <div className='sc-room-page flex'>
            <div className='max-content-container flex-col flex'>
                <div className='flex flex-col'>
                    <p className='sc-room-title' id='notebook-title'>粉蓝笔记</p>
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
                        <div className='flex flex-col polaroids-content-container'>
                            <img src='/assets/relays/爱的交祥曲封面.webp'></img>
                            <p className='sc-room-title'>接力记录</p>
                            <p className='sc-room-sub-title'>最后更新:  2026年, 2月, 14日</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentCouncilPage