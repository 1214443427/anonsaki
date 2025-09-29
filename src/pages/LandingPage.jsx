import React, { use, useEffect, useRef, useState } from 'react'
import gsap from "gsap";
import Physics2DPlugin from 'gsap/Physics2DPlugin';
import { useGSAP } from '@gsap/react';
import { useIdle } from '../hooks/useIdle';

gsap.registerPlugin(Physics2DPlugin) 
gsap.registerPlugin(useGSAP);

const OCTOPUS_SIZE = .25 * window.innerWidth
const INITIAL_POSITION = {sakiX:0.60 , sakiY:0.2,
                        sakiXMobile:0.35 , sakiYMobile:0.7,
                        anonX:0.15 , anonY:0.2  };
const AVE_MYGO = [
    {
        emoji: "🐧",
        location: "left"
    }, {
        emoji: "🐱",
        location: "left"
    }, {
        emoji: "🐼",
        location: "left"
    }, {
        emoji: "🦊",
        location: "left"
    }, {
        emoji: "🥒",
        location: "right"
    }, {
        emoji: "🐺",
        location: "right"
    }, {
        emoji: "🐕",
        location: "right"
    }, {
        emoji: "🐈‍⬛",
        location: "right"
    }
]

function EmojiBubble({emoji, index}){
    
    const [properties, setProperties] = useState(()=>({
        animationDelay: (index%5) * 2,
        offset: Math.random()*10+10,
        animationDuration: Math.random()*8 + 12
    }))

    return(
        <div 
            className={`emoji-bubble non-select ${emoji.location}`} 
            style={{
                animationDelay: `${properties.animationDelay}s`,
                "--offset": `${properties.offset}%`,
                "--animationDuration" : `${properties.animationDuration}s`,
                }}>
            {emoji.emoji}
        </div>
    )
}

function HeartBullet({timeline, index}){
    const ref = useRef(null);
    const hearts = ["❤️", "🩷", "🩵", "💙"]
    const selectedHeart = gsap.utils.random(hearts)
    useGSAP(()=>{
        if (!ref.current) return;

        timeline && timeline.set(ref.current, {
            opacity: 1,
        }, "<")
        .to(ref.current, {
            scale: gsap.utils.random(1, 3), // Scale between 0.5 and 1
            duration: 0.3, // Quick pop-in effect
            ease: "power3.out"
        }, "<")
        .to(ref.current, {
            duration: 2.45,
            physics2D: {
              velocity: gsap.utils.random(500, 400), // Random velocity
              angle: gsap.utils.random(180, 360),
              gravity: 400
            },
            // onComplete: ()=>gsap.to(ref.current, {opacity:0, duration: 1})
        }, "<").to(ref.current, {
            opacity:0,
            duration: 2.45,
            ease: "power3.in"
        }, "<")
    
        // timelinesRef.current[index] = tl;
    }, [timeline, index])

    return <div ref={ref} className='heart-bullet'>{selectedHeart}</div>
}


