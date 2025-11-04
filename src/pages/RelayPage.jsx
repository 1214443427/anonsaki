import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import React, { useMemo, useRef } from 'react'
import { useEffect, useState } from 'react';
import Spinner from "../components/Spinner"
import ExternalLink from '../components/ExternalLink';

gsap.registerPlugin(Flip) 

function Polaroids({relay, onClick, details=false, ref}) {
    // const [ramdomStyle] = useState(()=>({
    //     rotation: Math.random()*2,
    //     direction: Math.random()>0.5? 1: -1
    //     }
    // ))

    // const [loading, setLoading] = useState(true)

    return (
        <div className={!details?'polaroid-container non-select':'polaroid-container non-select details-popup '} 
            style={relay?details?{}:{rotate: `${relay.randomStyle.direction * relay.randomStyle.rotation}deg`}:{}} 
            onClick={onClick}
            ref={ref}
            >
            <div className='tape'></div>
            {relay&&
            <div className='flex flex-col polaroids-text-container'>
                {/* {
                    loading &&
                    <div className='loading-placeholder-img'>
                        <Spinner />
                    </div>
                } */}
                <img 
                    src={relay.details.cover} 
                    // onLoad={()=> {setLoading(false)}}
                    // style={{display: loading? "none": "block"}}
                />
                <p>{relay.name}</p>
                <div className='flex'>
                    <p>{relay.details.date}</p>
                    <p>cr@{relay.details.cover_author}</p>
                </div>
            </div>}
        </div>
    )
}

// function Details({relay, onClick, ref}){
//     return (
//         <Polaroids className='details-popup non-select' details={true} relay={relay} ref={ref}/>
//     )
// }



