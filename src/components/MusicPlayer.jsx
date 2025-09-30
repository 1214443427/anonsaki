import React, { useEffect, useRef, useState } from 'react'
import './MusicPlayer.css'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

function MusicPlayer() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const audioRef = useRef(null);
    const [songs, setSongs] = useState([{
        name: "亚麻色头发的少女",
        url: "/assets/La fille aux cheveux de lin.mp3",
        author: "德彪西"
    }])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [songStatus, setSongStatus] = useState({
        currentTime: 0,
        duration: 0
    })
    const animationRef = useRef(null)

    const timeUpdateHandler = (e) => {
        setSongStatus({
            currentTime: e.target.currentTime,
            duration: e.target.duration,
        })
    }

    const playPause = () => {
        if(!audioRef.current) return;
        if(isPlaying == false){
            audioRef.current.play()
        }else{
            audioRef.current.pause()
        }
    }

    useEffect(()=> {
        const audio = audioRef.current;
        if(!audio) return;

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        audio.addEventListener("play", handlePlay);
        audio.addEventListener("pause", handlePause);

        const play = ()=> {audio.play()}
        // audio.play().catch(() => {
        //     document.addEventListener('click', play, {once: true})
        // })
        return(()=>{
            audio.removeEventListener("play", handlePlay);
            audio.removeEventListener("pause", handlePause);
            document.removeEventListener("click", play)
        })
    }, [])

    useGSAP(()=>{
        if(animationRef.current == null){
            animationRef.current = gsap.to(".vinyl", {
                rotate: 360,
                repeat: -1,
                duration: 30,
                ease: 'none'
            })
            animationRef.current.pause()
        }else if(isPlaying){
            animationRef.current.play()
        }else{
            animationRef.current.pause()
        }
    }, [isPlaying])


    return (
        <>
            <audio 
                src={songs[currentIndex].url} 
                onLoadedMetadata={timeUpdateHandler}
                onTimeUpdate={timeUpdateHandler}
                ref={audioRef}
            />
            {isModalOpen?
            <div></div>
            :
            <div className='music-player-minimized' onClick={playPause}>
                {/* <button onClick={playPause}>Pause / Play</button> */}
                <img className={`vinyl`} src='/assets/vinyl.webp'/>
                <img className='vinyl-arm' src='/assets/vinylArm.webp' />
                <div className='play-pause-indicator'></div>
                <div className='play-pause-button'>
                    {
                        !isPlaying?
                        <svg className='play-pause-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor"><path d="M187.2 100.9C174.8 94.1 159.8 94.4 147.6 101.6C135.4 108.8 128 121.9 128 136L128 504C128 518.1 135.5 531.2 147.6 538.4C159.7 545.6 174.8 545.9 187.2 539.1L523.2 355.1C536 348.1 544 334.6 544 320C544 305.4 536 291.9 523.2 284.9L187.2 100.9z"/></svg>
                        :
                        <svg className='play-pause-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor"><path d="M176 96C149.5 96 128 117.5 128 144L128 496C128 522.5 149.5 544 176 544L240 544C266.5 544 288 522.5 288 496L288 144C288 117.5 266.5 96 240 96L176 96zM400 96C373.5 96 352 117.5 352 144L352 496C352 522.5 373.5 544 400 544L464 544C490.5 544 512 522.5 512 496L512 144C512 117.5 490.5 96 464 96L400 96z"/></svg>
                    }
                </div>
            </div>
            }
        </>
        )
}

export default MusicPlayer