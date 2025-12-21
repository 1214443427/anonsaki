import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import React, { useRef, useState } from 'react'
import ExternalLink from '../components/ExternalLink';
import MotionPathPlugin from 'gsap/MotionPathPlugin';
import ConfirmationModal from '../components/ConfirmationModal';
import { isChristmas } from '../utils/util';

const TEXT = [
`Epistula Invitatoria`,
`信徒敬启,
日🌙的相恋乃是禁忌。`,
`两人的恋情一旦被人知晓,
那么毁灭之时便会来临。`,
`
可是,
又有谁有权阻止她们在无人知晓之处的甜蜜?`,
`在这场日月的秘密集会中,
我们便是守密人与见证者。`,
`即便被烧光羽翼也在所不惜,
即便被撕碎理性也无怨无悔。`,
`若您也有这般跨越万难的觉悟的话,
我们诚挚地邀请您前往光明和黑暗的交织之地,`,
`日与月的相会之所,见证前所未有的闪耀。
一同在星辰失落之刻,为她们送上祝福。`,
`我期待着能与您共同沐浴在爱月祥音之中。`,
`请将您的答案与月桂诉说。`,
`深秘敬意,`
]
const URL = "https://qun.qq.com/universal-share/share?ac=1&authKey=7u24yaIUOdM%2FO1j%2FaPptDxuug1NySf50peM6wKQLWR0IXiNcPpGSxeAoRpl%2F%2B%2Bwx&busi_data=eyJncm91cENvZGUiOiIxNzE2ODA5OTYiLCJ0b2tlbiI6Ik84QTVrVmZCV0lsVG5UeWkydGNkaTVmZEEvMGl6NGJ2YzRKSG9QKzV6Z0dud3ZTZys4NDVEMitiWnlPZDVNbHMiLCJ1aW4iOiIxMjE0NDQzNDI3In0%3D&data=fJvHnsJYeOZaai5H0N_CaNF8Go9XKUjww5xCuKjWX8FTPTDTj-Di5acgnC7rFB51iPNQPj6DdN1yUx2nKxZeCA&svctype=4&tempid=h5_group_info"
const INC = 100     //gap between words
const PADDING = 1000 //transition scroll distance
const DISPLAY_DURATION = 2000
const OFFSET = [
  0,
  20,
  36,
  60,
  85,
  110,
  137,
  175,
  213,
  232,
  244,
  249
]

gsap.registerPlugin(SplitText, ScrollTrigger, Flip, MotionPathPlugin);

const segmenter = new Intl.Segmenter("zh", { granularity: "word" });

