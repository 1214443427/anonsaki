import React, { useEffect, useState } from 'react'
import PopUpModal from '../components/PopUpModal'
import "./RedirectPages.css"

function DatePage({navigateTo}) {
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true
  const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent)
  const [showModal, setShowModal] = useState(true)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const isPromptCapable = "onbeforeinstallprompt" in window
  const [isDNRToggled, setIsDNRToggled] = useState(()=>localStorage.getItem("doNotRemind")||false)
  const [isChecked, setIsChecked] = useState(false)

  useEffect(()=>{
    const handler = (e) => {
      setDeferredPrompt(e)
      setIsInstallable(true)
    }
    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  function handleClose(){
    if(isChecked){
      localStorage.setItem("doNotRemind", isChecked)
    }
    setShowModal(false)
  }

  function handleCheckBoxToggle(){
    setIsChecked(prev=>!prev)
  }

  const shouldShodwModal = !isStandalone && isMobile && !isDNRToggled

  function handlePhotoBoothOnClick(){
    navigateTo("/photo-booth")
  }

  function handleArcadeOnClick(){
    // navigateTo("/arcade")
  }


  return (
    <div className='date-page page flex flex-col'>
      <div className='max-content-container flex-col flex'>
        <div className='dialog-box saki-border'>
          <div className='date-page-images' onClick={handlePhotoBoothOnClick}>
            <img src='/assets/photobooth-assets/sample.webp' className='photo-sample'></img>
            <img src='/assets/photobooth-assets/camera-viewfinder.png' className='camera-overlay'></img>
          </div>
          <button className='menu-button' onClick={handlePhotoBoothOnClick}>大头贴</button>
        </div>

        <div className='dialog-box saki-border'>
          <div onClick={handleArcadeOnClick}>
            🚧正在施工🚧
          </div>
          {/* <button className='menu-button'></button> */}
        </div>


        {(shouldShodwModal && !isPromptCapable) && 
          <PopUpModal showModal={showModal} closeModal={()=>setShowModal(false)} className={"PWA-hint-modal"}>
                <p>
                <span>推荐以网页APP形式访问接下来的内容。</span>
                <br/>
                🍎IOS系统:
                <br/>
                <span className='flex'>
                  Step 1: 点击右下角的更多图标： 
                  <svg className='inline-svg' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M15.9965 12H16.0054" stroke="#292D32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M11.9955 12H12.0045" stroke="#292D32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M7.99451 12H8.00349" stroke="#292D32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                </span>
                <span className='flex'>
                  Step 2: 点击分享图标： 
                  <svg className='inline-svg' fill="#000000" viewBox="10 5 30 35" xmlns="http://www.w3.org/2000/svg"><path d="M30.3 13.7L25 8.4l-5.3 5.3-1.4-1.4L25 5.6l6.7 6.7z"></path><path d="M24 7h2v21h-2z"></path><path d="M35 40H15c-1.7 0-3-1.3-3-3V19c0-1.7 1.3-3 3-3h7v2h-7c-.6 0-1 .4-1 1v18c0 .6.4 1 1 1h20c.6 0 1-.4 1-1V19c0-.6-.4-1-1-1h-7v-2h7c1.7 0 3 1.3 3 3v18c0 1.7-1.3 3-3 3z"></path></svg>
                </span>
                <span className='flex'>
                  Step 3: 下滑并选择加入主页： 
                  <svg className='inline-svg' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 12H16" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M12 16V8" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                </span>
                🤖安卓系统:
                <br/>
                <span className='flex'>
                  Step 1: 点击右上角的更多图标： 
                  <svg className='inline-svg' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M13.75 5C13.75 5.9665 12.9665 6.75 12 6.75C11.0335 6.75 10.25 5.9665 10.25 5C10.25 4.0335 11.0335 3.25 12 3.25C12.9665 3.25 13.75 4.0335 13.75 5ZM13.75 19C13.75 19.9665 12.9665 20.75 12 20.75C11.0335 20.75 10.25 19.9665 10.25 19C10.25 18.0335 11.0335 17.25 12 17.25C12.9665 17.25 13.75 18.0335 13.75 19ZM12 13.75C12.9665 13.75 13.75 12.9665 13.75 12C13.75 11.0335 12.9665 10.25 12 10.25C11.0335 10.25 10.25 11.0335 10.25 12C10.25 12.9665 11.0335 13.75 12 13.75Z"
                      fill="#000000"
                    />
                  </svg>
                </span>
                <span className='flex'>
                  Step 2: 选择加入主页
                </span>
              </p>
              <div className='flex'>
              <input type='checkbox' checked={isChecked} onChange={handleCheckBoxToggle}></input>
              <label onClick={handleCheckBoxToggle}>不再提醒</label>
            </div>
            <button className='menu-button' onClick={handleClose}>关闭</button>
          </PopUpModal>}
        {(shouldShodwModal
         && isPromptCapable && isInstallable
          ) && 
          <PopUpModal showModal={showModal} closeModal={()=>setShowModal(false)} className={"PWA-hint-modal"}>
            <p>推荐以网页APP形式访问接下来的内容。</p>
            <div className='flex'>
              <input type='checkbox' checked={isChecked} onChange={handleCheckBoxToggle}></input>
              <label onClick={handleCheckBoxToggle}>不再提醒</label>
            </div>
            <div className='flex pwa-buttons'>
              <button className='menu-button' onClick={()=>deferredPrompt.prompt()}>安装</button>
              <button className='menu-button' onClick={handleClose}>拒绝</button>
            </div>
          </PopUpModal>
        }
        </div>
    </div>
  )
}

export default DatePage