import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import { useIdle } from "../hooks/useIdle";
import { useGSAP } from "@gsap/react";

function L2dCanvas( {character, offsetBottom, width, height} ) {
    const live2DMgrRef = useRef(null)
    
    const model = character == "anon" ? 1 : 0 ; //saki = 0

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

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        let timeoutId;
        const mouseHandler = (e) => {
        if(timeoutId){
            return
            // clearTimeout(timeoutId);
            // timeoutId = null;
        }

        const rect = e.target.getBoundingClientRect();
        console.log("rect", rect)
        var sx = transformScreenX((e.clientX - rect.left)/rect.width*width);
        var sy = transformScreenY((e.clientY - rect.top)/rect.height*height);
        var vx = transformViewX((e.clientX - rect.left)/rect.width*width);
        var vy = transformViewY((e.clientY - rect.top)/rect.height*height);
        // smile()
        const adjustedX = (e.clientX - rect.left)/rect.width
        const adjustedY = (e.clientY - rect.top)/rect.height

        //   console.log(vx,vy)
        //   dragMgrRef.current.setPoint(vx, vy)

        live2DMgrRef.current.tapEvent(adjustedX, adjustedY)
        const id = setTimeout(()=>{
            live2DMgrRef.current.idelExpression()
            timeoutId = null
        }, 2000)
        timeoutId = id
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
    }, []);
    useEffect(() => {
        const canvas = canvasRef.current
        console.log(canvas)
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
            console.log("Failed to create WebGL context.");
            return;
        }
        console.log("glno", model)
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
        console.log("useEffect model re-render")
        changeModel(model)
        }
    }, [model])


    const {contextSafe} = useGSAP(
    )
    
    useGSAP(()=>{
        if(isIdle && model == 0){
            const tl = gsap.timeline({onComplete:resetTimer})
            tl.to(".canvas-dialog", {
                duration: 6,
                onStart: thinking,
                keyframes:{
                    "0%": {opacity: 0},
                    "10%": {opacity: 1},
                    "90%": {opacity: 1},
                    "100%": {opacity: 0},
                }
            })
        }
    }, [isIdle])


    const showDialogBox =  contextSafe(()=>{
    })
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

    function thinking(){
        live2DMgrRef.current.thinking()
        setTimeout(()=>{
            live2DMgrRef.current.idelExpression()
        }, 5000)
        }

        return (
            <div id={'gl_canvas'} style={{bottom: offsetBottom }} ref={containerRef}>
            <canvas ref={canvasRef} width={width} height={height}
                //(canvasRef.current? canvasRef.current.offsetHeight:0)
            />
            <div className='canvas-dialog'>
                <p>测试</p>
            </div>
            </div>
    )

}  

export default L2dCanvas