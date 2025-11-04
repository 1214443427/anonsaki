import React from 'react'
import SplitText from "gsap/SplitText";
import gsap from "gsap";
import { useGSAP } from '@gsap/react';
gsap.registerPlugin(SplitText)

function useSplit(target, granularity, options) {
    let split
    const segmenter = new Intl.Segmenter("zh", { granularity: granularity });
    useGSAP((context, contextSafe)=>{
            document.fonts.ready.then(()=>{
                contextSafe(()=>{
                split = SplitText.create(target, {
                type: options.type,
                wordsClass: options.wordsClass, 
                charsClass: options.charsClass,
                linesClass: options.linesClass,
                // ignore: ".moon",
                prepareText: (text, el) => {
                    const segmented = [...segmenter.segment(text)].map(s => s.segment)
                    const joined = []
                    for (const segment of segmented){
                    if (segment === "," || segment === "。" || segment === "?" || segment === "！"|| segment === "!"){
                        joined[joined.length - 1] += segment;
                        console.log(joined)
                    }else{
                        joined.push(segment)
                    }
                    }
                    return(joined.join("\u200c"))
                },
                wordDelimiter: { delimiter: /\u200c/},
                // autoSplit: true,
                // onSplit: (self)=>{},
                }
            )
                        console.log(context)
})()
        })
    },[])
  return split
}

export default useSplit