function LandingPage({navigateTo}) {
    const [isMobile, setisMobile] = useState(769 > window.innerWidth)
    const [sakiOcto, setSakiOcto ] = useState({
        xCord: INITIAL_POSITION.sakiX * window.innerWidth,
        yCord: INITIAL_POSITION.sakiY * window.innerHeight,
        isDragging: false,
        flipHorizontal: true
    });
    const [anonOcto, setAnonOcto ] = useState({
        xCord: INITIAL_POSITION.anonX * window.innerWidth,
        yCord: INITIAL_POSITION.anonY * window.innerHeight,
        isDragging: false,
        flipHorizontal: false
    })

    const [dragState, setDragState] = useState({
        offsetX: 0,
        offsetY: 0
    });

    const [isAnimationPlaying, setIsAnimationPlaying] = useState(false)
    const [isFinished, setIsFinished] = useState(false)

    const containerRef = useRef(null);
    const sakiRef = useRef(null);
    const anonRef = useRef(null);
    const curtainRef = useRef(null);
    const blushRef = useRef(null);    

    const isIdle = useIdle(10000);

    const handleDragStart = (imageNumber) => (e) => {
        // e.preventDefault(); not needed because passive
        if (isAnimationPlaying) return;
        if(imageNumber == 1){
            console.log("setting anon")
            setAnonOcto(prev=>({
                ...prev,
                isDragging: true
            }))
            setDragState({
                offsetX: e.clientX - anonOcto.xCord,
                offsetY: e.clientY - anonOcto.yCord
            })
        }else{
            setSakiOcto(prev=>({
                ...prev,
                isDragging: true
            }))
            setDragState({
                offsetX: e.clientX - sakiOcto.xCord,
                offsetY: e.clientY - sakiOcto.yCord
            })
        }
    }

    const handleMouseMove = (e) => {
        if (!anonOcto.isDragging && !sakiOcto.isDragging || isFinished) return;
        const x = e.clientX - dragState.offsetX;
        const y = e.clientY - dragState.offsetY
        setCordinate(x,y)
    };

    const handleDragEnd = () => {
        setAnonOcto(prev => ({ 
        ...prev, 
        isDragging: false
        }));
        setSakiOcto(prev => ({ 
        ...prev, 
        isDragging: false
        }));
        setDragState({offsetX:0, offsetY:0})
    };
    
    const handleTouchMove = (e) => {
        // e.preventDefault(); not needed because passive
        if (!anonOcto.isDragging && !sakiOcto.isDragging || isFinished) return;
        const touch = e.touches[0];
        const x = touch.clientX - dragState.offsetX;
        const y = touch.clientY - dragState.offsetX;
        setCordinate(x,y)
    };

    const setCordinate = (x, y) => {
        const xAdjusted = x //- 0.5 * OCTOPUS_SIZE 
        const yAdjusted = y //- 0.5 * OCTOPUS_SIZE
        if(anonOcto.isDragging){
            setAnonOcto(prev=>({
                ...prev,
                xCord: xAdjusted,
                yCord: yAdjusted,
            }))
            if(xAdjusted >= sakiOcto.xCord){
                setAnonOcto(prev=>({
                ...prev,
                flipHorizontal:true
                }))
                setSakiOcto(prev=>({
                ...prev,
                flipHorizontal:false
                }))
            }else if(xAdjusted < sakiOcto.xCord){
                setAnonOcto(prev=>({
                ...prev,
                flipHorizontal:false
                }))
                setSakiOcto(prev=>({
                ...prev,
                flipHorizontal:true
                }))
                // sakiRef.current.classList.add("mirror-horizontal")
                // anonRef.current.classList.remove("mirror-horizontal")
            }
        }else{
            setSakiOcto(prev=>({
                ...prev,
                xCord: xAdjusted,
                yCord: yAdjusted,
            }))
            if(xAdjusted <= anonOcto.xCord){
                setAnonOcto(prev=>({
                ...prev,
                flipHorizontal:true
                }))
                setSakiOcto(prev=>({
                ...prev,
                flipHorizontal:false
                }))
                // anonRef.current.classList.add("mirror-horizontal")
                // sakiRef.current.classList.remove("mirror-horizontal")
            }else if(xAdjusted > anonOcto.xCord){
                setAnonOcto(prev=>({
                ...prev,
                flipHorizontal:false
                }))
                setSakiOcto(prev=>({
                ...prev,
                flipHorizontal:true
                }))
                // sakiRef.current.classList.add("mirror-horizontal")
                // anonRef.current.classList.remove("mirror-horizontal")
            }
        }
    }


    // Add event listeners
    useEffect(() => {
        if (anonOcto.isDragging||sakiOcto.isDragging) {
            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('touchend', handleDragEnd);
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleDragEnd);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleDragEnd);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleDragEnd);
        }
    }, [sakiOcto.isDragging, anonOcto.isDragging]);
    
    const intersect = (a, b) => {
        const grace = 0.5 * OCTOPUS_SIZE
        console.log(a, b)
        return (
            a.xCord + grace <= b.xCord + OCTOPUS_SIZE &&
            a.xCord - grace + OCTOPUS_SIZE >= b.xCord &&
            a.yCord + grace <= b.yCord + OCTOPUS_SIZE &&
            a.yCord - grace + OCTOPUS_SIZE >= b.yCord
        )
    }


    useEffect(()=> {
        if (intersect(sakiOcto, anonOcto)){
            setSakiOcto(prev=>({
                ...prev,
                isDragging: false
            }))
            setAnonOcto(prev=>({
                ...prev,
                isDragging: false
            }))
            // setTimeout(()=>{
            //     setIsAnimationPlaying(true)
            // }, 500)
            // setTimeout(()=>{
            //     setIsJumping(true)
            // }, 3500)
            // setTimeout(()=>{
            //     setTouching(true)
            // }, 500000)

            //set position of heart bullet to sakiOcto and anonOcto's x/y coordinate in between. 

            setIsFinished(true)
            lunchHeartCanon()
            jumpAnimation()
        }
    }, [sakiOcto.xCord, sakiOcto.yCord, anonOcto.xCord, anonOcto.yCord])

    useEffect(()=>{
        function onResize(){
            const mobile = 769 > window.innerWidth
            setisMobile(mobile)
            if (mobile){
                setAnonOcto(prev=>({
                    ...prev,
                    xCord: INITIAL_POSITION.anonX * window.innerWidth,
                    yCord: INITIAL_POSITION.anonY * window.innerHeight,
                }))
                setSakiOcto(prev=>({
                    ...prev,
                    xCord: INITIAL_POSITION.sakiXMobile * window.innerWidth,
                    yCord: INITIAL_POSITION.sakiYMobile * window.innerHeight,
                }))
            }else{
                setAnonOcto(prev=>({
                    ...prev,
                    xCord: INITIAL_POSITION.anonX * window.innerWidth,
                    yCord: INITIAL_POSITION.anonY * window.innerHeight,
                }))
                setSakiOcto(prev=>({
                    ...prev,
                    xCord: INITIAL_POSITION.sakiX * window.innerWidth,
                    yCord: INITIAL_POSITION.sakiY * window.innerHeight,
                }))
            }
        }
        window.addEventListener('resize', onResize)
        onResize()
        return ()=>{
            window.removeEventListener('resize', onResize)
        }
    },[]) //TODO. change to percentages. 
    
    
    const emojiBubbles = AVE_MYGO.map((member, index)=>(<EmojiBubble emoji={member} index={index} key={index}/>))
    
    const [tl, setTl] = useState();
    
    const { contextSafe } = useGSAP(() => {
        const tl = gsap.timeline({ paused: true});
        setTl(tl);
    });
    const jumpAnimation = contextSafe(() => {
        const saki = sakiRef.current;
        const curtain = curtainRef.current;

        const startY = saki.getBoundingClientRect().bottom - OCTOPUS_SIZE/2
        const jumpHeight = 100;


        const tl = gsap.timeline({onComplete: () => {
            navigateTo('/character')
        }})

        tl.to(blushRef.current, {
            opacity: 1,
            duration: 2,
            delay: 0.25
        }).to(saki, {
            y: (-jumpHeight),
            duration: 0.5,
            ease: "linear",
            yoyo: true,
            repeat: 3,
        }, ">").to(saki, {
            y: (-startY),
            duration: 1,
            ease: "power2.out",
            zIndex: 10,
        }, ">").to(saki,{
            y: window.innerHeight - startY,
            duration: 2,
            ease: "power2.in",
        }, ">").to(curtain,{
            y: window.innerHeight , // drop curtain fully down
            duration: 2,
            ease: "power2.in",
        }, "<" )    
    })
    // const timelinesRef = useRef([]);
    const heartBullets = Array.from({ length: 5 }).map((_, i)=>(<HeartBullet key={i} index={i} timeline={tl}/>))
    const lunchHeartCanon = contextSafe(() => {tl.play()})
    
    useGSAP(()=>{
        if(isIdle){
            console.log("isIdle", isIdle)
            const yoyoTL = gsap.timeline({ repeat: -1, repeatDelay: 2})
            yoyoTL.to( ".octo-image",{
                x:"+=5", 
                yoyo:true, 
                repeat:5, 
                duration:0.1
            })
            gsap.to(".drag-me-message", {
                opacity: 1,
                duration: 1
            })
        }
    },{dependencies: [isIdle], revertOnUpdate:true})

    // useEffect(()=>{
    //     if (heartBullets.length > 0){
    //         const tl = gsap.timeline().to(heartBullets, {
    //             opacity: 1,
    //             duration: 0.25,
    //         }).to(heartBullets, {
    //             duration: 1,
    //             physics2D: {
    //                 velocity: "random(600,  850)",
    //                 angle: ()=> "random(0, 180)",
    //                 gravity: 600,
    //             }
    //         })
    //     }
    // }, [heartBullets])

    return (
        <div
            ref={containerRef}
            className='page landing-page flex'
            >

            <div
                className={`absolute  ${anonOcto.isDragging ? 'z-10 dragging' : 'z-1'}`}
                data-draggable={true}
                style={{
                    left: `${anonOcto.xCord}px`,
                    top: `${anonOcto.yCord}px`,
                    transform: anonOcto.flipHorizontal? "scaleX(-1)":""
                }}
                onMouseDown={handleDragStart(1)}
                onTouchStart={handleDragStart(1)}
                ref={anonRef}
            >
                <p className={`drag-me-message dmm--a1`}>拖动我</p>
                <p className={`drag-me-message dmm--a2`}>拖动我</p>
                {heartBullets}
                <img 
                    className={`octo-image non-select ${anonOcto.isDragging? 'dragging':''}`}
                    src="/assets/anon_octo.webp" 
                    alt="Pink Octopus" 
                    draggable="false"
                />
            </div>


            <div
                className={`octo-container absolute  ${sakiOcto.isDragging ? 'z-10 dragging' : 'z-1'}`}
                data-draggable={true}
                style={{
                    left: `${sakiOcto.xCord}px`,
                    top: `${sakiOcto.yCord}px`,
                    // transform: `translateY(${isJumping? - 100:0}px) ${sakiOcto.flipHorizontal? "scaleX(-1)":""}`, 
                    // transition: `transform 0.5s ease-out`,
                    "--sx": sakiOcto.flipHorizontal ? -1 : 1
                }}
                onMouseDown={handleDragStart(2)}
                onTouchStart={handleDragStart(2)}
                ref={sakiRef}
                >
                <p className={`drag-me-message dmm--s1 ${sakiOcto.flipHorizontal?"mirror-horizontal":""}`}>拖动我</p>
                <p className={`drag-me-message dmm--s2 ${sakiOcto.flipHorizontal?"mirror-horizontal":""}`}>拖动我</p>
                <img 
                    className={`blush`}
                    src='/assets/blushing.png'
                    ref={blushRef}
                />
                {heartBullets}
                <img 
                    className={`octo-image non-select ${sakiOcto.isDragging? 'dragging':''}`}
                    src="/assets/saki_octo.webp" 
                    alt="Blue Octopus" 
                    draggable="false"
                />
            </div>
            <div ref={curtainRef} className='curtain'></div>
            <h1 className='title non-select'> 帮助小章鱼贴贴 </h1>
            {emojiBubbles}
        </div>
    )
}

export default LandingPage