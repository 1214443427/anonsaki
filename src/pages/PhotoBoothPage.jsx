import React, { useEffect, useRef, useState } from 'react'
import L2dCanvas from '../components/L2dCanvas'
import "./PhotoBoothPage.css"
import { useGSAP } from '@gsap/react';
import gsap from 'gsap/gsap-core';
import Spinner from "../components/Spinner"
import Draggable from 'gsap/src/Draggable';
import { useFetchData } from '../hooks/useFetchData';
import html2canvas from 'html2canvas';

const colors = {
blue: 'rgb(119, 153, 204)',
pink: 'rgb(255, 136, 153)',
purple: 'rgb(186, 145, 204)'
};

const BACKGROUNDS = [
    {
        name: "商城",
        url:"/assets/photobooth-assets/bg/mall.webp"
    },
    {
        name: "樱花",
        url:"/assets/photobooth-assets/bg/sakura.webp"
    },
    {
        name: "烟花",
        url:"/assets/photobooth-assets/bg/fireworks.webp"
    },
    {
        name: "街头",
        url:"/assets/photobooth-assets/bg/street-view.webp"
    },
    {
        name: "排练室",
        url:"/assets/photobooth-assets/bg/studio.webp"
    },
    {
        name: "天台",
        url:"/assets/photobooth-assets/bg/roof.webp"
    },
    {
        name: "学生会室",
        url:"/assets/photobooth-assets/bg/student-council-room.webp"
    },
    {
        name: "海边",
        url:"/assets/photobooth-assets/bg/sea.webp"
    },
    {
        name: "阁楼",
        url:"/assets/photobooth-assets/bg/anon-room.webp"
    },
    {
        name: "音乐教室",
        url:"/assets/photobooth-assets/bg/music-room.webp"
    },
    {
        name: "桌球室",
        url:"/assets/photobooth-assets/bg/saki-room.webp"
    },
]

const DECORATION_TEMPLATES = [
    {
        id: 'cat-whiskers',
        name: '胡须',
        type: 'decoration',
        url: "/assets/photobooth-assets/decorations/cat-whiskers.webp",
        width: 80,
        height: 40
    },    
    {
        id: 'cat-ear-pink',
        name: '粉猫耳',
        type: 'decoration',
        url: "/assets/photobooth-assets/decorations/cat-ear.png",
        width: 100,
        height: 50
    },
    {
        id: 'cat-ear-blue',
        name: '蓝猫耳',
        type: 'decoration',
        url: "/assets/photobooth-assets/decorations/cat-ear-blue.png",
        width: 100,
        height: 50
    },
    {
        id: 'christmas-hat',
        name: '圣诞帽',
        type: 'decoration',
        url: "/assets/christmas-hat.webp",
        width: 70,
        height: 70
    },
    {
        id: 'sunglasses',
        name: '墨镜',
        type: 'decoration',
        url: "/assets/photobooth-assets/decorations/sunglasses.webp",
        width: 80,
        height: 30
    },
    {
        id: 'glasses',
        name: '眼镜',
        type: 'decoration',
        url: "/assets/photobooth-assets/decorations/glasses.webp",
        width: 80,
        height: 30
    },
    {
        id: 'heart-blue',
        name: '蓝心',
        type: 'decoration',
        url: "/assets/blue_heart.png",
        width: 50,
        height: 50
    },
    {
        id: 'heart',
        name: '粉心',
        type: 'decoration',
        url: "/assets/pink_heart.png",
        width: 50,
        height: 50
    },
    {
        id: 'star',
        name: '星星',
        type: 'decoration',
        svg: (
    <svg
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    >
    <path
        d="
        M50 5
        L61 38
        L95 38
        L67 58
        L78 91
        L50 71
        L22 91
        L33 58
        L5 38
        L39 38
        Z
        "
        stroke="white"
        strokeWidth="4"
        strokeLinejoin="round"
    />
    </svg>
        ),
        width: 50,
        height: 50
    },
    {
        id: 'sparkle',
        name: '四角星',
        type: 'decoration',
        svg: (
        <svg viewBox="0 0 40 40" className="w-full h-full">
            <path d="M20,5 L22,18 L35,20 L22,22 L20,35 L18,22 L5,20 L18,18 Z" 
            stroke="white" strokeWidth="2"/>
        </svg>
        ),
        width: 40,
        height: 40
    }
];

const FILTER_PRESET = [
  {
    name: "原图",
    slug: "original",
    imgUrl: "assets/photobooth-assets/filters/original.webp",
    values: {
      brightness: 1,
      contrast: 1,
      saturation: 1,
      temperature: 0,
      fade: 0
    }
  },

  {
    name: "清新",
    slug: "fresh",
    imgUrl: "assets/photobooth-assets/filters/fresh.webp",
    values: {
      brightness: 1.1,
      contrast: 1.05,
      saturation: 1.15,
      temperature: 5,
      fade: 0.05
    }
  },

  {
    name: "暖阳",
    slug: "warm",
    imgUrl: "assets/photobooth-assets/filters/warm.webp",
    values: {
      brightness: 1.05,
      contrast: 1.1,
      saturation: 1.1,
      temperature: 25,
      fade: 0.08
    }
  },

  {
    name: "冷调",
    slug: "cool",
    imgUrl: "assets/photobooth-assets/filters/cool.webp",
    values: {
      brightness: 0.95,
      contrast: 1.1,
      saturation: 0.95,
      temperature: -25,
      fade: 0.05
    }
  },

  {
    name: "复古",
    slug: "vintage",
    imgUrl: "assets/photobooth-assets/filters/vintage.webp",
    values: {
      brightness: 0.9,
      contrast: 1.0,
      saturation: 0.8,
      temperature: 10,
      fade: 0.35
    }
  },

  {
    name: "胶片",
    slug: "film",
    imgUrl: "assets/photobooth-assets/filters/film.webp",
    values: {
      brightness: 0.95,
      contrast: 1.0,
      saturation: 0.8,
      temperature: 15,
      fade: 0.45
    }
  },


  {
    name: "黑白",
    slug: "bw",
    imgUrl: "assets/photobooth-assets/filters/bw.webp",
    values: {
      brightness: 1,
      contrast: 1.2,
      saturation: 0,
      temperature: 0,
      fade: 0.1
    }
  },

  {
    name: "暗调",
    slug: "dark",
    imgUrl: "assets/photobooth-assets/filters/dark.webp",
    values: {
      brightness: 0.75,
      contrast: 1.25,
      saturation: 0.9,
      temperature: -5,
      fade: 0.15
    }
  }
];


const filterSliders = [
  { key: "brightness", label: "亮度", min: 0.25, max: 1.25, step: 0.01, default: 1 },
  { key: "contrast",   label: "对比", min: 0.5, max: 1.5, step: 0.01, default: 1 },
  { key: "saturation", label: "饱和", min: 0,   max: 2.0, step: 0.01, default: 1 },
  { key: "temperature",label: "色温", min: -50, max: 50 , step: 1,    default: 0 },
  { key: "fade",       label: "淡化", min: 0,   max: 1.0, step: 0.01, default: 0 }
];