const ScrollText = ({as: Component = "h2", text, effect, className, offset, index, moonRef, scrollRef}) => {

    const ref = useRef(null);
    useGSAP((context, contextSafe)=>{
        let split;
        document.fonts.ready.then(()=>{
            split = SplitText.create(ref.current, {
                type: "words",
                wordsClass: "word", 
                // ignore: ".moon",
                prepareText: (text, el) => {
                    const segmented = [...segmenter.segment(text)].map(s => s.segment)
                    const joined = []
                    for (const segment of segmented){
                    if (segment === "," || segment === "。" || segment === "?"){
                        joined[joined.length - 1] += segment;
                    }else{
                        joined.push(segment)
                    }
                    }
                    return(joined.join("\u200c"))
                },
                wordDelimiter: { delimiter: /\u200c/},
                // autoSplit: true,
                // onSplit: (self)=>{},
            })
            // requestAnimationFrame(
                contextSafe(() => {
                // console.log("isConnected?", split.words[0].isConnected);
                split.words.forEach((word, index) => {
                    const initialPosition = offset + INC * index //+ isOdd * 500
                    gsap.to(word, {
                        scrollTrigger: {
                            trigger: scrollRef.current,
                            scrub: true,
                            start: ()=> initialPosition,
                            end: ()=> initialPosition + DISPLAY_DURATION,
                            onEnter: () => {
                            // console.log(word);
                            // console.log("parent?", word.parentElement);
                            // word.classList.add("show");
                            // console.log("context", context.data.length)
                            },
                            // markers:true,
                            
                        },
                        keyframes: {
                        "0%": { opacity: 0 },
                        "20%": { opacity: 1 },  // fade in
                        "80%": { opacity: 1 },  // hold visible
                        "100%": { opacity: 0 }, // fade out
                    }
                    })
                    // gsap.to(word, {
                    //     scrollTrigger: {
                    //         trigger: scrollRef.current,
                    //         scrub: true,
                    //         start: ()=>offset + index *INC + DISPLAY_DURATION,
                    //         end: ()=>offset  + index *INC + PADDING + DISPLAY_DURATION,
                    //         marker:true,
                    //     },
                    //     opacity: 0,
                    // })
                })
            })()
            gsap.set(".scroll-text", {opacity:1}) //sets opacity back to 1 after text splits. 
        // )    
        })
    
        return()=>{
        }
    }, { scope: ref, dependencies:[] }
    )

    if(index == 1){
        return (
            <h2 ref={ref} className={`scroll-text non-select ${className}`}>
                    信徒敬启,
                    日
                    <span className='img-span'>
                        <div className='moon-element'>
                            <img 
                                className='moon-final non-select' 
                                src='/assets/moon.webp' 
                                ref={moonRef}
                                alt='月'/>
                        </div>
                    </span>
                    的相恋乃是禁忌。
            </h2>
        )
    }
    return(
        <h2 ref={ref} className={`scroll-text non-select ${className}`}>{text}</h2>
    )
};


