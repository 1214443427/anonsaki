import React from 'react'
import { useIdle } from '../hooks/useIdle'

function ScrollIndicator() {

    const {isIdle, isBottom} = useIdle()

    return (
        <div className={`scroll-indicator-mini ${isIdle && !isBottom ? "show" : ""}`}>
            下滑阅览   ⬇️
        </div>
    )
}

export default ScrollIndicator