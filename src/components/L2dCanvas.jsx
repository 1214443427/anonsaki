import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import { useIdle } from "../hooks/useIdle";
import { useGSAP } from "@gsap/react";
import useSplit from "../hooks/useSplit";

gsap.registerPlugin(SplitText)

function SplitedText({children, model}){
    const splitRef = useRef(null)
    // useGSAP((context, contextSafe)=>{
    //     document.fonts.ready.then(()=>{
    //         // SplitText.create(".live2d-dialog", {
    //         //     type: "chars, lines",
    //         //     charsClass: "char",
    //         //     linesClass: "line++",
    //         // })
    //         contextSafe(()=>
                useSplit(".live2d-dialog", "word",
                    {
                        type: "chars",
                        charsClass: "char",
                    }
                )
    //         )()
    //     })
    // },[])

    return(
        <p className={`live2d-dialog ${model}-dialog`}>
            {children}
        </p>
    )
}

function L2dCanvas( {character, offsetBottom, width, height} ) {
    const live2DMgrRef = useRef(null)
    
    const model = character == "anon" ? 1 : character == "saki"? 0 : 2 ; //saki = 0

    const [isDrawStart, setIsDrawStart] = useState(false)
    
    const glRef = useRef(null)
    const canvasRef = useRef(null);
    const containerRef = useRef(null);

    const dragMgrRef = useRef(null);
    const viewMatrixRef = useRef(null);
    const projMatrixRef = useRef(null);
    const deviceToScreenRef = useRef(null);

    const [isDrag, setIsDrag] = useState(false)
    const [lastMouseX, setLastMouseX] = useState(0)
    const [lastMouseY, setLastMouseY] = useState(0)

//   const [isModelShown, setIsModelShown] = useState(false)  
    
    const {isIdle, resetTimer} = useIdle(20000)
    
    const timeoutId = useRef(null);
    let brithdayAnimationTriggered = false;
    const date = new Date()
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const mouseHandler = (e) => {
        if(timeoutId.current){
            return
            // clearTimeout(timeoutId);
            // timeoutId = null;
        }

        const rect = e.target.getBoundingClientRect();
        // console.log("rect", rect)
        var sx = transformScreenX((e.clientX - rect.left)/rect.width*width);
        var sy = transformScreenY((e.clientY - rect.top)/rect.height*height);
        var vx = transformViewX((e.clientX - rect.left)/rect.width*width);
        var vy = transformViewY((e.clientY - rect.top)/rect.height*height);
        // smile()
        const adjustedX = (e.clientX - rect.left)/rect.width
        const adjustedY = (e.clientY - rect.top)/rect.height

        //   console.log(vx,vy)
        //   dragMgrRef.current.setPoint(vx, vy)
        if (date.getMonth()==8 && date.getDate()==8 && !brithdayAnimationTriggered && model == 0){
            playBrithdayAnimation(0)
        }else if(date.getMonth()==1 && date.getDate()==14 && !brithdayAnimationTriggered && model == 1){
            playBrithdayAnimation(1)
        }
        live2DMgrRef.current.tapEvent(adjustedX, adjustedY)
        const id = setTimeout(()=>{
            live2DMgrRef.current.idelExpression()
            // console.log("timeout triggered")
            timeoutId.current = null
        }, 2000)
        timeoutId.current = id
        };
        const touchHandler = (e) => { /* handle touch */ };

        canvas.addEventListener("mousedown", mouseHandler);
        // canvas.addEventListener("mousemove", mouseHandler);
        canvas.addEventListener("mouseup", mouseHandler);
        // canvas.addEventListener("mouseout", mouseHandler);

        canvas.addEventListener("touchstart", touchHandler);
        canvas.addEventListener("touchend", touchHandler);
        canvas.addEventListener("touchmove", touchHandler);

        return () => {
        // cleanup listeners
        canvas.removeEventListener("mousedown", mouseHandler);
        canvas.removeEventListener("mousemove", mouseHandler);
        canvas.removeEventListener("mouseup", mouseHandler);
        canvas.removeEventListener("mouseout", mouseHandler);

        canvas.removeEventListener("touchstart", touchHandler);
        canvas.removeEventListener("touchend", touchHandler);
        canvas.removeEventListener("touchmove", touchHandler);
        };
    }, [model]);
    useEffect(() => {
        const canvas = canvasRef.current
        // console.log(canvas)
        if (!canvas) return;

        live2DMgrRef.current = new LAppLive2DManager(canvas)
        
        const width = canvas.width
        const height = canvas.height

        dragMgrRef.current  = new L2DTargetPoint();
    
        const ratio = height/width;
        const left = LAppDefine.VIEW_LOGICAL_LEFT;
        const right = LAppDefine.VIEW_LOGICAL_RIGHT;
        const bottom = -ratio;
        const top = ratio;

        viewMatrixRef.current  = new L2DViewMatrix();
        const viewMatrix = viewMatrixRef.current;

        viewMatrix.setScreenRect(left, right, bottom, top);
        viewMatrix.setMaxScreenRect(LAppDefine.VIEW_LOGICAL_MAX_LEFT,
                                    LAppDefine.VIEW_LOGICAL_MAX_RIGHT,
                                    LAppDefine.VIEW_LOGICAL_MAX_BOTTOM,
                                    LAppDefine.VIEW_LOGICAL_MAX_TOP); 

        viewMatrix.setMaxScale(LAppDefine.VIEW_MAX_SCALE)
        viewMatrix.setMinScale(LAppDefine.VIEW_MIN_SCALE);

        projMatrixRef.current = new L2DMatrix44();
        const projMatrix = projMatrixRef.current
        projMatrix.multScale(1, (width / height));

        deviceToScreenRef.current = new L2DMatrix44();
        const deviceToScreen = deviceToScreenRef.current;
        deviceToScreen.multTranslate(-width / 2.0, -height / 2.0);
        deviceToScreen.multScale(2 / width, -2 / width);
        const gl = getWebGLContext(canvas);
        if (!gl) {
            console.error("Failed to create WebGL context.");
            return;
        }
        // console.log("glno", model)
        Live2D.setGL(gl);
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        glRef.current = gl;

        changeModel(model);
        return(()=>{
            Live2D.dispose();
        })
    }, [])
    

    useEffect(()=>{
        let animationFrameId;
        const drawLoop = () => {
        if(!isDrawStart && glRef.current && live2DMgrRef.current){
            setIsDrawStart(true);
            // console.log("num of model on draw", live2DMgrRef.current.numModels())
            function tick(){
                draw();
                animationFrameId  = requestAnimationFrame(tick, canvasRef.current)
            }
            tick()
        }
        }
        drawLoop();
        return(()=>{
        cancelAnimationFrame(animationFrameId)
        })
    }, [])

    useEffect(()=>{
        if(glRef.current && live2DMgrRef.current){
            // console.log("useEffect model re-render")
            changeModel(model)
            gsap.set(".canvas-dialog", {opacity:0})
        }
    }, [model])

    
    // useGSAP(()=>{
    //     if(isIdle && model == 0){
    //         const tl = gsap.timeline({onComplete:resetTimer})
    //         tl.to(".canvas-dialog", {
    //             duration: 6,
    //             onStart: thinking,
    //             keyframes:{
    //                 "0%": {opacity: 0},
    //                 "10%": {opacity: 1},
    //                 "90%": {opacity: 1},
    //                 "100%": {opacity: 0},
    //             }
    //         })
    //     }
    // }, [isIdle])

    const splitRef = useRef(null)
    const timelineRef = useRef(null)
    const {contextSafe} = useGSAP(()=>{
        timelineRef.current = gsap.timeline()
        return (()=>{
            timelineRef.current.revert()
            if(timeoutId.current){
                clearTimeout(timeoutId.current)
                timeoutId.current = null
            }
        })
        },[model]
    )
    const playBrithdayAnimation = contextSafe((character)=>{
        brithdayAnimationTriggered = true
        // console.log("triggered")
        if(timeoutId.current){
            clearTimeout(timeoutId.current)
            timeoutId.current = null
        }
        const tl = timelineRef.current
        tl.clear()
        gsap.set(".canvas-dialog", {opacity: 0})
        if(character == 0){
            // console.log("testing timeoutID", timeoutId.current)
            tl.to(".canvas-dialog", {
                duration: 1,
                onStart: ()=>playMotionExpression("thinking01", "shame02", 3, 5000),
                opacity: 1
                // keyframes:{
                //     "0%": {opacity: 0},
                //     "10%": {opacity: 1},
                //     "90%": {opacity: 1},
                //     "100%": {opacity: 0},
                // }
            })
            .fromTo(".line1 .char", {opacity:0}, {
                duration: 0.5,
                opacity: 1,
                stagger: 0.05,
            }, "<0.25")
            .fromTo(".line2 .char", {opacity:0}, {
                duration: 2.25,
                opacity: 1,
                stagger: 0.05,
                onStart: ()=>playMotionExpression("kime01", "kime01", 3, 2250),
                onComplete: ()=>playMotionExpression("smile05", "smile01", 3, 3000),
            }, "+=2.2")
            .to(".canvas-dialog , .line1 .char", {
                duration: 1,
                opacity: 0,
                delay: 4
            })
            // console.log(splitRef.current)
        }else if(character==1){
            tl.to(".canvas-dialog", {
                duration: 1,
                onStart: ()=>playMotionExpression("kime01", "kime01", 3, 4200),
                opacity: 1
            })
            .fromTo(".line1 .char", {opacity:0}, {
                duration: 0.5,
                opacity: 1,
                stagger: 0.05,
            }, "<0.25")
            .fromTo(".line2 .char", {opacity:0}, {
                duration: 4.25,
                opacity: 1,
                stagger: {
                    amount: 1.5
                },
                onStart: ()=>playMotionExpression("smile04", "smile04", 3, 5000),
                onComplete: ()=>playMotionExpression("idle01", "idle01", 3, 1000),
            }, "+=2.2")
            .to(".canvas-dialog", {
                duration: 1,
                opacity: 0,
                // onStart: ()=>playMotionExpression("idle01", "idle01", 3, 1000),
                delay: 2
            })
        }
    })

    function playMotionExpression(motion, expression, priority, timeout){
        if(timeoutId){
            clearTimeout(timeoutId)
            timeoutId.current = null;
        }
        live2DMgrRef.current.startMotionExpressionPair(motion, expression, priority)
        timeoutId.current = setTimeout(()=>{
            live2DMgrRef.current.idelExpression()
            timeoutId.current = null
        }, timeout)
    }

  // useImperativeHandle(ref, ()=>{
  //   return{
  //     switchModel(model){
  //       changeModel(model)
  //     }
  //   }
  // })

    function draw(){
        MatrixStack.reset();
        MatrixStack.loadIdentity();
        const dragMgr = dragMgrRef.current
        dragMgr.update()  
        const live2DMgr = live2DMgrRef.current
        live2DMgr.setDrag(dragMgr.getX(), dragMgr.getY())

        const gl = glRef.current
        gl.clear(gl.COLOR_BUFFER_BIT)

        const projMatrix = projMatrixRef.current
        const viewMatrix = viewMatrixRef.current;

        MatrixStack.multMatrix(projMatrix.getArray());
        MatrixStack.multMatrix(viewMatrix.getArray());
        MatrixStack.push();
        
        for (let i = 0; i < live2DMgr.numModels(); i++){
            const model = live2DMgr.getModel(i);
            if(model == null) return;
            // viewMatrix.translateX(-0.5)
            
        if(model.initialized && !model.updating){

            model.update();
            model.draw(gl);

            // if(!isModelShown && i == live2DMgr.numModels()-1){
            //   setIsModelShown((prev)=>!prev)  
            //   //(prev)=>!prev
            // }
        }

        }
        MatrixStack.pop();

    }

    function transformViewX(deviceX)
    {
        var screenX = deviceToScreenRef.current.transformX(deviceX); 
        return viewMatrixRef.current.invertTransformX(screenX); 
    }


    function transformViewY(deviceY)
    {
        var screenY = deviceToScreenRef.current.transformY(deviceY); 
        return  viewMatrixRef.current.invertTransformY(screenY); 
    }


    function transformScreenX(deviceX)
    {
        return deviceToScreenRef.current.transformX(deviceX);
    }


    function transformScreenY(deviceY)
    {
        return deviceToScreenRef.current.transformY(deviceY);
    }

    function createModel(character)
    {
        live2DMgrRef.current.createModel(glRef.current, character)
    }

    function changeModel(model)
    {
        if(glRef.current){
        live2DMgrRef.current.reloadFlg = true;
        live2DMgrRef.current.changeModel(glRef.current, model)
        }
    }

    function smile(){
        live2DMgrRef.current.tapEvent(0, 0.5)
    }



    return (
        <div id={'gl_canvas'} style={{bottom: offsetBottom }} ref={containerRef}>
            <canvas ref={canvasRef} width={width} height={height}
                //(canvasRef.current? canvasRef.current.offsetHeight:0)
            />
                <div className='canvas-dialog non-select'>
                    {model==0?
                    <SplitedText model="saki"  key="dialog-1">
                    <span className="line1">今天是小爱的生日呢。</span><br/>
                    <span className="line2">Mujica风格的定制蛋糕她肯定会喜欢吧！</span>
                    </SplitedText>:
                    <SplitedText model="anon"  key="dialog-2">
                    <span className="line1">又到了我最喜欢的一天！</span><br/>
                    <span className="line2">祥祥生日和情人节的双倍约会！</span>
                    </SplitedText>}
                </div>
            {/*  <button onClick={playBrithdayAnimation}>test</button>  */}
        </div>
    )

}  

export default L2dCanvas