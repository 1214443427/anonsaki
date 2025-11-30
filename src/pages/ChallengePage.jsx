import React, { useEffect, useRef, useState } from 'react'
import "./ChallengePage.css"
import Spinner from '../components/Spinner';
import { gsap } from 'gsap/gsap-core';
import { useGSAP } from '@gsap/react';
import ConfirmationModal from '../components/ConfirmationModal';
import ToolTips from '../components/ToolTips';
import ExternalLink from '../components/ExternalLink';


const PASTEL_COLORS = ["#FEF08A", "#FBCFE8", "#BFDBFE", "#BBF7D0", "#FED7AA"]

function NotebookPages({title, list, className, pageNum, setSelectedWork, works, flipPage, completedWork, setCompletedWork}){
    
    const [newlyAdded, setNewlyAdded] = useState([])
    const timeoutRef = useRef(null)

    function toggleWork(item){
        setNewlyAdded((prev)=>[...prev, item])
        setCompletedWork((prev)=>
            completedWork.includes(item) ? completedWork.filter((work)=>work != item): [...completedWork, item])
        if(timeoutRef.current){
            clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(()=>{
            setNewlyAdded([])
        }, 700)
    }


    return(
        // <div className={`notebook-pages ${className}`} ref={ref}>
        //     <div className='notebook-page-inner'>
        //         <div className='front'>

        <div className={`notebook-page ${className}`}>
                <div className='notebook-header'>
                    <h3>{title}</h3>
                    {title&&<p>{title != "目录" && title !="后记" && "Day" + (pageNum-2)}</p>}
                </div>
                <div className='notebook-content'>
                    {title == "后记"?
                    <div>
                        本推荐集收录于爱祥吧吧群的群友，欢迎来玩！<br/>
                        群号👉 462035074<br/>
                        特别鸣谢黑洞老师的主持。<br />
                        封面图来自
                        <ConfirmationModal url={"https://yuhong01.lofter.com/post/77b6c044_34c80349d"}>
                            <span className='link'>千羽.鸿漪 </span>
                        </ConfirmationModal>
                        <br/>
                        更多作品收录: <br/>
                        <ConfirmationModal url={"https://www.bilibili.com/read/readlist/rl927730"}
                            className={"link"}>
                                <div className='flex note-link'>
                                    <img src='assets/bilibili-icon.webp' className='icons'></img>
                                    Bilibili视频收录
                                </div>
                            </ConfirmationModal>
                        <ConfirmationModal url={"https://www.bilibili.com/opus/1081595906150629415"}
                            className={"link"}>
                                <div className='flex note-link'>
                                    <img src='assets/nga-icon.webp' className='icons'></img>
                                    安科收录
                                </div>
                            </ConfirmationModal>
                    </div>
                    :
                    list.map((item, i)=>
                        title != "目录" ? 
                            <div key={i} className='notebook-items flex'>
                                <div className ="flex" onClick={()=>setSelectedWork(item)}>
                                    <p className='work-index'>{`${i+1}. `}</p>
                                    <p className={`${works[item].spoiler? "cross": ""}`}> {item} </p>
                                </div>
                                <div 
                                    className={`check-box`}
                                    onClick={()=>toggleWork(item)}
                                    >
                                    {completedWork.includes(item)&&
                                        <span>
                                            <svg className="draw-check" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path className={newlyAdded.includes(item)?"animate":""}
                                                    d="M3.4 13.2L 3.4 13.2 9.2 19l11.4-11.4"/>                                    
                                            </svg>
                                        </span>}
                                </div>
                            </div>
                            :
                            <div key={i} className='notebook-items flex'>
                                <p onClick={()=>flipPage(i + 2)}>{item}</p>
                            </div>
                    )}
                </div>
                <div className='notebook-footer'>

                </div>
        </div>

        //         </div>
        //         <div className='back'>
        //             test
        //         </div>
        //     </div>
        // </div>
    )
}


function ChallengePage() {
    const animationPageRef = useRef(null)
    const contentPageRef = useRef(null)
    const [recommendations, setRecommendations] = useState([])
    const [works, setWorks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [bottomPage, setBottomPage] = useState(0)
    const [topPage, setTopPage] = useState(0)
    const [currentPage, setCurrentPage] = useState(0)
    const [selectedWork, setSelectedWork] = useState(null)
    const [completedWork, setCompletedWork] = useState([])
    const [lastVisited, setLastVisited] = useState(0)
    const [showNavigation, setShowNavigation] = useState(false)


    function selectWork(work){
        if(selectedWork) return
        else setSelectedWork(work)
    }

    useEffect(()=>{
        async function fetchData(){
            try{
                setLoading(true)
                const data = await fetch('/data/recommendations.json').then(res => res.json())
                setRecommendations(data.days)
                setWorks(data.works)
                const completed = JSON.parse(localStorage.getItem("completedWorks"))
                const last = JSON.parse(localStorage.getItem("lastVisited"))
                setCompletedWork(completed||[])
                setLastVisited(last||0)
                console.log(data)
                setLoading(false)
            }
            catch (err){
                console.error('Failed to fetch data', err);
                setError("无法获取信息！请联系作者B站")
            }
        }   
        fetchData();
    }, [])

    useEffect(()=>{
        if(completedWork?.length > 0){
            localStorage.setItem("completedWorks", JSON.stringify(completedWork))
        }
        if(currentPage > lastVisited){
            localStorage.setItem("lastVisited", JSON.stringify(currentPage))
        }
    }, [completedWork, currentPage])

    useGSAP(()=>{
        const tl = gsap.timeline({paused:true})
        console.log(currentPage, bottomPage, topPage)
        if(currentPage == bottomPage){
            // console.log("forward")
            tl.set(animationPageRef.current, {pointerEvents:"none"})
            tl.set(".animation-page-inner", {
                rotateY: 0,
                opacity: 1,
                zIndex: 2
            })
            tl.to(".animation-page-inner", {
                rotateY:-180, 
                duration: 1,
                ease: "power1.in",
            })
            if(topPage == 0){
                console.log("also flip the front cover forward")
                tl.to(".front-cover", {
                    rotateY: -180,
                    duration: 1,
                    ease: "power1.in",
                    zIndex: 1
                }, "<")
            }
        }else{
            // console.log("reverse")
            tl.set(".animation-page-inner", {
                rotateY: -180,
                opacity: 1,
                zIndex: 2
            })
            tl.set(animationPageRef.current, {pointerEvents:"all"})
            tl.to(".animation-page-inner", {
                rotateY: 0, 
                duration: 1,
                ease: "power1.out",
            })
            if(currentPage == 0){
                console.log("also flip the front cover back")
                tl.to(".front-cover", {
                    rotateY: 0,
                    duration: 1,
                    ease: "power1.out",
                    zIndex: 3
                }, "<")
            }
        }
        tl.restart()
        },[currentPage]
    )

    const {contextSafe} = useGSAP(()=>{
        if(selectedWork !== null){
            const tl = gsap.timeline()
            tl.set(".sticky-note", 
                {
                    yPercent: 50,
                    xPercent: 50,
                }
            ).to(".sticky-note-popup", 
                {
                    opacity: 1,
                    duration: 0.5,
                    pointerEvents: "all"
                }
            )
            .to(".sticky-note", 
                {
                    motionPath:{
                        path: [
                        { xPercent: 50, yPercent: 50 },
                        { xPercent: 0, yPercent: 30 },
                        { xPercent: -30, yPercent: 10 },
                        { xPercent: -50, yPercent: -50 }
                        ],
                        curviness: 1.5,   // controls how smooth/bendy the curve is
                        type: "cubic",    // Bezier cubic interpolation
                    },
                    duration: 0.5,
                },"<"
            )
        }
    }, [selectedWork])

    useGSAP(()=>{
        if(showNavigation){
            gsap.to(".navigation-popup-container", {
                opacity:1, 
                duration: 0.35,
                pointerEvents: "all",
            })
            gsap.to(".navigation-popup",{
                duration: 0.35,
                scale: 1
            })
        }else{
            gsap.to(".navigation-popup-container", {
                opacity: 0,                
                duration: 0.35,
                pointerEvents: "none"
            })
            gsap.to(".navigation-popup", {
                duration: 0.35,
                scale: 0.1
            })
        }
    }, [showNavigation])

    const unselectWork = contextSafe(()=>{
        const tl = gsap.timeline({onComplete:()=>{setSelectedWork(null)}})
        tl.to(".sticky-note",
            {
                motionPath:{
                    path: [
                    { xPercent: -50, yPercent: -50 },
                    { xPercent: -30, yPercent: -90 },
                    { xPercent: -0, yPercent: -110 },
                    { xPercent: 50, yPercent: -150 }
                    ],
                    curviness: 1.5,   // controls how smooth/bendy the curve is
                    type: "cubic",    // Bezier cubic interpolation
                },
                duration: 0.5,
            }
        ).to(".sticky-note-popup", 
            {
                opacity: 0,
                duration: 0.35,
                pointerEvents: "none"
            },"<0.15"
        )
    })

    function matchLofterSlug(url) {
        const regex = /^(https:\/\/[a-zA-Z0-9_-]+\.lofter\.com\/?)/;
        const match = url.match(regex);
        return match ? match[1] : null;   // returns slug or null
    }

    const flipPage = (pageNumber)=>{
        if(pageNumber<0 || pageNumber>34) return
        setShowNavigation(false)
        const current = currentPage
        console.log(pageNumber, current)
        // if (pageNumber >= 0 && pageNumber <= 30){
        if (pageNumber > current){
            console.log("foward")
            setBottomPage(pageNumber)
            setTopPage(current)
        }else{
            console.log("reverse")
            setBottomPage(current)
            setTopPage(pageNumber)
        }
        // }
        setCurrentPage(pageNumber); 
    }

    return (
        <div className='challenge-page'>
            {loading?
            <>
                <Spinner/>
            </>:
            <div className='notebook-pages'>
                <div className='animation-page' ref={animationPageRef}>
                    <div className='animation-page-inner'>
                        <div className='front'>
                            <NotebookPages 
                                title={recommendations[topPage].category} 
                                list={recommendations[topPage].items}
                                setSelectedWork={selectWork}
                                pageNum={topPage}
                                works={works}
                                flipPage={flipPage}
                                completedWork = {completedWork}
                                setCompletedWork = {setCompletedWork}
                            />
                        </div>
                        <div className='back'>
                            <NotebookPages 
                                title={""} 
                                list={[]}
                            />
                        </div>
                    </div>
                </div>
                <NotebookPages 
                    ref={contentPageRef} 
                    title={recommendations[bottomPage].category} 
                    list={recommendations[bottomPage].items}
                    setSelectedWork={selectWork}
                    className="content-page"
                    pageNum={bottomPage}
                    works={works}
                    flipPage={flipPage}
                    completedWork = {completedWork}
                    setCompletedWork = {setCompletedWork}
                />
                <div className='front-cover'>
                    <div className='front notebook-cover'>
                        <div>
                            <p>豊かな想像力を育 む</p>
                            <h1 className='notebook-title'>
                                ア・テンポノート
                            </h1>
                        </div>
                        <div className='cloud-container flex flex-col'>
                            <div className="cloud">
                                <svg clipPathUnits={"objectBoundingBox"} width="1" height="1" viewBox="0 0 1 1" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <clipPath id="clip-path" clipPathUnits="objectBoundingBox">
                                            <path
                                            d="M.4086.1026C.3.1026.2095.1843.1906.2921.0951.3078.0214.4015.0207.5154V.5174c0 .1258.0887.2276.1981.2276.021 0 .041-.0036.0599-.0104.0289.0842.1047.1443.1938.1443.0713 0 .1339-.0381.171-.0962.0242.0156.0524.0248.0826.0248C.818.8075.8924.7238.8924.6204.8924.6136.8921.6071.8913.6007c.057-.0301.0962-.0918.0962-.1631C.9875.3406.9152.2613.8244.2553.8012.1919.7485.1479.6865.1479.6477.1479.612.1655.5853.1943.5451.139.4813.1034.4093.1034Z"
                                            fill="black"
                                            />
                                        </clipPath>
                                    </defs>
                                </svg>
                                <img className='notebook-cover-image' src="/assets/notebook-cover-image.webp" alt="ansk" />
                            </div>
                            <p id='anosaki-text'>あのさき </p>
                        </div>
                        <div className='nameplate-container'>
                            <div className='nameplate-top flex'>
                                <span>15行</span>
                                <span>がくしゅうノート</span>
                            </div>
                            <div className='nameplate-bottom flex'>
                                <span>ねん</span>
                                <span>くみ なまえ</span>
                                <span>爱祥吧吧群</span>
                            </div>
                        </div>
                    </div>
                    <div className='back'>  
                        <NotebookPages 
                            title={""} 
                            list={[]}
                            className={"back-page"}
                        />
                    </div>
                </div>
            </div>
            }
            <div className='challenge-page-nav'>
                <div 
                    className='direction-buttons'
                    onClick={()=>flipPage(currentPage-1)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M169.4 297.4C156.9 309.9 156.9 330.2 169.4 342.7L361.4 534.7C373.9 547.2 394.2 547.2 406.7 534.7C419.2 522.2 419.2 501.9 406.7 489.4L237.3 320L406.6 150.6C419.1 138.1 419.1 117.8 406.6 105.3C394.1 92.8 373.8 92.8 361.3 105.3L169.3 297.3z"/></svg>
                </div>
                <button 
                    onClick={()=>setShowNavigation(true)}>
                        {currentPage==0?"封面":currentPage==34?"封底": currentPage + " / 33" }
                    </button>
                <div 
                    className='direction-buttons'
                    onClick={()=>flipPage(currentPage+1)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M471.1 297.4C483.6 309.9 483.6 330.2 471.1 342.7L279.1 534.7C266.6 547.2 246.3 547.2 233.8 534.7C221.3 522.2 221.3 501.9 233.8 489.4L403.2 320L233.9 150.6C221.4 138.1 221.4 117.8 233.9 105.3C246.4 92.8 266.7 92.8 279.2 105.3L471.2 297.3z"/></svg>
                </div>
            </div>

            <div className='sticky-note-popup'>
                <div className='sticky-note-popup-backdrop' onClick={unselectWork}>
                </div>
                <div className="sticky-note" style={{"--pastel":`${PASTEL_COLORS[currentPage%PASTEL_COLORS.length]}`}}>
                    <div className='tape'></div>
                    <div className='tape'></div>
                    <div onClick={unselectWork} className='close-button icons'>✗</div>
                    {selectedWork&&<>
                    <h3>《{selectedWork}》</h3>
                    <p>作者:&nbsp;
                        <ConfirmationModal 
                            url={works[selectedWork].lofter? 
                                matchLofterSlug(works[selectedWork].lofter): //use lofter if exist. If not, use author link. if both null, return empty
                                    works[selectedWork].author_link? 
                                    works[selectedWork].author_link: ""}
                        >
                            <span className='link'>{works[selectedWork].author}</span><ExternalLink className=""/>
                        </ConfirmationModal> 
                    </p>
                    <div>
                        <h4>链接: </h4>
                        {works[selectedWork].lofter && 
                            <ConfirmationModal url={works[selectedWork].lofter} className={"link"}>
                                <div className='flex note-link'>
                                    <img className="icons" src='/assets/lofter-icon.webp'></img>
                                    <p> Lofter </p>
                                </div>
                            </ConfirmationModal>
                        }
                        {works[selectedWork].bilibili &&
                            <ConfirmationModal url={works[selectedWork].bilibili} className={"link"}>
                                <div className='flex note-link'>
                                    <img className="icons" src='/assets/bilibili-icon.webp'></img>
                                    <p> Bilibili </p>
                                </div>
                            </ConfirmationModal>
                        }
                        {works[selectedWork].lanp &&
                            <div className='flex '>
                                <div className='lanp'>🅿️</div>
                                <p>神秘数字: {works[selectedWork].lanp}</p>
                            </div>
                        }
                        {works[selectedWork].nga &&
                            <ConfirmationModal url={works[selectedWork].nga} className={"link"}>
                                <div className='flex note-link'>
                                    <img className="icons" src='/assets/nga-icon.webp'></img>
                                    <p> NGA </p>
                                </div>
                            </ConfirmationModal>
                        }
                    </div>
                    {works[selectedWork].spoiler && 
                    <div>
                        ⚠️注意: {works[selectedWork].spoiler}⚠️  
                    </div>}
                    {works[selectedWork].note && 
                    <div>
                        注释: {works[selectedWork].note}
                    </div>}
                    {works[selectedWork].error &&
                    <div>
                        {"❌错误: 未能找到的作品。这个作品有可能被删除了，也有可能是合集。我没有手机lofter，找不到合集信息 :( "}
                        <br/>
                        如果您能提供信息，<a href="https://space.bilibili.com/3632302752008619">请私信我</a>
                    </div>
                    }
                    </>}    
                    <div className='sticky-note-bottom-right-corner'></div>
                </div>
            </div>
            <div className='navigation-popup-container'>
                <div className='sticky-note-popup-backdrop' onClick={()=>setShowNavigation(false)}></div>
                    <div className='navigation-popup flex flex-col'>
                        <div className='page-selectors flex'>
                            {Array.from({ length: 35 }).map((_, index)=>(
                                <div className={'page-selector' + (index == currentPage ? ' active':'')} key={index} onClick={()=>flipPage(index)}>
                                    {index==0?"封面":index==34?"封底":index}
                                </div>
                            ))}
                        </div>
                        <div className='flex page-input-container'>到
                            <input type='number' max={33} min={1}></input>
                            <button className=''>页</button>
                        </div>
                        <div>到
                            <select name="page-number" id="page-number" className='page-select'>
                                {Array.from({ length: 33 }).map((_, index)=>(
                                <option className='page-select-options' key={index} value={index}>
                                    {index+1}
                                </option>
                                ))}
                            </select>
                            页
                        </div>
                    </div>
            </div>
        </div>
    )
}

export default ChallengePage