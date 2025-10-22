import { useCallback, useEffect, useRef, useState } from "react";

export function useIdle(timeout = 10000){
    const [isIdle, setIsIdle] = useState(false)
    const timeOutRef = useRef()
    const isDragging = useRef()
    const [isBottom, setIsBottom] = useState()

    const resetTimer = useCallback(() => {
        setIsIdle(false);
        if(timeOutRef.current){
            clearTimeout(timeOutRef.current)
        }
        timeOutRef.current = setTimeout(()=>{
            setIsIdle(true)
        },timeout)
    }, [timeout])

    useEffect(()=>{
        resetTimer()
        const handleScroll = () => {
            const isAtBottom = document.documentElement.scrollHeight <= window.scrollY + document.documentElement.clientHeight * 1.5
            setIsBottom(isAtBottom)
            resetTimer()
        }

        const handleDragStart = (e) => {
            if(e.target.closest('[data-draggable="true"]')){
                isDragging.current = true
                resetTimer()
            }
        }

        const handleDragging = (e) => {
            if(isDragging.current == true){
                resetTimer()
            }
        }

        const handleDragEnd = (e) => {
            if(isDragging.current == true){
                isDragging.current = false
            }
        }

        document.addEventListener("scroll", handleScroll, { passive: true, capture: true })
        document.addEventListener("mousedown", handleDragStart)
        document.addEventListener("mousemove", handleDragging)
        document.addEventListener("mouseup", handleDragEnd)
        document.addEventListener("touchstart", handleDragStart, { passive: true})
        document.addEventListener("touchmove", handleDragging, { passive: true})
        document.addEventListener("touchend", handleDragEnd)

        return ()=>{
            if (timeOutRef.current) {
                clearTimeout(timeOutRef.current);
            }
            document.removeEventListener("scroll", handleScroll, { passive: true, capture: true })
            document.removeEventListener("mousedown", handleDragStart)
            document.removeEventListener("mousemove", handleDragging)
            document.removeEventListener("mouseup", handleDragEnd)
            document.removeEventListener("touchstart", handleDragStart, { passive: true})
            document.removeEventListener("touchmove", handleDragging, { passive: true})
            document.removeEventListener("touchend", handleDragEnd)
        }
    }, [resetTimer])

    return(
        {isIdle, isBottom, resetTimer}
    )

}