import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import React, { useRef, useState } from 'react'

const TEXT = [
`Epistula Invitatoria`,
`信徒敬启,
日月的相恋乃是禁忌。`,
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

gsap.registerPlugin(SplitText);
gsap.registerPlugin(ScrollTrigger)

const segmenter = new Intl.Segmenter("zh", { granularity: "word" });

const ScrollText = ({as: Component = "h2", text, effect, className, offset, isOdd}) => {

    const ref = useRef(null);
    //CURRENTLY CHANGING OPACITY OF THE WRONG ELEMENT!
    useGSAP((context, contextSafe)=>{
        let split;
        // if(ref.current.children.length > 0) return
        document.fonts.ready.then(()=>{
            split = SplitText.create(ref.current, {
                type: "words",
                wordsClass: "word", // not yet created
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
                            trigger: ".text-scroll-container",
                            scrub: true,
                            start: ()=> initialPosition,
                            end: ()=> initialPosition + PADDING + DISPLAY_DURATION,
                            onEnter: () => {
                            console.log(word);
                            console.log("parent?", word.parentElement);
                            // word.classList.add("show");
                            console.log("context", context.data.length)
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
                    //         trigger: ".text-scroll-container",
                    //         scrub: true,
                    //         start: ()=>offset + index *INC + DISPLAY_DURATION,
                    //         end: ()=>offset  + index *INC + PADDING + DISPLAY_DURATION,
                    //         marker:true,
                    //     },
                    //     opacity: 0,
                    // })
                })
            })()
        // )    
        })
    
        return()=>{
            window.scrollTo(0, 0)
        }
    }, { scope: ref, dependencies:[] }
    )
    return(
        <h2 ref={ref} className={`scroll-text non-select ${className}`}>{text}</h2>
    )
};


function InvitationPage() {

    function accumulatedCharCounts(strings) {
    let total = 0;
    return strings.map(str => {
        total += str.length;
        return total;
    });
    }

    console.log(accumulatedCharCounts(TEXT))

    const sakiOctoRef = useRef()
    const anonOctoRef = useRef()

    useGSAP(()=>{
        window.scrollTo(0,0)

        gsap.set(sakiOctoRef.current,{
            right: "10%",
        })

        gsap.to(sakiOctoRef.current, {
            scrollTrigger: {
                trigger: ".text-scroll-container",
                scrub: true,
                start: 1000,
                end: 3000
            },
            top: "-15%"
        })

        gsap.to(".qr-code-container", {
            scrollTrigger: {
                trigger: ".text-scroll-container",
                scrub: true,
                start: 24000,
                end: 25000,
            },
            opacity: 1
        })
    }, [])


    return (
        <div className='invitation-page'>
            <div className='text-scroll-container'>
                <div className='scroll-indicator'>
                    <p>下滑阅读</p>
                    <div className="arrow"></div>
                    <div className="arrow"></div>
                </div>
                <img ref={anonOctoRef} src='/assets/anon_octo.webp' className='octo-image invitation-easter-egg'/>
                <img ref={sakiOctoRef} src='/assets/saki_octo.webp' className='octo-image invitation-easter-egg'/>
            </div>
            {TEXT.map((text, i)=>(<ScrollText 
                text={text} 
                className={`scroll-text--${i}`} 
                key={i} 
                offset = {1000 + i * DISPLAY_DURATION + (i == 10? DISPLAY_DURATION:0)}
                isOdd = {i%2}
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
            <div className='qr-code-container'>
                <img className='qr-code-image non-select' src='/assets/qr-code.png'/>
                <button className='qr-code-button menu-button' onClick={()=>{window.open(URL, '_blank')}}>加入舞会</button>
            </div>
        </div>
    )
}

export default InvitationPage
