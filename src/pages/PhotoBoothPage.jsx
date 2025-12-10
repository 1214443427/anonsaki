import React, { useEffect, useRef, useState } from 'react'
import L2dCanvas from '../components/L2dCanvas'
import "./PhotoBoothPage.css"
import { useGSAP } from '@gsap/react';
import gsap from 'gsap/gsap-core';

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
    }]

function transformViewX(deviceX)
{
    var screenX = deviceToScreenRef.current.transformX(deviceX); 
    return viewMatrixRef.current.invertTransformX(screenX); 
}


function transformViewY(deviceY)
{
    var screenY = deviceToScreenRef.current.transformY(deviceY); 
    return  viewMatrixRef.current.invertTransformY(screenY); 
}


function transformScreenX(deviceX)
{
    return deviceToScreenRef.current.transformX(deviceX);
}


function transformScreenY(deviceY)
{
    return deviceToScreenRef.current.transformY(deviceY);
}

function PhotoBoothPage() {
    const [character, setCharacter] = useState("both")
    const [modelData, setModelData] = useState([])
    
    const [loading, setLoading] = useState()
    const [error, setError] = useState()

    const [activeTab, setActiveTab] = useState("model")
    const activeTabRef = useRef(null)
    const [selectedCharacter, setSelectedCharacter] = useState(0)
    const [activeSubsection, setActiveSubsection] = useState("home")
    // const [pausedCharacter, setPausedCharacter] = useState([])
    // const [turnCords, setTurnCords] = useState([{x:0, y:0}, {x:0, y:0}])
    
    useEffect(()=>{
        async function fetchData(){
            try{
                setLoading(true)
                const sakiData = await fetch('/assets/l2d/saki-matching-outfit/model.json').then(res => res.json())
                const anonData = await fetch('/assets/l2d/anon-matching-outfit/model.json').then(res => res.json())
                setLoading(false)
                setModelData([anonData, sakiData])
            }
            catch (err){
                console.error('Failed to fetch data', err);
                setError("无法获取模型信息！请联系作者B站")
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
            xPercent: index * -100,
            duration: 0.25
        })
    }, [activeTab])

    useGSAP(()=>{
        gsap.to(".pill", {
            xPercent: selectedCharacter * 100,
            backgroundColor: selectedCharacter? "rgb(150, 174, 210)": "rgb(246, 162, 174)",
            duration: 0.25
        })
    }, [selectedCharacter])

    const {contextSafe} = useGSAP(()=>{
    }, [activeSubsection])
    
    const switchSubsection = contextSafe((section)=>{
        if (section == activeSubsection) return;
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

    function handleDrag(event, character){
        const rect = event.target.getBoundingClientRect();
        const sx = transformScreenX(event.clientX - rect.left);
        const sy = transformScreenY(event.clientY - rect.top);
        const vx = transformViewX(event.clientX - rect.left);
        const vy = transformViewY(event.clientY - rect.top);
    }  


    const selectCharacter = contextSafe((character) => {
        if (character == selectedCharacter) return;
        console.log("toggling")
        const tl = gsap.timeline()
        tl.to(".subsection-container", {
            opacity: 0,
            duration: 0.25,
            onComplete: 
            ()=> setSelectedCharacter(character)
        })
        .to(".subsection-container", {
            opacity: 1,
            duration: 0.25, //replace with x-transition
        }, ">")
    })

    function toggleCharacter(character){
        setLive2dConfigs(prev => prev.map((config, index)=>(
                index == character? {...config, paused:!config.paused}: config
        )))
    }

    function changeCharacterConfig(character, name, value){
        const numericValue = parseFloat(value)
        setLive2dConfigs(prev => prev.map((config, index)=>(
            index == character? {...config, [name]:Number.isNaN(numericValue)?value:numericValue}: config
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

    return (
        <div className='photobooth-page flex flex-col'>
            <div className='photo-booth-canvas-container flex flex-col'>
                <div className='prop-container'>
                    <div className='cat-whisker'></div>
                </div>
                <L2dCanvas 
                    character={character} 
                    width={600} height={700} 
                    className='photo-booth-canvas'
                    live2DConfigs={live2DConfigs}
                />
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
                            <button className={""} onClick={()=>{toggleCharacter(selectedCharacter)}}>暂停</button>
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
                                    <div className='flex input-container'>
                                        <span>朝向X轴:</span>
                                        <input type="range" 
                                            onChange={(e)=>changeCharacterConfig(selectedCharacter, "faceDirectionX", e.target.value)} 
                                            min={-1}
                                            max={1}
                                            step={0.01}
                                            value={live2DConfigs[selectedCharacter].faceDirectionX}
                                            />
                                        <button className={""} onClick={(e)=>changeCharacterConfig(selectedCharacter, "faceDirectionX", 0)}> 
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M65.9 228.5c13.3-93 93.4-164.5 190.1-164.5 53 0 101 21.5 135.8 56.2 .2 .2 .4 .4 .6 .6l7.6 7.2-47.9 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 53.4-11.3-10.7C390.5 28.6 326.5 0 256 0 127 0 20.3 95.4 2.6 219.5 .1 237 12.2 253.2 29.7 255.7s33.7-9.7 36.2-27.1zm443.5 64c2.5-17.5-9.7-33.7-27.1-36.2s-33.7 9.7-36.2 27.1c-13.3 93-93.4 164.5-190.1 164.5-53 0-101-21.5-135.8-56.2-.2-.2-.4-.4-.6-.6l-7.6-7.2 47.9 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 320c-8.5 0-16.7 3.4-22.7 9.5S-.1 343.7 0 352.3l1 127c.1 17.7 14.6 31.9 32.3 31.7S65.2 496.4 65 478.7l-.4-51.5 10.7 10.1c46.3 46.1 110.2 74.7 180.7 74.7 129 0 235.7-95.4 253.4-219.5z"/></svg>
                                        </button>
                                    </div>
                                    <div className='flex input-container'>
                                        <span>朝向Y轴:</span>
                                        <input type="range" 
                                            onChange={(e)=>changeCharacterConfig(selectedCharacter, "faceDirectionY", e.target.value)} 
                                            min={-1}
                                            max={1}
                                            step={0.01}
                                            value={live2DConfigs[selectedCharacter].faceDirectionY}
                                            />
                                        <button className={""} onClick={(e)=>changeCharacterConfig(selectedCharacter, "faceDirectionY", 0)}> 
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M65.9 228.5c13.3-93 93.4-164.5 190.1-164.5 53 0 101 21.5 135.8 56.2 .2 .2 .4 .4 .6 .6l7.6 7.2-47.9 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 53.4-11.3-10.7C390.5 28.6 326.5 0 256 0 127 0 20.3 95.4 2.6 219.5 .1 237 12.2 253.2 29.7 255.7s33.7-9.7 36.2-27.1zm443.5 64c2.5-17.5-9.7-33.7-27.1-36.2s-33.7 9.7-36.2 27.1c-13.3 93-93.4 164.5-190.1 164.5-53 0-101-21.5-135.8-56.2-.2-.2-.4-.4-.6-.6l-7.6-7.2 47.9 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 320c-8.5 0-16.7 3.4-22.7 9.5S-.1 343.7 0 352.3l1 127c.1 17.7 14.6 31.9 32.3 31.7S65.2 496.4 65 478.7l-.4-51.5 10.7 10.1c46.3 46.1 110.2 74.7 180.7 74.7 129 0 235.7-95.4 253.4-219.5z"/></svg>
                                        </button>
                                    </div>
                                    <div className='flex input-container'>
                                        <span>位置X轴:</span>
                                        <input type="range" 
                                            onChange={(e)=>changeCharacterConfig(selectedCharacter, "positionX", e.target.value)} 
                                            min={-1.75}
                                            max={-0.25}
                                            step={0.01}
                                            value={live2DConfigs[selectedCharacter].positionX}
                                            />                            
                                        <button className={""} onClick={()=>changeCharacterConfig(selectedCharacter, "positionX", selectedCharacter==0?-1.35: -0.65)}> 
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M65.9 228.5c13.3-93 93.4-164.5 190.1-164.5 53 0 101 21.5 135.8 56.2 .2 .2 .4 .4 .6 .6l7.6 7.2-47.9 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 53.4-11.3-10.7C390.5 28.6 326.5 0 256 0 127 0 20.3 95.4 2.6 219.5 .1 237 12.2 253.2 29.7 255.7s33.7-9.7 36.2-27.1zm443.5 64c2.5-17.5-9.7-33.7-27.1-36.2s-33.7 9.7-36.2 27.1c-13.3 93-93.4 164.5-190.1 164.5-53 0-101-21.5-135.8-56.2-.2-.2-.4-.4-.6-.6l-7.6-7.2 47.9 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 320c-8.5 0-16.7 3.4-22.7 9.5S-.1 343.7 0 352.3l1 127c.1 17.7 14.6 31.9 32.3 31.7S65.2 496.4 65 478.7l-.4-51.5 10.7 10.1c46.3 46.1 110.2 74.7 180.7 74.7 129 0 235.7-95.4 253.4-219.5z"/></svg>
                                        </button>
                                    </div>
                                    <div className='flex input-container'>
                                        <span>位置Y轴:</span>
                                        <input type="range" 
                                            onChange={(e)=>changeCharacterConfig(selectedCharacter, "positionY", e.target.value)} 
                                            min={0.55}
                                            max={1.55}
                                            step={0.01}
                                            value={live2DConfigs[selectedCharacter].positionY}
                                            />
                                        <button className={""} onClick={()=>changeCharacterConfig(selectedCharacter, "positionY", 1.15)}> 
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M65.9 228.5c13.3-93 93.4-164.5 190.1-164.5 53 0 101 21.5 135.8 56.2 .2 .2 .4 .4 .6 .6l7.6 7.2-47.9 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 53.4-11.3-10.7C390.5 28.6 326.5 0 256 0 127 0 20.3 95.4 2.6 219.5 .1 237 12.2 253.2 29.7 255.7s33.7-9.7 36.2-27.1zm443.5 64c2.5-17.5-9.7-33.7-27.1-36.2s-33.7 9.7-36.2 27.1c-13.3 93-93.4 164.5-190.1 164.5-53 0-101-21.5-135.8-56.2-.2-.2-.4-.4-.6-.6l-7.6-7.2 47.9 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 320c-8.5 0-16.7 3.4-22.7 9.5S-.1 343.7 0 352.3l1 127c.1 17.7 14.6 31.9 32.3 31.7S65.2 496.4 65 478.7l-.4-51.5 10.7 10.1c46.3 46.1 110.2 74.7 180.7 74.7 129 0 235.7-95.4 253.4-219.5z"/></svg>
                                        </button>
                                    </div>
                                    <button className={"tools-section-buttons"} onClick={resetConfig}> 
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M65.9 228.5c13.3-93 93.4-164.5 190.1-164.5 53 0 101 21.5 135.8 56.2 .2 .2 .4 .4 .6 .6l7.6 7.2-47.9 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 53.4-11.3-10.7C390.5 28.6 326.5 0 256 0 127 0 20.3 95.4 2.6 219.5 .1 237 12.2 253.2 29.7 255.7s33.7-9.7 36.2-27.1zm443.5 64c2.5-17.5-9.7-33.7-27.1-36.2s-33.7 9.7-36.2 27.1c-13.3 93-93.4 164.5-190.1 164.5-53 0-101-21.5-135.8-56.2-.2-.2-.4-.4-.6-.6l-7.6-7.2 47.9 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 320c-8.5 0-16.7 3.4-22.7 9.5S-.1 343.7 0 352.3l1 127c.1 17.7 14.6 31.9 32.3 31.7S65.2 496.4 65 478.7l-.4-51.5 10.7 10.1c46.3 46.1 110.2 74.7 180.7 74.7 129 0 235.7-95.4 253.4-219.5z"/></svg>
                                        重置所有
                                    </button>
                                </div>
                            }
                            {activeSubsection == "motion" && 
                                <div className='tools-subsections flex flex-col motion-subsection'>
                                    <div className='motion-main-panel'>
                                        {Object.keys(modelData[selectedCharacter].motions).map((motion, index)=>(
                                            <div key={index} onClick={()=>changeCharacterConfig(selectedCharacter, "motion", motion)}>
                                                {modelData[selectedCharacter].motions[motion][0].display_name}
                                            </div>
                                        ))}
                                    </div>
                                    <div className='motion-side-panel'>
                                        <button className={""} onClick={()=>{toggleCharacter(selectedCharacter)}}>暂停</button>
                                    </div>
                                </div>}
                        </div>
                    </div>
                    <div className = "tabs flex flex-col decor-tab" ref={activeTab == "model"? activeTabRef: null}>
                        decor
                    </div>
                    <div className = "tabs flex flex-col background-tab" ref={activeTab == "model"? activeTabRef: null}>
                        background
                    </div>
                    <div className = "tabs flex flex-col filter-tab" ref={activeTab == "model"? activeTabRef: null}>
                        filter
                    </div>
                </div>
                <div className='flex tab-selector'>
                    <div 
                        className={`tab-selector-button ${activeTab == "model"? "active":""}`}
                        onClick={()=>setActiveTab("model")}
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
        </div>
    )
    }

export default PhotoBoothPage