const positionSliders = [
  { key: "faceDirectionX", label: "朝向X", min: -1,    max: 1,     step: 0.01, default: 0 },
  { key: "faceDirectionY", label: "朝向Y", min: -1,    max: 1,     step: 0.01, default: 0 },
  { key: "positionX",      label: "位置X", min: -1.75, max: -0.25, step: 0.01, default: -1.35},
  { key: "positionY",      label: "位置Y", min: 0.55,  max: 1.55,  step: 0.01, default: 1.15 },
];


const subsections = [
    {
        name: "position",
        path: "M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4 0 114.7-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4 114.7 0 0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4 0-114.7 114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4-114.7 0 0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z",
        display: "位置"
    }, {
        name: "motion",
        path: "M256.5-32a56 56 0 1 1 0 112 56 56 0 1 1 0-112zM123.6 176c-3.3 0-6.2 2-7.4 5L94.2 235.9c-6.6 16.4-25.2 24.4-41.6 17.8s-24.4-25.2-17.8-41.6l21.9-54.9C67.7 129.9 94.1 112 123.6 112l97.3 0c28.5 0 54.8 15.1 69.1 39.7l32.8 56.3 61.6 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-61.6 0c-22.8 0-43.8-12.1-55.3-31.8l-10-17.1-20.7 70.4 75.4 22.6c27.7 8.3 41.8 39 30.1 65.5L285.7 509c-7.2 16.2-26.1 23.4-42.2 16.2s-23.4-26.1-16.2-42.2l49.2-110.8-95.9-28.8c-32.7-9.8-52-43.7-43.7-76.8l22.7-90.6-35.9 0zm-8 181c13.3 14.9 30.7 26.3 51.2 32.4l4.7 1.4-6.9 19.3c-5.8 16.3-16 30.8-29.3 41.8L52.9 519.8c-13.6 11.2-33.8 9.3-45-4.3s-9.3-33.8 4.3-45l82.4-67.9c4.5-3.7 7.8-8.5 9.8-13.9L115.6 357z",
        display: "动作"
    }, {
        name: "expression",
        path: "M464 256a208 208 0 1 0 -416 0 208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0zm372.2 46.3c11.8-3.6 23.7 6.1 19.6 17.8-19.8 55.9-73.1 96-135.8 96-62.7 0-116-40-135.8-95.9-4.1-11.6 7.8-21.4 19.6-17.8 34.7 10.6 74.2 16.5 116.1 16.5 42 0 81.5-6 116.3-16.6zM144 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm164 8c0 11-9 20-20 20s-20-9-20-20c0-33.1 26.9-60 60-60l16 0c33.1 0 60 26.9 60 60 0 11-9 20-20 20s-20-9-20-20-9-20-20-20l-16 0c-11 0-20 9-20 20z",
        display: "表情"
}, {
        name: "capture",
        path: "M193.1 32c-18.7 0-36.2 9.4-46.6 24.9L120.5 96 64 96C28.7 96 0 124.7 0 160L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64l-56.5 0-26-39.1C355.1 41.4 337.6 32 318.9 32L193.1 32zm-6.7 51.6c1.5-2.2 4-3.6 6.7-3.6l125.7 0c2.7 0 5.2 1.3 6.7 3.6l33.2 49.8c4.5 6.7 11.9 10.7 20 10.7l69.3 0c8.8 0 16 7.2 16 16l0 256c0 8.8-7.2 16-16 16L64 432c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l69.3 0c8 0 15.5-4 20-10.7l33.2-49.8zM256 384a112 112 0 1 0 0-224 112 112 0 1 0 0 224zM192 272a64 64 0 1 1 128 0 64 64 0 1 1 -128 0z",        
        display: "拍照"
}]

const shareData = {
    title: ""
}


// function transformViewX(deviceX)
// {
//     var screenX = deviceToScreenRef.current.transformX(deviceX); 
//     return viewMatrixRef.current.invertTransformX(screenX); 
// }


// function transformViewY(deviceY)
// {
//     var screenY = deviceToScreenRef.current.transformY(deviceY); 
//     return  viewMatrixRef.current.invertTransformY(screenY); 
// }


// function transformScreenX(deviceX)
// {
//     return deviceToScreenRef.current.transformX(deviceX);
// }


// function transformScreenY(deviceY)
// {
//     return deviceToScreenRef.current.transformY(deviceY);
// }

function SectionButtons({onClick, displayText, image, active, svg}){
    const [loading, setLoading] = useState(svg?false:true)

    return(
        <div className={`subsection-buttons flex ${active?"active": ""}`} onClick={onClick}>
            {image && <img className='button-background-images non-select' src={image} onLoad={()=>setLoading(false)}></img>}
            {svg && svg}
            {loading && <Spinner />}
            <p className='button-text'>{displayText}</p>
        </div>
    )
}

