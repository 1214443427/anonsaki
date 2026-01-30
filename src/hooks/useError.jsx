import React, { useEffect, useRef, useState } from 'react'

function useError(timeout = 2500) {
    const [error, setError] = useState(null)
    const timeoutRef = useRef(null)

    useEffect(()=>{
        if(error!=null){
            if(timeoutRef.current){
                clearTimeout(timeoutRef.current)
            }
            timeoutRef.current = setTimeout(()=>{
                setError(null)
            }, timeout)
        }
        return() => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [error])

    return [error, setError]
}

export default useError