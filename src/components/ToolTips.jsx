import React, { useEffect, useRef, useState } from 'react'
import './ToolTips.css'
import ExternalLink from './ExternalLink';

function ToolTips({displayText, content, link}) {

    const [isVisible, setIsVisible] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null);
    const tooltipRef = useRef(null);
    const triggerRef = useRef(null);

    useEffect(() => {
        if (isVisible) {
            const handleClickOutside = (event) => {
                if (
                tooltipRef.current &&
                triggerRef.current &&
                !tooltipRef.current.contains(event.target) &&
                !triggerRef.current.contains(event.target)
                ) {
                    setIsVisible(false);
                }
            };

            document.addEventListener('touchstart', handleClickOutside);
            document.addEventListener('click', handleClickOutside);
            
            return () => {
                document.removeEventListener('touchstart', handleClickOutside);
                document.removeEventListener('click', handleClickOutside);
            };
        }
    }, [isVisible]);

    const handleMouseEnter = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            setTimeoutId(null);
        }
        setIsVisible(true);
    };

    const handleMouseLeave = () => {
        const id = setTimeout(()=>{
            setIsVisible(false);      
        }, 200)


        setTimeoutId(id)
    }

    const handleTooltipEnter = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            setTimeoutId(null);
        }
    }

    return (
        <span className='tooltip-container'>
            <p className='tooltip-display-text' 
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleMouseEnter}
                onTouchStart={handleMouseEnter}
                ref={triggerRef}
                >
                {displayText}
            </p>
            <span className={`tooltip-body ${isVisible? "display":""}`} 
                ref={tooltipRef}
                onMouseEnter={handleTooltipEnter}
                onMouseLeave={handleMouseLeave}
               >
                {link?
                <a href={link}> 
                <p className='link-content'>
                    <ExternalLink />
                    {content}
                </p>
                </a>
                :
                <p className='tooltip-content'>
                    {content}
                </p>
                }
            </span>
        </span>
    )
}

export default ToolTips