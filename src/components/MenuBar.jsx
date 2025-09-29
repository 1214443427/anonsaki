import React, { useState } from 'react'
import MusicPlayer from './MusicPlayer'

function MenuBar({navigateTo, isOpen, setIsOpen}) {
  
  const buttonOnClick = (path) => {
    navigateTo(path)
    setIsOpen(false)
  }

  return (
    <>
      <div className={`hamburger-button ${isOpen?"toggled":""}`} 
      onClick={(e)=>{
        e.stopPropagation()
        setIsOpen(!isOpen)}
        }>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className={`menu-bar flex ${isOpen?"":"toggled"}`} onClick={(e)=>e.stopPropagation()}>
        <div className='menu-left-side'>
            <img className='logo' src='/assets/logo.jpg' alt='爱祥tv'/>
            <h1 className=''></h1>
            <MusicPlayer />
        </div>
        <div className='buttons'>
            <button className='menu-button' onClick={()=>buttonOnClick("/")}>章鱼广场</button>
            <button className='menu-button' onClick={()=>buttonOnClick("/character")}>角色展示</button>
            <button className='menu-button' onClick={()=>buttonOnClick("/relays")}>接力记录</button>
            <button className='menu-button' onClick={()=>buttonOnClick("/invitation")}>邀请函</button>
        </div>
      </div>
    </>
  )
}

export default MenuBar