function InvitationPage({collectEasterEgg, easterEggProgress}) {

    const sakiOctoRef = useRef()
    const anonOctoRef = useRef()
    const moonRef = useRef()
    const moonInitialRef = useRef()

    const scrollRef = useRef()

    useGSAP(()=>{

        // ScrollTrigger.normalizeScroll(true)
        scrollTo(0,0)
        const state = Flip.getState(moonRef.current);
        Flip.fit(moonRef.current, moonInitialRef.current)
        gsap.set(".hamburger-button span", {background: "white"})

        // gsap.set(moonInitialRef.current, {clearProps: true});
        // gsap.set(moonInitialRef.current, {
        //     left: "50%",
        //     top: "50%",
        //     width: "25%",
        //     aspectRatio: 1,
        //     opacity: 1,
        // });

        gsap.to(moonRef.current,{
            scrollTrigger: {
                trigger: scrollRef.current,
                scrub: true,
                start: 500,
                end: 1000,
            },
            opacity: 1
        })


        Flip.to(state, {
            scrollTrigger:{
                trigger: scrollRef.current,
                scrub: true,
                start: 2400,
                end: 3400,
                // markers: true
            },
            ease:"power2.inOut",
        })    
            
        gsap.to(moonRef.current,{
            scrollTrigger: {
                trigger: scrollRef.current,
                scrub: true,
                start: 4900,
                end: 5300,
                // markers: true
            },
            opacity: 0,
            immediateRender: false
        })

                // gsap.to("#anon-laser", {
        //     scrollTrigger: {
        //         trigger:  scrollRef.current,
        //         scrub: true,
        //         start: 8000,
        //         end: 12000,
        //     },
        //     x: "+=20",
        //     repeat: 20,
        //     yoyo:true,
        // })


        gsap.set(".invitation-curtain", {opacity: 0})
        gsap.to(".invitation-curtain", {
                scrollTrigger: {
                trigger: scrollRef.current,
                scrub: true,
                start: 2500,
                end: 5200,
                // markers: true
            },
            keyframes:{
                "0%": {opacity: 0},
                "1%": {opacity: 1},
                "99%": {opacity: 1},
                "100%": {opacity: 0},
            }
        })


        gsap.to("#saki-laser", {
            scrollTrigger: {
                trigger:  scrollRef.current,
                scrub: true,
                start: 5000,
                end: 8000,
                onEnter: ()=>{gsap.set("#saki-laser", {opacity:1})},
                onLeaveBack: ()=>{gsap.set("#saki-laser", {opacity:0})},
                // onLeave: ()=>{gsap.set("#saki-laser", {opacity:0})},
                // onEnterBack: ()=>{gsap.set("#saki-laser", {opacity:1})},
            },
            scale: 1,
            translateX: 0,
            translateY: 0,
            left: "0%",
            top: "0%",
        })

        gsap.to("#anon-laser", {
            scrollTrigger: {
                trigger:  scrollRef.current,
                scrub: true,
                start: 7000,
                end: 8000,
                onEnter: ()=>{
                    gsap.set("#anon-laser", {opacity:1})
                    gsap.set(".hamburger-button span", {background:"black"})
            },
                onLeaveBack: ()=>{
                    gsap.set("#anon-laser", {opacity:0})
                    gsap.set(".hamburger-button span", {background:"white"})
            },
            
            },
            left: "0%",
        })

        gsap.to(".laser-div", {
            scrollTrigger: {
                trigger:  scrollRef.current,
                scrub: true,
                start: 8000,
                end: 12000,
            },
            x: ()=>`+=${20 * gsap.utils.random(1,10)}`,
            y: ()=>20*gsap.utils.random(-1,1),
            repeatRefresh: true,
            repeat: 20,
            yoyo:true,
            immediateRender: false,
            ease: "power1.inOut",
        })


        gsap.set(anonOctoRef.current, {right: "5%"})

        gsap.to(anonOctoRef.current, {
            scrollTrigger: {
                trigger: scrollRef.current,
                scrub: true,
                start: 18500,
                end: 20750,
                onEnter: ()=>{gsap.set(anonOctoRef.current, {opacity:1})},
                onLeaveBack: ()=>{gsap.set(anonOctoRef.current, {opacity:0})},
            },
            top: "-25%",
            rotate: 300,
            keyframes: {
                "0%": {opacity: 0},
                "1%": {opacity: 1},
                "90%": {opacity: 1},
                "100%": {opacity: 0}
            }
        })

        gsap.set(sakiOctoRef.current, {right: "15%"})

        gsap.to(sakiOctoRef.current, {
            scrollTrigger: {
                trigger: scrollRef.current,
                scrub: true,
                start: 18000,
                end: 21000
            },
            top: "-25%",
            rotate: -420,
            keyframes: {
                "0%": {opacity: 0},
                "1%": {opacity: 1},
                "90%": {opacity: 1},
                "100%": {opacity: 0}
            }
        })

        gsap.set("#chat-mate", {right: "-100%", top: "10%"})
        gsap.to("#chat-mate", {
            scrollTrigger: {
                trigger: scrollRef.current,
                scrub: true,
                start: 10500,
                end: 12500
            },
            keyframes: {
                "0%": {opacity: 1},
                "15%": {opacity: 1, left: "50%"},
                "75%": {opacity: 1, left: "50%"},
                "100%": {opacity: 0, left: "100%"}
            }
        })

        gsap.set("#anon-heart", {opacity:0, left: "25%", bottom: "-15%"})
        gsap.to("#anon-heart", {
            scrollTrigger: {
                trigger: scrollRef.current,
                scrub: true,
                start: 22000,
                end: 27000
            },
            keyframes: {
                "0%": { opacity: 0 },
                "10%": { opacity: 1 },
                "90%": { opacity: 1 },
                "100%": { opacity: 0 }, 
            },
            motionPath:[
                {left: "35%",bottom: "15%", zIndex: 1},
                {left: "65%",bottom: "35%", zIndex: 1},
                {left: "35%",bottom: "55%", zIndex: 0},
                {left: "55%",bottom: "75%", zIndex: 0},
                {left: "45%",bottom: "85%", zIndex: 1},
                {left: "53%",bottom: "95%", zIndex: 1},
                {left: "50%",bottom: "105%", zIndex: 0}
            ]
        })

        // MotionPathHelper.create(tween)

        gsap.set("#saki-heart", {opacity:0, right: "25%", bottom: "-15%"})
        gsap.to("#saki-heart", {
            scrollTrigger: {
                trigger: scrollRef.current,
                scrub: true,
                start: 22000,
                end: 27000
            },
            keyframes: {
                "0%": { opacity: 0 },
                "10%": { opacity: 1 },
                "90%": { opacity: 1 },
                "100%": { opacity: 0 }, 
            },
            motionPath:[
                {right: "35%",bottom: "15%", zIndex: 0},
                {right: "65%",bottom: "35%", zIndex: 0},
                {right: "35%",bottom: "55%", zIndex: 1},
                {right: "55%",bottom: "75%", zIndex: 1},
                {right: "45%",bottom: "85%", zIndex: 0},
                {right: "53%",bottom: "95%", zIndex: 0},
                {right: "50%",bottom: "105%", zIndex: 1}
            ]
        })
        gsap.set("#heart", {
            scale: 0.175})
        gsap.to("#heart", {
            scrollTrigger: {
                trigger: scrollRef.current,
                scrub: true,
                start: 12000,
                end: 15000,
                // onEnter: ()=>{
                //     gsap.set("#heart", {opacity:1})
                // },
                // onLeaveBack: ()=>{
                //     gsap.set("#heart", {opacity:0})
                // },
                onLeave: ()=>{
                    gsap.set("#heart", {opacity:0})
                    gsap.set(".laser-div", {opacity:0})
                },
                onEnterBack: ()=>{
                    gsap.set("#heart", {opacity:1})
                    gsap.set(".laser-div", {opacity:1})
                },
            },
            scale: 100,
            rotate: -30,
            ease: "power1.inOut",
        })

        // gsap.set("#guitar", {opacity:0, right: "25%", bottom: "-15%"})
        // gsap.to("#guitar", {
        //     scrollTrigger: {
        //         trigger: scrollRef.current,
        //         scrub: true,
        //         start: 16000,
        //         end: 24000,
        //     },
        //     rotate: -30,
        //     ease: "power1.inOut",
        //     keyframes: {
        //         "0%": {opacity: 1},
        //         "50%": {opacity: 1, bottom: "20%"},
        //         "75%": {opacity: 1, bottom: "100%"},
        //         "100%": {opacity: 0, bottom: "120%"}
        //     },
            
        //     y: ()=>20*gsap.utils.random(-1,1),
        //     repeat: 20,
        // })

        // gsap.to("#keyboard", {
        //     scrollTrigger: {
        //         trigger: scrollRef.current,
        //         scrub: true,
        //         start: 12000,
        //         end: 15000,
        //     },
        //     scale: 500,
        //     rotate: -30,
        //     ease: "power1.inOut",
        // })


        gsap.to(".qr-code-container", {
            scrollTrigger: {
                trigger: scrollRef.current,
                scrub: true,
                start: 28000,
                end: 32000,
            },
            keyframes: {
                "0%": { opacity: 0 },
                "20%": { opacity: 1 },  // fade in
                "50%": { translateY: 0 },  // hold visible
                "70%": { opacity: 1 },  // fade in
                "100%": { translateY: "-100vh", opacity: 0}, // fade out
            },
            pointerEvents: "auto",
        })

        gsap.to(".scroll-text--10", {
            scrollTrigger: {
                trigger: scrollRef.current,
                scrub: true,
                start: 28000,
                end: 30000,
            },
            keyframes: {
                "50%": { translateY: 0 },  // hold visible
                "100%": { translateY: "-100vh"}, // fade out
            },
            immediateRender: false
        })
    }, [])

    const isChristmasTime = isChristmas()

    return (
        <div className='invitation-page'>
            <div className='text-scroll-container' ref={scrollRef}>
            <div className='curtain invitation-curtain'></div>
                <div className='scroll-indicator'>
                    <p className='non-select'>下滑阅读</p>
                    <div className="arrow"></div>
                    <div className="arrow"></div>
                </div>
                <div className='bg--1'>
                    <img className='moon-initial non-select' src='/assets/moon.webp' ref={moonInitialRef} alt='月亮'/>
                </div>
                <div className='bg--transition'></div>
                <div className='bg--2'>
                    <div 
                        ref={anonOctoRef} 
                        className='octo-image invitation-easter-egg'
                        onClick={()=>collectEasterEgg("invitation-anon")}
                        >
                       <img src='/assets/anon_octo.webp' className='non-select' alt='爱音章鱼'/>
                        {isChristmasTime && <img className='christmas-hat' src='/assets/christmas-hat.webp'></img>}
                    </div>
                    <div 
                        ref={sakiOctoRef} 
                        className='octo-image invitation-easter-egg' 
                        onClick={()=>collectEasterEgg("invitation-saki")}
                        >
                        <img src="/assets/happy_saki_octo.webp" className='non-select' alt='开心小祥章鱼'/>
                        {isChristmasTime && <img className='christmas-hat' src='/assets/christmas-hat.webp'></img>}                    
                    </div>
                    <img src="/assets/chat-mate.jpg" id="chat-mate" className='invitation-easter-egg non-select' />
                    <img  id="saki-heart" className='invitation-heart non-select' src='/assets/blue_heart.png'/>
                    <img  id="anon-heart" className='invitation-heart non-select' src='/assets/pink_heart.png'/>
                    <p className='emoji-bubble non-select' id="keyboard ">🎹</p>
                    <p className='emoji-bubble non-select' id="guitar">🎸</p>
                </div>
                <div className='bg--3'></div>
                <div className='laser-div' >
                    <div id='saki-laser' className='invitation-easter-egg non-select'>
                        <img src='/assets/saki-laser.webp' className='non-select' alt='章鱼激光'/>
                        {isChristmasTime && <img className='christmas-hat' src='/assets/christmas-hat.webp'></img>}
                    </div>
                    <div id='anon-laser' className='invitation-easter-egg non-select' >
                        <img src='/assets/anon-laser-edit.webp' className='non-select' alt='奶龙激光'/>
                        <img id='heart' src='/assets/heart.webp' className='non-select' alt='小心心'/>
                        {isChristmasTime && <img className='christmas-hat' src='/assets/christmas-hat.webp'></img>}
                    </div>
                </div>
            </div>
            {TEXT.map((text, i)=>(<ScrollText 
                text={text} 
                className={`scroll-text--${i}`} 
                key={i} 
                offset = {1000 + OFFSET[i]*INC + (i == 10? DISPLAY_DURATION:0)}
                index = {i}
                moonRef = {moonRef}
                scrollRef={scrollRef}
                />))}
            {/* <ScrollText text={"两人的恋情一旦被人知晓,那么毁灭之时便会来临。"}/> */}
            {/* <h1 className='split title'>Epistula Invitatoria</h1>
            <h2 className='split intro--1'> 信徒敬启,
            <br/>日月的相恋乃是禁忌。</h2>
            <h2 className='split intro--2'> 两人的恋情一旦被人知晓,
            <br/>那么毁灭之时便会来临。</h2>
            <h2 className='split paragraph--1'>可是,
            <br/>又有谁有权阻止她们在无人知晓之处的甜蜜?</h2>
            <h2 className='split paragraph--2'>在这场日月的秘密集会中,
            <br/>我们便是守密人与见证者。</h2>
            <h2 className='split paragraph--3'>即便被烧光羽翼也在所不惜,
            <br/>即便被撕碎理性也无怨无悔。</h2>
            <h2 className='split paragraph--4'>若您也有这般跨越万难的觉悟的话,
            <br/>我们诚挚地邀请您前往光明和黑暗的交织之地,
            <br/>日与月的相会之所,见证前所未有的闪耀。</h2>
            <h2 className='split paragraph--5'>一同在星辰失落之刻,为她们送上祝福。</h2>
            <h2 className='split paragraph--6'>我期待着能与您共同沐浴在爱月祥音之中。</h2>
            <h2 className='split paragraph--7'>请将您的答案与月桂诉说。</h2>
            <h3 className='split sign-off'>深秘敬意,</h3> */}
            <div className='disclaimer'>
                <div className='dialog-box'>
                    <div className='disclaimer-title'>
                        <div>
                            <h1>碎碎念</h1>
                            <h2>感谢所有看这的人。<br/> 我喜欢你们！🩷🩵</h2>
                        </div>
                        <img src='/assets/logo.jpg' alt='logo'/>
                    </div>
                    <p>这个个人小工程花了比想象中多了很多的时间。一开始的企划只有角色展示这一栏。当时只是觉得用第十三集的切片做专场会很酷。</p>
                    <p>前端代码全部为React。Live2D的框架比我期待的难用太多了，研究他浪费了许多时间。</p>
                    <p>如有问题，请联系我<ConfirmationModal url={"https://space.bilibili.com/14766618"} className='link'><span>个人B站。</span></ConfirmationModal></p>
                    
                    <p>至此。<span></span></p>
                    <p>（PS，虽然我是祥1，但是代码里祥子是0。）</p>
                    <div className='flex'>
                        <img 
                            src='assets/anon_octo.webp'
                            alt='章鱼彩蛋'
                            title={`${easterEggProgress.includes("landing-page-anon")?"找到你了！":"好像在哪里见过的章鱼?"}`}
                            className={`octo-easteregg ${easterEggProgress.includes("landing-page-anon")? "" : "pink-silhouette"}`}/>
                        <img 
                            src='assets/saki_octo.webp' 
                            alt='章鱼彩蛋'
                            title={`${easterEggProgress.includes("landing-page-saki")?"找到你了！":"好像在哪里见过的不开心章鱼?"}`}
                            className={`octo-easteregg ${easterEggProgress.includes("landing-page-saki")? "" : "blue-silhouette"}`}/>
                        <img 
                            src='assets/happy_saki_octo_matching.webp' 
                            alt='章鱼彩蛋'
                            title={`${easterEggProgress.includes("character-page-saki")?"找到你了！":"好像在哪里见过的章鱼?"}`}
                            className={`octo-easteregg ${easterEggProgress.includes("character-page-saki")? "" : "blue-silhouette"}`}/>
                        <img 
                            src='assets/anon_octo.webp' 
                            alt='章鱼彩蛋'
                            title={`${easterEggProgress.includes("character-page-anon")?"找到你了！":"好像在哪里见过的章鱼?"}`}
                            className={`octo-easteregg ${easterEggProgress.includes("character-page-anon")? "" : "pink-silhouette"}`}/>
                        <img 
                            src='assets/happy_saki_octo.webp' 
                            alt='章鱼彩蛋'
                            title={`${easterEggProgress.includes("invitation-saki")?"找到你了！":"好像在哪里见过的章鱼?"}`}
                            className={`octo-easteregg ${easterEggProgress.includes("invitation-saki")? "" : "blue-silhouette"}`}/>
                        <img 
                            src='assets/anon_octo.webp' 
                            alt='章鱼彩蛋'
                            title={`${easterEggProgress.includes("invitation-anon")?"找到你了！":"好像在哪里见过的章鱼?"}`}
                            className={`octo-easteregg ${easterEggProgress.includes("invitation-anon")? "" : "pink-silhouette"}`}/>
                    </div>
                </div>
            </div>
            <div className='qr-code-container'>
                <img alt = "爱祥大群二维码 171680996" className='qr-code-image non-select' src='/assets/qr-code.webp'/>
                <ConfirmationModal url={URL}>
                    <button 
                        className='qr-code-button menu-button' 
                        // onClick={()=>{window.open(URL, '_blank')}}
                        >
                            <ExternalLink />
                            加入舞会
                    </button>
                </ConfirmationModal>
            </div>
        </div>
    )
}

export default InvitationPage
