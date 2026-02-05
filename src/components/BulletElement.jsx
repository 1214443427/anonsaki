import { useGSAP } from "@gsap/react";
import { gsap } from "gsap/gsap-core";
import { useRef } from "react";

export default function BulletElement({elements, timeline, index}){
    const ref = useRef(null);
    const selectedEmoji = elements[index % elements.length]
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
        }, "<").to(ref.current, {
            opacity:0,
            duration: 2.45,
            ease: "power3.in"
        }, "<")
    }, [timeline, index])

    return <div ref={ref} className='heart-bullet non-select'>{selectedEmoji}</div>
}