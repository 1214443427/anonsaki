import React, { useEffect, useState } from 'react'
import MusicPlayer from './MusicPlayer'

function MenuBar({navigateTo}) { //, isOpen, setIsOpen
  const [isOpen, setIsOpen] = useState(false)

  const buttonOnClick = (path) => {
    navigateTo(path)
    setIsOpen(false)
  }

  const toggleMenu = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

  useEffect(()=>{
    const closeMenu = (e) => {
      e.stopPropagation()
      setIsOpen(false)
    }
    window.addEventListener("click", closeMenu)
    window.addEventListener("scroll", closeMenu)
    return () => {
      window.removeEventListener("click", closeMenu)
      window.removeEventListener("scroll", closeMenu)
    }
  }, [])

  return (
    <>
      <div className={`hamburger-button ${isOpen?"toggled":""}`} 
        onClick={(e)=>{toggleMenu(e)}}
        // onTouch={(e)=>{toggleMenu(e)}}
        >
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className={`menu-bar flex ${isOpen?"":"toggled"}`} onClick={(e)=>e.stopPropagation()}>
        <div className='menu-left-side'>
            {/* <div className='logo-container'>
              <div class="triangle-up">
                <img className="logo" src='/assets/anon-avatar.webp' />
              </div>
              <div class="triangle-down"></div> */}
            <img className='logo' src='/assets/combined-avatar.webp' alt='爱祥tv' onClick={()=>buttonOnClick("/")}/>
            {/* </div> */}
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