function Decorations({url, isSelected, svg, width, height, onClick, onDelete, canvasContainerRef}){
    const [scale, setScale] = useState(1)
    const [rotation, setRotation] = useState(0)
    const [center, setCenter] = useState({x: 200, y: 200})
    const ref = useRef(null)
    const parentDragRef = useRef(null)
    const [flip, setFlip] = useState(false)
    const [color, setColor] = useState("blue")
    // useGSAP(()=>{
    //     parentDragRef.current = Draggable.create(ref.current,
    //         {
    //             type: 'x, y',
    //             onPress: onClick,
    //             bounds: ".photo-booth-canvas-container",
    //             cancel: ".resizing-editor",
    //             dragClickables: true,
    //         }
    //     ) 
    // }, [])
    // useGSAP(()=>{
    //     const tl = gsap.timeline({paused:true})
    //     tl.to(".resizing-editor", {
    //         x: 3 * width,
    //         y: 3 * height,
    //         ease: "none"
    //     })
    //     Draggable.create(".resizing-editor",
    //         {
    //             type: 'x, y',
    //             onDragStart: function() {
    //                 parentDragRef.current[0].disable()
    //             },
    //             onDrag: function(){
    //                 let progress = gsap.utils.clamp(0, 1, (this.x) /(3 * width))
    //                 tl.progress(progress)
    //             },
    //             onDragEnd: function() {
    //                 parentDragRef.current[0].enable()
    //             },
    //         }
    //     ) 
    // }, [isSelected])
    const [isDragging, setIsDragging] = useState(false)
    const [isResizing, setIsResizing] = useState(false)
    const [isRotating, setIsRotating] = useState(false)
    const [anchorStart, setAnchorStart] = useState()

    function handleDragStart(e){
        onClick()
        setIsDragging(true)
        updateAnchorStart(e)
        // parentDragRef.current[0].disable()
    }

    function handleResizeStart(e){
        setIsResizing(true)
        updateAnchorStart(e)
    }
    
    function handleRotationStart(e){
        setIsRotating(true)
        updateAnchorStart(e)
    }
    
    function updateAnchorStart(e){
        e.stopPropagation()
        const rect = canvasContainerRef.current?.getBoundingClientRect();
        let x 
        let y 
        if (e.touches) {
            x = e.touches[0].clientX - (rect?.left || 0);
            y = e.touches[0].clientY - (rect?.top || 0);
        }else{
            x = e.clientX - (rect?.left || 0);
            y = e.clientY - (rect?.top || 0);
        }
        const initialDistance = Math.sqrt(Math.pow(x - center.x, 2) + Math.pow(y - center.y, 2));
        const angle = Math.atan2(y - center.y, x - center.x) * 180 / Math.PI;
        setAnchorStart({x: x, y: y, distance: initialDistance, scale: scale, angle: angle - rotation})
    }

    useEffect(() => {
        function handleMouseMove(e) {
            if (!canvasContainerRef.current) return;
        
            const rect = canvasContainerRef.current.getBoundingClientRect();
            let x 
            let y
            if (e.touches) {
                x = e.touches[0].clientX - rect.left;
                y = e.touches[0].clientY - rect.top;
            }
            else{
                x = e.clientX - rect.left;
                y = e.clientY - rect.top;
            }
            if(isDragging){
                setCenter({
                    x: gsap.utils.clamp(0, rect.width, center.x + x - anchorStart.x),
                    y: gsap.utils.clamp(0, rect.height, center.y + y - anchorStart.y)
                })
            }else if(isResizing){
                const deltaX = x - anchorStart.x
                const deltaY = y - anchorStart.y
                const currentDistance = Math.sqrt(Math.pow(x - center.x, 2) + Math.pow(y - center.y, 2));
                const distanceRatio = currentDistance / anchorStart.distance;
                const newScale = Math.max(0.3, Math.min(3, anchorStart.scale * distanceRatio));
                // console.log(deltaX, deltaY, newScale)
                setScale(newScale)
            }else if(isRotating){
                const normalize = a => ((a + 180) % 360) - 180
                const angle = Math.atan2(y - center.y, x - center.x) * 180 / Math.PI;
                setRotation(normalize(angle - anchorStart.angle));
            }
        }
        function handleDragEnd(){
            setIsDragging(false)
            setIsResizing(false)
            setIsRotating(false)
            // parentDragRef.current[0].enable()
        }
        if(isDragging||isResizing||isRotating){
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleDragEnd);
            window.addEventListener('touchmove', handleMouseMove, { passive: false });
            window.addEventListener('touchend', handleDragEnd);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleDragEnd);
            window.removeEventListener('touchmove', handleMouseMove, { passive: false });
            window.removeEventListener('touchend', handleDragEnd);
        }
    }, [isDragging, isResizing, isRotating, anchorStart]);

    return(
        <div 
            className='decoration-container flex' 
            ref={ref}
            style={{
                "--width": `${width * scale}px`,
                "--height": `${height * scale}px`,
                "--left": `${center.x - width/2 * scale}px`,
                "--top": `${center.y - height/2 * scale}px`,
                "--rotation": `${rotation}deg`
            }}
            onMouseDown={(e)=>handleDragStart(e)}
            onClick={(e)=>e.stopPropagation()}
            onTouchStart={(e)=>handleDragStart(e)}
        >
            <div className={`decoration-assets-container non-select flex ${flip?"mirror-horizontal":""}`} style={{"--color": color == "pink"? "var(--anon-color)":"var(--saki-color)"}}>
                {url && <img src={url}></img>}
                {svg && svg}
            </div>
            {isSelected && 
                <div className='edit-overlay'>
                    <div className='resizing-editor overlay-buttons flex' 
                        onMouseDown={(e)=>handleResizeStart(e)}
                        onTouchStart={(e)=>handleResizeStart(e)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="12px" height="12px"><path d="M344 0L488 0c13.3 0 24 10.7 24 24l0 144c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-39-39-87 87c-9.4 9.4-24.6 9.4-33.9 0l-32-32c-9.4-9.4-9.4-24.6 0-33.9l87-87-39-39c-6.9-6.9-8.9-17.2-5.2-26.2S334.3 0 344 0zM168 512L24 512c-13.3 0-24-10.7-24-24L0 344c0-9.7 5.8-18.5 14.8-22.2S34.1 320.2 41 327l39 39 87-87c9.4-9.4 24.6-9.4 33.9 0l32 32c9.4 9.4 9.4 24.6 0 33.9l-87 87 39 39c6.9 6.9 8.9 17.2 5.2 26.2S177.7 512 168 512z"/></svg>
                        </div>
                    <div className='overlay-close-button overlay-buttons flex' onClick={onDelete}>
                        <svg fill="#fff" height="10px" width="10px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460.775 460.775">
                            <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55  c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55  c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505  c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55  l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719  c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"/>
                        </svg>
                    </div>
                    <div className='rotation-button overlay-buttons flex'
                        onMouseDown={(e)=>handleRotationStart(e)}
                        onTouchStart={(e)=>handleRotationStart(e)}
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="12px" height="12px"><path d="M436.7 74.7L448 85.4 448 32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 128c0 17.7-14.3 32-32 32l-128 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l47.9 0-7.6-7.2c-.2-.2-.4-.4-.6-.6-75-75-196.5-75-271.5 0s-75 196.5 0 271.5 196.5 75 271.5 0c8.2-8.2 15.5-16.9 21.9-26.1 10.1-14.5 30.1-18 44.6-7.9s18 30.1 7.9 44.6c-8.5 12.2-18.2 23.8-29.1 34.7-100 100-262.1 100-362 0S-25 175 75 75c99.9-99.9 261.7-100 361.7-.3z"/></svg>
                    </div>
                    <div className='flip-button overlay-buttons flex'
                        onPointerUp={(e)=>{
                            e.preventDefault();
                            e.stopPropagation();
                            setFlip(prev=>!prev)
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M502.6 150.6l-96 96c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L402.7 160 32 160c-17.7 0-32-14.3-32-32S14.3 96 32 96l370.7 0-41.4-41.4c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l96 96c12.5 12.5 12.5 32.8 0 45.3zm-397.3 352l-96-96c-12.5-12.5-12.5-32.8 0-45.3l96-96c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3L109.3 352 480 352c17.7 0 32 14.3 32 32s-14.3 32-32 32l-370.7 0 41.4 41.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0z"/></svg>
                    </div>
                    {svg && <div className='fill-button overlay-buttons flex' 
                        onPointerUp={(e)=>{
                            e.preventDefault();
                            e.stopPropagation();
                            setColor(prev=>prev=="pink"?"blue":"pink")
                        }}
                    >
                        <svg style={{"--color": color == "pink"? "var(--saki-color)":"var(--anon-color)"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M296 64c6.9 0 13.5 2.7 18.3 7.6L440.4 197.7c4.9 4.9 7.6 11.5 7.6 18.3s-2.7 13.5-7.6 18.3L386.7 288 65.3 288c1.3-3.9 3.4-7.4 6.3-10.3l96.4-96.4 33.4 33.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L213.3 136 277.7 71.6c4.9-4.9 11.5-7.6 18.3-7.6zM122.7 136L26.3 232.4C9.5 249.3 0 272.1 0 296s9.5 46.7 26.3 63.6L152.4 485.7C169.3 502.5 192.1 512 216 512s46.7-9.5 63.6-26.3L485.7 279.6C502.5 262.7 512 239.9 512 216s-9.5-46.7-26.3-63.6L359.6 26.3C342.7 9.5 319.9 0 296 0s-46.7 9.5-63.6 26.3L168 90.7 118.6 41.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L122.7 136z"/></svg>
                    </div>}
                </div>
            }
        </div>
    )
}

function Slider({ config, onChange, reset}){
    return(
        <div className='flex input-container'>
            <span>{config.label}</span>
            <div className='slider-container flex'>
                <span>{config.min}</span>
                <input type="range" 
                    onChange={onChange} 
                    min={config.min}
                    max={config.max}
                    step={config.step}
                    value={config.value}
                    />
            <span>{config.max}</span>
            </div>
            <input type='number'
                onChange={onChange}
                min={config.min}
                max={config.max}
                step={config.step}
                value={config.value}
            />
            <button className={""} onClick={reset}> 
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M65.9 228.5c13.3-93 93.4-164.5 190.1-164.5 53 0 101 21.5 135.8 56.2 .2 .2 .4 .4 .6 .6l7.6 7.2-47.9 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 53.4-11.3-10.7C390.5 28.6 326.5 0 256 0 127 0 20.3 95.4 2.6 219.5 .1 237 12.2 253.2 29.7 255.7s33.7-9.7 36.2-27.1zm443.5 64c2.5-17.5-9.7-33.7-27.1-36.2s-33.7 9.7-36.2 27.1c-13.3 93-93.4 164.5-190.1 164.5-53 0-101-21.5-135.8-56.2-.2-.2-.4-.4-.6-.6l-7.6-7.2 47.9 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 320c-8.5 0-16.7 3.4-22.7 9.5S-.1 343.7 0 352.3l1 127c.1 17.7 14.6 31.9 32.3 31.7S65.2 496.4 65 478.7l-.4-51.5 10.7 10.1c46.3 46.1 110.2 74.7 180.7 74.7 129 0 235.7-95.4 253.4-219.5z"/></svg>
            </button>
        </div>
    )
}

function PhotoBoothPage() {
    const [character, setCharacter] = useState("init")
    const [modelData, setModelData] = useState([])
    
    const [loading, setLoading] = useState()
    const [error, setError] = useState()

    const [activeTab, setActiveTab] = useState("model")
    const activeTabRef = useRef(null)
    const [selectedCharacter, setSelectedCharacter] = useState(0)
    const [activeSubsection, setActiveSubsection] = useState("home")
    // const [pausedCharacter, setPausedCharacter] = useState([])
    // const [turnCords, setTurnCords] = useState([{x:0, y:0}, {x:0, y:0}])
    
    const [decorations, setDecorations] = useState([])
    const [selectedDecorations, setSelectedDecorations] = useState(null)
    const currentId = useRef(0)
    const canvasContainerRef = useRef(null)
    const l2dCanvasRef = useRef(null)
    const [background, setBackground] = useState(0)
    const [filterSliderValue, setFilterSliderValue] = useState({
        brightness: 1,
        contrast: 1,
        saturation: 1,
        temperature: 0,
        fade: 0,
    })

    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState(null);
    const [popupAnimationState, setPopupAnimationState] = useState("closed")
    const [isFlashing, setIsFlashing] = useState(false)
    const shutterAudioRef = useRef(null)

    useEffect(()=>{
        async function fetchData(){
            try{
                setLoading(true)
                const sakiData = await fetch('/assets/l2d/saki-matching-outfit/model.json').then(res => res.json())
                const anonData = await fetch('/assets/l2d/anon-matching-outfit/model.json').then(res => res.json())
                const textures = [
                    "/assets/l2d/anon-matching-outfit/live2d/chara/037_general_rip/texture_00.png",
                    "/assets/l2d/anon-matching-outfit/live2d/chara/037_school_winter-2023_rip/texture_01.png",
                    "/assets/l2d/anon-matching-outfit/live2d/chara/341_general_rip/texture_00.png",
                    "/assets/l2d/saki-matching-outfit/live2d/chara/341_school_winter-2023_rip/texture_01.png"
                ]
                for (let i = 0; i < textures.length; i++) {;
                    const img = new Image();
                    img.src = textures[i];  
                }

    // const {loading, data, error} = useFetchData([
    //     "/assets/l2d/anon-matching-outfit/live2d/chara/037_general_rip/texture_00.png",
    //     "/assets/l2d/anon-matching-outfit/live2d/chara/037_school_winter-2023_rip/texture_01.png",
    //     "/assets/l2d/anon-matching-outfit/live2d/chara/341_general_rip/texture_00.png",
    //     "/assets/l2d/saki-matching-outfit/live2d/chara/341_school_winter-2023_rip/texture_01.png"
    // ])
                setLoading(false)
                setCharacter("both")
                setModelData([anonData, sakiData])
            }
            catch (err){
                console.error('Failed to fetch data', err);
                setError({type:"fetch", msg:"无法获取模型信息！请联系作者B站"})
            }
        }
        fetchData();
    }, [])

    const [live2DConfigs, setLive2dConfigs] = useState([
        {
            paused: false,  
            faceDirectionX:0,
            faceDirectionY:0,
            motion: "idle01",
            expression: "default",
            motionPlayback: 0,
            positionX: -1.35,
            positionY: 1.15,
        },
        {
            paused: false,  
            faceDirectionX:0, 
            faceDirectionY:0,
            motion: "idle01",
            expression: "default",
            motionPlayback: 0,
            positionX: -0.65,
            positionY: 1.15,
        }
    ])

    useGSAP(()=>{
        const index = activeTab == "model"? 0: activeTab == "decor"? 1: activeTab == "background"? 2: 3
        gsap.to(".tabs-container", {
            xPercent: index * -25,
            duration: 0.25
        })
    }, [activeTab])

    const {contextSafe} = useGSAP(()=>{
        gsap.to(".pill", {
            xPercent: selectedCharacter * 100,
            backgroundColor: selectedCharacter? "rgb(150, 174, 210)": "rgb(246, 162, 174)",
            duration: 0.25
        })
    }, [selectedCharacter])

    useGSAP(()=>{
        const tl = gsap.timeline()
        if(popupAnimationState == "opening"){
            tl.fromTo(".sticky-note-popup", 
                {opacity: 0},
                {
                    opacity: 1,
                    duration: 0.25,
                    pointerEvents: "all"
                }
            ).fromTo(".photo-popup", {
                rotate: ()=>gsap.utils.random(-50, 50),
                top: "0%",
                yPercent: -200,
            }, {
                rotate: 0,
                top: "50%",
                yPercent: -50,
                duration: 0.5,
                ease: "none",
            }, ">")
        }else if(popupAnimationState == "closing"){
            if(generatedImage!=null){
                tl.to(".photo-popup", {
                    top: "100%",
                    yPercent: 100,
                    duration: 0.5,
                    ease: "none",
                }).to(".sticky-note-popup", 
                {
                    opacity: 0,
                    duration: 0.25,
                    pointerEvents: "none"
                }, ">"
            )
            }
        }
        tl.play()
    }, [popupAnimationState])
    
    const switchSubsection = contextSafe((section)=>{
        if (section == activeSubsection) return;
        if (section == "capture") return captureCanvas();
        const target = section !== "home"? "#home": "#back"
        const destination = section == "home"? "#home": "#back"
        const tl = gsap.timeline()
        tl.to(".subsection-container", {
            opacity: 0,
            duration: 0.25,
            onComplete: ()=> setActiveSubsection(section)
        })
        .to(target, {
            duration: 0.25,
            opacity: 0
        }, "<")
        .to(".subsection-container", {
            opacity: 1,
            duration: 0.25,
        }, ">")
        .to(destination, {
            duration: 0.25,
            opacity: 1
        }, "<")
    })

    const canvasFlash = contextSafe(()=>{
        setIsFlashing(true)
        const tl = gsap.timeline({onComplete:()=>{setIsFlashing(false)}});
        shutterAudioRef.current.play()
        tl.fromTo("#flash-overlay", 
            {opacity: 0}, 
            {opacity: 1, duration: 0.3}
        ).to("#flash-overlay",
            {opacity: 0, duration: 0.1}
        )
    })

    function handleDrag(event, character){
        const rect = event.target.getBoundingClientRect();
        const sx = transformScreenX(event.clientX - rect.left);
        const sy = transformScreenY(event.clientY - rect.top);
        const vx = transformViewX(event.clientX - rect.left);
        const vy = transformViewY(event.clientY - rect.top);
    }  


    const selectCharacter = contextSafe((character) => {
        if (character == selectedCharacter) return;
        if (activeSubsection == "home"){
            return setSelectedCharacter(character)
        }
        const direction = character? -1 : 1
        const tl = gsap.timeline()
        tl.to(".subsection-container", {
            xPercent: direction * 100,
            duration: 0.25,
            ease: "power1.out",
            onComplete: 
            ()=> setSelectedCharacter(character)
        }).set(
            ".subsection-container",{
                xPercent: (-direction) * 100,
            }
        )
        .to(".subsection-container", {
            xPercent: 0,
            ease: "power1.out",
            duration: 0.25, //replace with x-transition
        }, ">")
    })

    function toggleCharacter(character){
        setLive2dConfigs(prev => prev.map((config, index)=>(
                index == character? {...config, paused:!config.paused}: config
        )))
    }

    function changeCharacterConfig(name, value){
        const numericValue = parseFloat(value)
        setLive2dConfigs(prev => prev.map((config, index)=>(
            index == selectedCharacter? {...config, [name]:Number.isNaN(numericValue)?value:numericValue}: config
        )))
    }

    function resetConfig(){
        setLive2dConfigs(prev => prev.map((config, index)=>(
            index == selectedCharacter? {
                ...config,
                faceDirectionX:0, 
                faceDirectionY:0,
                positionX: selectedCharacter == 0? -1.35: -0.65,
                positionY: 1.15,
            }: config
        )))
    }

    function handleMotionOnClick(motion){
        changeCharacterConfig("motion", motion)
        changeCharacterConfig("motionPlayback", live2DConfigs[selectedCharacter].motionPlayback+1)
    }

    const propContainerRef = useRef(null)

    function captureCanvas(){
        if(isGenerating) return;
        setIsGenerating(true)
        canvasFlash()
        html2canvas(propContainerRef.current, {
                backgroundColor: null,
                logging: false,
                ignoreElements: el => el.classList.contains('edit-overlay'),
            }).then(
            function(canvas) {
                const glCanvas = l2dCanvasRef.current;
                const out = document.createElement('canvas');
                out.width = canvas.width
                out.height = canvas.height
                const img = new Image()
                img.src = BACKGROUNDS[background].url;
                const ctx = out.getContext('2d');
                img.onload = ()=>{                
                    ctx.drawImage(img, 0, 0, out.width, out.height);
                    requestAnimationFrame(() => {
                        ctx.filter = `brightness(${getFilterValue("brightness")})
                                        hue-rotate(${getFilterValue("hue")})
                                        saturate(${getFilterValue("saturation")})
                                        contrast(${getFilterValue("contrast")})`
                        ctx.drawImage(
                            glCanvas, 
                            0, 0, glCanvas.width, glCanvas.height,
                            0, 0, canvas.width, canvas.height
                        )
                        ctx.drawImage(canvas, 0, 0)
                        out.toBlob((blob)=>{
                            setGeneratedImage(URL.createObjectURL(blob))
                        })
                        setIsGenerating(false)
                        setPopupAnimationState("opening")
                    })
                }
            }
        )
    }

    const handleDownload = () => {
        console.log("downloading")
        if (!generatedImage) return;
        setError(null)
        const a = document.createElement('a');
        a.href = generatedImage;
        a.download = `anonsaki-win-${crypto.randomUUID()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    async function handleShare(){
        try {
            const response = await fetch(generatedImage);
            const blob = await response.blob();
            
            const file = new File([blob], `anonsaki-win-${crypto.randomUUID()}.png`, { type: blob.type });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                files: [file],
                title: 'Image Share',
                text: 'Look at this photo!'
            });
            } else {
                setError({type: "share", msg: "⚠错误:无法获得分享许可。请下载图片。"});
            }
        } catch (err) {
            console.error("Could not share file:", err);
        }
    };

    function getFilterValue(variable) {
        switch(variable) {
            case "brightness":
            return `${filterSliderValue.brightness + 0.2 * filterSliderValue.fade}`;
            case "contrast":
            return `${filterSliderValue.contrast - 0.5 * filterSliderValue.fade}`;
            case "saturation":
            return `${filterSliderValue.saturation + filterSliderValue.temperature / 200}`;
            case "hue":
            return `${filterSliderValue.temperature * 0.5}deg`;
            default:
            return "";
        }
    }

    if(error && error.type == "fetch"){
        return(
            <div>{error.msg}</div>
        )
    }

    return (
        <div className='photobooth-page flex flex-col'>
            <audio src="/assets/sound-effects/camera-shutter-click-08.mp3" ref={shutterAudioRef}></audio>
            <div 
                className='photo-booth-canvas-container flex flex-col' 
                style={{
                    "--background-image": `url(${BACKGROUNDS[background].url})`,
                    "--brightness": getFilterValue("brightness"),
                    "--contrast": getFilterValue("contrast"),
                    "--saturation": getFilterValue("saturation"),
                    "--hue": getFilterValue("hue"),
                }}
                ref={canvasContainerRef}
                onClick={(e)=>{
                    // if (e.target.dataset.drag)
                    setSelectedDecorations(null)
                }}>
                <div id='flash-overlay'></div>
                <div className='prop-container' ref={propContainerRef}>
                    {decorations.map((decoration, index)=>(
                        <Decorations 
                            key={decoration.id}
                            url={decoration.url}
                            svg={decoration.svg}
                            isSelected={selectedDecorations == decoration.id}
                            // rotation={decoration.rotation}
                            width={decoration.width}
                            height={decoration.height}
                            canvasContainerRef = {canvasContainerRef}
                            onClick={()=>{
                                setSelectedDecorations(decoration.id)
                            }}
                            onDelete={()=>setDecorations((prev)=>prev.filter((decor)=>decor.id!=decoration.id))}
                        />))
                    }
                </div>
                    <L2dCanvas 
                        character={character} 
                        width={1200} height={1400} 
                        className='photo-booth-canvas'
                        live2DConfigs={live2DConfigs}
                        ref={l2dCanvasRef}
                    />
                    {loading&&
                        <div>
                            <Spinner />
                        </div>
                    }
            </div>

            <div className='flex flex-col tools-section'>
                <div className='tabs-container flex'>
                    <div className = "tabs flex flex-col model-tab" ref={activeTab == "model"? activeTabRef: null}>
                        <div className="flex character-selection">
                            <span className='back-button flex' onClick={()=>{switchSubsection("home")}}>
                                <svg className = "back-button-svg" id='home' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                    <path d="M240 6.1c9.1-8.2 22.9-8.2 32 0l232 208c9.9 8.8 10.7 24 1.8 33.9s-24 10.7-33.9 1.8l-8-7.2 0 205.3c0 35.3-28.7 64-64 64l-288 0c-35.3 0-64-28.7-64-64l0-205.3-8 7.2c-9.9 8.8-25 8-33.9-1.8s-8-25 1.8-33.9L240 6.1zm16 50.1L96 199.7 96 448c0 8.8 7.2 16 16 16l48 0 0-104c0-39.8 32.2-72 72-72l48 0c39.8 0 72 32.2 72 72l0 104 48 0c8.8 0 16-7.2 16-16l0-248.3-160-143.4zM208 464l96 0 0-104c0-13.3-10.7-24-24-24l-48 0c-13.3 0-24 10.7-24 24l0 104z"/>                                </svg>
                                <svg className = "back-button-svg" id='back' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                    <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288 544 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-434.7 0 73.4-73.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-128 128z"/>
                                </svg>
                            </span>
                            <div className='character-toggle flex'>
                                <button className={""} onClick={()=>{selectCharacter(0)}}>Anon</button>
                                <button className={""} onClick={()=>{selectCharacter(1)}}>Saki</button>
                                <div className='pill'></div>
                            </div>
                            <button className='tools-section-buttons' id={"pause-button"} onClick={()=>{toggleCharacter(selectedCharacter)}}>{live2DConfigs[selectedCharacter].paused?"继续live2d":"暂停live2d"}</button>
                        </div>
                        <div className='subsection-container'>
                            {activeSubsection == "home" &&
                                <div className='tools-subsections flex home-subsection'>
                                    {subsections.map((section, index)=>(
                                        <div 
                                            key={index} 
                                            className='home-subsection-icon flex flex-col' 
                                            onClick={()=>switchSubsection(section.name)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                <path d={section.path} />
                                            </svg>
                                            {section.display}
                                        </div>
                                    ))}
                                </div>
                            }
                            {activeSubsection == "position" && 
                            <div className='tools-subsections flex flex-col position-subsection'>
                                {positionSliders.map((slider)=>{
                                    const defaultValue = (selectedCharacter == 1 && slider.key == "transitionX")? -0.65: slider.default
                                    return(
                                        <Slider 
                                            key={slider.key}
                                            config={{...slider, value: live2DConfigs[selectedCharacter][slider.key]}}
                                            onChange={(e)=>changeCharacterConfig(slider.key, e.target.value)} 
                                            reset={(e)=>changeCharacterConfig(slider.key, defaultValue)}
                                        />
                                )})}
                                    {/* <div className='flex input-container'>
                                        <span>朝向X轴:</span>
                                        <input type="range" 
                                            onChange={(e)=>changeCharacterConfig("faceDirectionX", e.target.value)} 
                                            min={-1}
                                            max={1}
                                            step={0.01}
                                            value={live2DConfigs[selectedCharacter].faceDirectionX}
                                            />
                                        <button className={""} onClick={(e)=>changeCharacterConfig( "faceDirectionX", 0)}> 
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M65.9 228.5c13.3-93 93.4-164.5 190.1-164.5 53 0 101 21.5 135.8 56.2 .2 .2 .4 .4 .6 .6l7.6 7.2-47.9 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 53.4-11.3-10.7C390.5 28.6 326.5 0 256 0 127 0 20.3 95.4 2.6 219.5 .1 237 12.2 253.2 29.7 255.7s33.7-9.7 36.2-27.1zm443.5 64c2.5-17.5-9.7-33.7-27.1-36.2s-33.7 9.7-36.2 27.1c-13.3 93-93.4 164.5-190.1 164.5-53 0-101-21.5-135.8-56.2-.2-.2-.4-.4-.6-.6l-7.6-7.2 47.9 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 320c-8.5 0-16.7 3.4-22.7 9.5S-.1 343.7 0 352.3l1 127c.1 17.7 14.6 31.9 32.3 31.7S65.2 496.4 65 478.7l-.4-51.5 10.7 10.1c46.3 46.1 110.2 74.7 180.7 74.7 129 0 235.7-95.4 253.4-219.5z"/></svg>
                                        </button>
                                    </div>
                                    <div className='flex input-container'>
                                        <span>朝向Y轴:</span>
                                        <input type="range" 
                                            onChange={(e)=>changeCharacterConfig( "faceDirectionY", e.target.value)} 
                                            min={-1}
                                            max={1}
                                            step={0.01}
                                            value={live2DConfigs[selectedCharacter].faceDirectionY}
                                            />
                                        <button className={""} onClick={(e)=>changeCharacterConfig("faceDirectionY", 0)}> 
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M65.9 228.5c13.3-93 93.4-164.5 190.1-164.5 53 0 101 21.5 135.8 56.2 .2 .2 .4 .4 .6 .6l7.6 7.2-47.9 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 53.4-11.3-10.7C390.5 28.6 326.5 0 256 0 127 0 20.3 95.4 2.6 219.5 .1 237 12.2 253.2 29.7 255.7s33.7-9.7 36.2-27.1zm443.5 64c2.5-17.5-9.7-33.7-27.1-36.2s-33.7 9.7-36.2 27.1c-13.3 93-93.4 164.5-190.1 164.5-53 0-101-21.5-135.8-56.2-.2-.2-.4-.4-.6-.6l-7.6-7.2 47.9 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 320c-8.5 0-16.7 3.4-22.7 9.5S-.1 343.7 0 352.3l1 127c.1 17.7 14.6 31.9 32.3 31.7S65.2 496.4 65 478.7l-.4-51.5 10.7 10.1c46.3 46.1 110.2 74.7 180.7 74.7 129 0 235.7-95.4 253.4-219.5z"/></svg>
                                        </button>
                                    </div>
                                    <div className='flex input-container'>
                                        <span>位置X轴:</span>
                                        <input type="range" 
                                            onChange={(e)=>changeCharacterConfig("positionX", e.target.value)} 
                                            min={-1.75}
                                            max={-0.25}
                                            step={0.01}
                                            value={live2DConfigs[selectedCharacter].positionX}
                                            />                            
                                        <button className={""} onClick={()=>changeCharacterConfig( "positionX", selectedCharacter==0?-1.35: -0.65)}> 
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M65.9 228.5c13.3-93 93.4-164.5 190.1-164.5 53 0 101 21.5 135.8 56.2 .2 .2 .4 .4 .6 .6l7.6 7.2-47.9 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 53.4-11.3-10.7C390.5 28.6 326.5 0 256 0 127 0 20.3 95.4 2.6 219.5 .1 237 12.2 253.2 29.7 255.7s33.7-9.7 36.2-27.1zm443.5 64c2.5-17.5-9.7-33.7-27.1-36.2s-33.7 9.7-36.2 27.1c-13.3 93-93.4 164.5-190.1 164.5-53 0-101-21.5-135.8-56.2-.2-.2-.4-.4-.6-.6l-7.6-7.2 47.9 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 320c-8.5 0-16.7 3.4-22.7 9.5S-.1 343.7 0 352.3l1 127c.1 17.7 14.6 31.9 32.3 31.7S65.2 496.4 65 478.7l-.4-51.5 10.7 10.1c46.3 46.1 110.2 74.7 180.7 74.7 129 0 235.7-95.4 253.4-219.5z"/></svg>
                                        </button>
                                    </div>
                                    <div className='flex input-container'>
                                        <span>位置Y轴:</span>
                                        <input type="range" 
                                            onChange={(e)=>changeCharacterConfig( "positionY", e.target.value)} 
                                            min={0.55}
                                            max={1.55}
                                            step={0.01}
                                            value={live2DConfigs[selectedCharacter].positionY}
                                            />
                                        <button className={""} onClick={()=>changeCharacterConfig("positionY", 1.15)}> 
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M65.9 228.5c13.3-93 93.4-164.5 190.1-164.5 53 0 101 21.5 135.8 56.2 .2 .2 .4 .4 .6 .6l7.6 7.2-47.9 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 53.4-11.3-10.7C390.5 28.6 326.5 0 256 0 127 0 20.3 95.4 2.6 219.5 .1 237 12.2 253.2 29.7 255.7s33.7-9.7 36.2-27.1zm443.5 64c2.5-17.5-9.7-33.7-27.1-36.2s-33.7 9.7-36.2 27.1c-13.3 93-93.4 164.5-190.1 164.5-53 0-101-21.5-135.8-56.2-.2-.2-.4-.4-.6-.6l-7.6-7.2 47.9 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 320c-8.5 0-16.7 3.4-22.7 9.5S-.1 343.7 0 352.3l1 127c.1 17.7 14.6 31.9 32.3 31.7S65.2 496.4 65 478.7l-.4-51.5 10.7 10.1c46.3 46.1 110.2 74.7 180.7 74.7 129 0 235.7-95.4 253.4-219.5z"/></svg>
                                        </button>
                                    </div> */}
                                    <button className={"tools-section-buttons"} onClick={resetConfig}> 
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M65.9 228.5c13.3-93 93.4-164.5 190.1-164.5 53 0 101 21.5 135.8 56.2 .2 .2 .4 .4 .6 .6l7.6 7.2-47.9 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 53.4-11.3-10.7C390.5 28.6 326.5 0 256 0 127 0 20.3 95.4 2.6 219.5 .1 237 12.2 253.2 29.7 255.7s33.7-9.7 36.2-27.1zm443.5 64c2.5-17.5-9.7-33.7-27.1-36.2s-33.7 9.7-36.2 27.1c-13.3 93-93.4 164.5-190.1 164.5-53 0-101-21.5-135.8-56.2-.2-.2-.4-.4-.6-.6l-7.6-7.2 47.9 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 320c-8.5 0-16.7 3.4-22.7 9.5S-.1 343.7 0 352.3l1 127c.1 17.7 14.6 31.9 32.3 31.7S65.2 496.4 65 478.7l-.4-51.5 10.7 10.1c46.3 46.1 110.2 74.7 180.7 74.7 129 0 235.7-95.4 253.4-219.5z"/></svg>
                                        重置所有
                                    </button>
                                </div>
                            }
                            {activeSubsection == "motion" && 
                                <div className='tools-subsections  motion-subsection'>
                                    {Object.keys(modelData[selectedCharacter].motions).map((motion, index)=>(
                                        <SectionButtons 
                                            key={`${selectedCharacter}-${index}`} 
                                            onClick={()=>handleMotionOnClick(motion)} 
                                            displayText={modelData[selectedCharacter].motions[motion][0].display_name}
                                            image = {modelData[selectedCharacter].motions[motion][0].image}
                                            active = {live2DConfigs[selectedCharacter].motion === motion}
                                            />
                                    ))}
                                </div>}
                            {activeSubsection == "expression" && 
                                <div className='tools-subsections  expression-subsection'>
                                    {modelData[selectedCharacter].expressions.map((expression, index)=>(
                                        <SectionButtons 
                                            key={`${selectedCharacter}-${index}`} 
                                            onClick={()=>changeCharacterConfig("expression", expression.name)} 
                                            displayText={expression.display_name}
                                            image = {expression.image}
                                            active = {live2DConfigs[selectedCharacter].expression === expression.name}
                                            />
                                    ))}
                                </div>}
                        </div>
                    </div>
                    <div className = "tabs decor-tab" ref={activeTab == "model"? activeTabRef: null}>
                        <div className='tools-subsections decor-subsection'>
                            {DECORATION_TEMPLATES.map(decoration=>(
                                <SectionButtons 
                                    key={decoration.id}
                                    onClick={()=>{
                                        const newId = currentId.current++
                                        setDecorations((prev)=>[...prev, {...decoration, id: newId, x:200, y:200 }])
                                        setSelectedDecorations(newId)
                                    }}
                                    displayText={decoration.name}
                                    image={decoration.url}
                                    svg={decoration.svg}
                                />
                            ))}
                        </div>
                    </div>
                    <div className = "tabs background-tab" ref={activeTab == "model"? activeTabRef: null}>
                        <div className='tools-subsections background-subsection'>
                            {BACKGROUNDS.map((background, index)=>(
                                <SectionButtons
                                    key={index}
                                    onClick={()=>setBackground(index)
                                    }
                                    displayText = {background.name}
                                    image={background.url}
                                />
                            ))}
                        </div>
                    </div>
                    <div className = "tabs flex flex-col filter-tab" ref={activeTab == "model"? activeTabRef: null}>
                        {filterSliders.map((slider, index)=>(
                            <Slider 
                                key={index} 
                                config={{...slider, value: filterSliderValue[slider.key]}}
                                onChange={(e)=>{setFilterSliderValue(prev=>({...prev, [slider.key]: parseFloat(e.target.value)}))}}
                                reset={()=>setFilterSliderValue(prev=>({...prev, [slider.key]:slider.default}))}
                            />
                        ))}
                        <div className='filter-subsection'>
                            {FILTER_PRESET.map((preset, index)=>(
                                <SectionButtons
                                key={index}
                                displayText={preset.name}
                                image={preset.imgUrl}
                                onClick={()=>setFilterSliderValue({...preset.values})}
                                /> 
                            ))}
                        </div>
                    </div>
                </div>
                <div className='flex tab-selector'>
                    <div 
                        className={`tab-selector-button ${activeTab == "model"? "active":""}`}
                        onClick={()=>{activeTab == "model" ? switchSubsection("home"):setActiveTab("model")}}
                        >
                        <svg className="selection-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M464 256a208 208 0 1 0 -416 0 208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0zm177.3 63.4C192.3 335 218.4 352 256 352s63.7-17 78.7-32.6c9.2-9.6 24.4-9.9 33.9-.7s9.9 24.4 .7 33.9c-22.1 23-60 47.4-113.3 47.4s-91.2-24.4-113.3-47.4c-9.2-9.6-8.9-24.8 .7-33.9s24.8-8.9 33.9 .7zM144 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm164 8c0 11-9 20-20 20s-20-9-20-20c0-33.1 26.9-60 60-60l16 0c33.1 0 60 26.9 60 60 0 11-9 20-20 20s-20-9-20-20-9-20-20-20l-16 0c-11 0-20 9-20 20z"/></svg>
                        模型</div>
                    <div 
                        className={`tab-selector-button ${activeTab == "decor"? "active":""}`}
                        onClick={()=>setActiveTab("decor")}
                        >
                        <svg className="selection-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2399 2399"><path className="fil0" d="M997 1050c-149 173.4375-338 356.25-594 320.3125-154 121.875-295 256.25-402 398.4375 187 104.6875 185 92.1875 417 39.0625-9 229.6875-57 401.5625-51 595.3125 237-356.25 556-701.5625 742-1226.5625-92-98.4375-55-64.0625-111-126.5625zm406-10.9375c149 173.4375 338 356.25 594 320.3125 154 121.875 295 256.25 402 398.4375-187 104.6875-185 92.1875-417 39.0625 9 229.6875 57 401.5625 51 595.3125-237-356.25-556-701.5625-742-1226.5625 92-98.4375 55-64.0625 111-126.5625zm1-542.1875c255-451.5625 905-901.5625 746 135.9375 167 787.5-318 859.375-729 343.75 35-171.875 20-346.875-16-478.125zm-43 0c-38-114.0625-299-120.3125-337 0-38 120.3125-42 389.0625 0 507.8125 42 118.75 294 123.4375 337 0 43-123.4375 38-393.75 0-507.8125zm-380 0c-255-451.5625-905-901.5625-746 135.9375-167 787.5 324 853.125 735 335.9375-35-171.875-26-339.0625 10-471.875z"/></svg>
                        装饰</div>
                    <div 
                        className={`tab-selector-button ${activeTab == "background"? "active":""}`}
                        onClick={()=>setActiveTab("background")}
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zm64 80a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM272 224c8.4 0 16.1 4.4 20.5 11.5l88 144c4.5 7.4 4.7 16.7 .5 24.3S368.7 416 360 416L88 416c-8.9 0-17.2-5-21.3-12.9s-3.5-17.5 1.6-24.8l56-80c4.5-6.4 11.8-10.2 19.7-10.2s15.2 3.8 19.7 10.2l26.4 37.8 61.4-100.5c4.4-7.1 12.1-11.5 20.5-11.5z"/></svg>
                        背景</div>
                    <div 
                        className={`tab-selector-button ${activeTab == "filter"? "active":""}`}
                        onClick={()=>setActiveTab("filter")}
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M263.4-27L278.2 9.8 315 24.6c3 1.2 5 4.2 5 7.4s-2 6.2-5 7.4L278.2 54.2 263.4 91c-1.2 3-4.2 5-7.4 5s-6.2-2-7.4-5L233.8 54.2 197 39.4c-3-1.2-5-4.2-5-7.4s2-6.2 5-7.4L233.8 9.8 248.6-27c1.2-3 4.2-5 7.4-5s6.2 2 7.4 5zM110.7 41.7l21.5 50.1 50.1 21.5c5.9 2.5 9.7 8.3 9.7 14.7s-3.8 12.2-9.7 14.7l-50.1 21.5-21.5 50.1c-2.5 5.9-8.3 9.7-14.7 9.7s-12.2-3.8-14.7-9.7L59.8 164.2 9.7 142.7C3.8 140.2 0 134.4 0 128s3.8-12.2 9.7-14.7L59.8 91.8 81.3 41.7C83.8 35.8 89.6 32 96 32s12.2 3.8 14.7 9.7zM464 304c6.4 0 12.2 3.8 14.7 9.7l21.5 50.1 50.1 21.5c5.9 2.5 9.7 8.3 9.7 14.7s-3.8 12.2-9.7 14.7l-50.1 21.5-21.5 50.1c-2.5 5.9-8.3 9.7-14.7 9.7s-12.2-3.8-14.7-9.7l-21.5-50.1-50.1-21.5c-5.9-2.5-9.7-8.3-9.7-14.7s3.8-12.2 9.7-14.7l50.1-21.5 21.5-50.1c2.5-5.9 8.3-9.7 14.7-9.7zM460 0c11 0 21.6 4.4 29.5 12.2l42.3 42.3C539.6 62.4 544 73 544 84s-4.4 21.6-12.2 29.5l-88.2 88.2-101.3-101.3 88.2-88.2C438.4 4.4 449 0 460 0zM44.2 398.5L308.4 134.3 409.7 235.6 145.5 499.8C137.6 507.6 127 512 116 512s-21.6-4.4-29.5-12.2L44.2 457.5C36.4 449.6 32 439 32 428s4.4-21.6 12.2-29.5z"/></svg>
                        滤镜</div>
                </div>
            </div>
            <div className='sticky-note-popup'>
                <div className='popup-backdrop' onClick={(e)=>{
                    e.stopPropagation();
                    setError(null)
                    setPopupAnimationState("closing")}
                }></div>
                <div className='photo-popup polaroid-container' onClick={(e)=>{e.preventDefault(); e.stopPropagation()}}>
                    <img src={generatedImage} key={generatedImage}></img>
                    <div className='photo-popup-buttons-container flex'>
                        <button className='photo-popup-buttons'
                            onClick={handleDownload}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-242.7c0-4.2-1.7-8.3-4.7-11.3L320 86.6 320 176c0 17.7-14.3 32-32 32l-160 0c-17.7 0-32-14.3-32-32l0-96-32 0zm80 0l0 80 128 0 0-80-128 0zM0 96C0 60.7 28.7 32 64 32l242.7 0c17 0 33.3 6.7 45.3 18.7L429.3 128c12 12 18.7 28.3 18.7 45.3L448 416c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM160 320a64 64 0 1 1 128 0 64 64 0 1 1 -128 0z"/></svg>
                            保存</button>
                        <button className='photo-popup-buttons'
                            onClick={handleShare}
                            >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M425.5 7c-6.9-6.9-17.2-8.9-26.2-5.2S384.5 14.3 384.5 24l0 56-48 0c-88.4 0-160 71.6-160 160 0 46.7 20.7 80.4 43.6 103.4 8.1 8.2 16.5 14.9 24.3 20.4 9.2 6.5 21.7 5.7 30.1-1.9s10.2-20 4.5-29.8c-3.6-6.3-6.5-14.9-6.5-26.7 0-36.2 29.3-65.5 65.5-65.5l46.5 0 0 56c0 9.7 5.8 18.5 14.8 22.2s19.3 1.7 26.2-5.2l136-136c9.4-9.4 9.4-24.6 0-33.9L425.5 7zm7 97l0-22.1 78.1 78.1-78.1 78.1 0-22.1c0-13.3-10.7-24-24-24L338 192c-50.9 0-93.9 33.5-108.3 79.6-3.3-9.4-5.2-19.8-5.2-31.6 0-61.9 50.1-112 112-112l72 0c13.3 0 24-10.7 24-24zm-320-8c-44.2 0-80 35.8-80 80l0 256c0 44.2 35.8 80 80 80l256 0c44.2 0 80-35.8 80-80l0-24c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 24c0 17.7-14.3 32-32 32l-256 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l24 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-24 0z"/></svg>
                            分享</button>
                    </div>
                    {error?.type == "share" && <p>{error.msg}</p>}
                </div>
            </div>
           {(!isFlashing && isGenerating) && 
           <div className='loading-popup'>
                <Spinner />
            </div>}
        </div>
    )
    }

export default PhotoBoothPage