function RelayPage({navigateTo}) {
    const [relays, setRelays] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState();

    const [selectedRelay, setSelectedRelay] = useState()
    const relayRefs = useRef([])
    const detailsRef = useRef();
    const isAnimating = useRef(false);
    
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [isImagesLoaded, setIsImagesLoaded] = useState(false);

    const randomStyleRef = useRef()

    useEffect(()=>{
        async function fetchData(){
            try{
                setLoading(true)
                const data = await fetch('/data/relays.json').then(res => res.json())
                    const withStyle = data.map(relay => ({
                    ...relay,
                    randomStyle: {
                        rotation: Math.random() * 2,
                        direction: Math.random() > 0.5 ? 1 : -1,
                    },
                    }));
                const imagePromises = data.map((relay) => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.src = relay.details.cover;
                    img.onload = resolve;
                    img.onerror = resolve;
                });
                });

                Promise.all(imagePromises).then(() => {
                    setIsImagesLoaded(true);
                });
                setLoading(false)
                setRelays(withStyle)
            }
            catch (err){
                console.error('Failed to fetch data', err);
                setError("无法获取接力信息！请联系作者B站")
            }
        }
        fetchData();
    }, [])

    useEffect(()=>{
        const onResize = ()=>{
            setScreenWidth(window.innerWidth);
        }
        window.addEventListener('resize', onResize)
        onResize()
        return () => {
            window.removeEventListener('resize', onResize)
        }
    }, [])

    useGSAP(()=>{
        // gsap.set(detailsRef.current, {yPercent: -100}) //suppose to be for details content. not details. 
        if(loading || !isImagesLoaded) return
        const tl = gsap.timeline();
        tl.to('.relays-page', { autoAlpha: 1, duration: 0.2})
        tl.from('.relay-grid', {autoAlpha: 0, scale:2, yPercent:20, xPercent:30, stagger: 0.04});
        if (screenWidth < 768) {
            relayRefs.current.map((ref, i)=>{
                if(i%2){
                    gsap.set(ref, {y: 90})
                }
            })
        }
    }, [loading, isImagesLoaded])

    const { contextSafe } = useGSAP()

    const showDetails = contextSafe((index)=>{
        if (selectedRelay!=null){
            return hideDetails()
        }
        setSelectedRelay(index)
        Flip.fit(detailsRef.current, relayRefs.current[index])
        const state = Flip.getState(detailsRef.current, {scale:true});
        gsap.set(detailsRef.current, {clearProps: true});
        gsap.set(detailsRef.current, {  
            position: "fixed",
            top: "50%",
            left: "50%",
            xPercent: -50,
            yPercent: -50,
            scale: screenWidth > 768? 1.5 : 2,
            visibility: "visible"});
        gsap.set(relayRefs.current[index], {visibility: "hidden"})

        // console.log(detailsRef.current.getBoundingClientRect().bottom)

        gsap.to('.memory-button', {
            bottom: 0.95 * window.innerHeight - detailsRef.current.getBoundingClientRect().bottom - 50, //place below the details page
            duration: 0.5
        })

        // console.log("Killing old anim:", currentAnim.current);
        // currentAnim.current?.kill();
        //currentAnim.current =
        Flip.from(state, {
            duration: 0.5,
            ease:"power2.inOut",
            scale: true,
        })
    })

    const hideDetails = contextSafe(()=>{
        //TODO hide the button
        if (selectedRelay == null || isAnimating.current) return; 
        isAnimating.current = true;
        const state = Flip.getState(detailsRef.current, {scale:true});
        Flip.fit(detailsRef.current, relayRefs.current[selectedRelay], {scale:true})
	    const tl = gsap.timeline({onComplete: () =>{
            setSelectedRelay(null)
            isAnimating.current = false;
            },
        });
        
        // console.log("Killing old anim:", currentAnim.current?.id);
        // currentAnim.current?.kill();
        // currentAnim.current = tl;

        gsap.to('.memory-button', {
            bottom: -50,
            duration: 0.5
        })

        tl.add(Flip.from(state, {
            scale: true,
            duration: 0.5,
            onInterrupt: () => tl.kill(),
        })
        .set(detailsRef.current, {visibility:"hidden"})
        .set(relayRefs.current[selectedRelay], {visibility: "visible", scale: 1}))
        
    }) //TODO: remove onClick details if  selectedRelay == null;
    
    // const relaysWithStyle = useMemo(() =>
    //     relays.map(relay => ({
    //         ...relay,
    //         randomStyle: {
    //             rotation: Math.random() * 2,
    //             direction: Math.random() > 0.5 ? 1 : -1,
    //     }
    // })), [relays]);
    
    if(error){
        return(
            <>
                <p>{error}</p>
            </>
        )
    }
    if(loading || !isImagesLoaded){
        return(
            <div className='relays-page'>
                <Spinner />
            </div>
        )
    }
    return (
        <div className='relays-page'>
            {/* {loading?             
                <div className='spinner-container flex'>
                    <div className='spinner'></div>
                    <p>加载中...</p>
                </div> //TODO animation seems to break if spinner. 
                : */}
                <div className='relay-grid' onClick={hideDetails}>
                   {relays.map((relay, i)=>(
                    <Polaroids 
                        relay={relay} 
                        key={i} 
                        ref={(element) => relayRefs.current[i] = element} 
                        onClick={()=>showDetails(i)}
                    />))}
                </div>
            {/* } */}
            <Polaroids relay={relays[selectedRelay]} details={true} ref={detailsRef} onClick={hideDetails}/>
            {/* <Details relay={relays[selectedRelay]} ref={detailsRef} onClick={hideDetails}/> onClick={()=>setSelectedRelay(null)} change to a modal that hides this. */}
            <button className='memory-button menu-button' 
                onClick={()=>{
                        // navigateTo(`/relays/${relays[selectedRelay].name}`)
                        open(relays[selectedRelay].details.link, "_blank")
                    }}>
                        <ExternalLink />
                        浏览回忆
            </button>
        </div>
    )
}

export default RelayPage