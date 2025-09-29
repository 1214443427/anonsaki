import { useEffect, useRef, useState, useImperativeHandle } from 'react'
import gsap from "gsap"
import ScrollTrigger from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useGSAP } from '@gsap/react';
import ScrollIndicator from '../components/ScrollIndicator';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const TOTAL_FRAMES = 180;
const IMG_OFFSET = 3;
const ANIMAION_DURATION = 3000;
const DANMAKU = [
  {text: "爱祥99", speed: 0.85, yPos: 10, color: "#FF6B6B", delay: 0},
  {text: "爱祥99", speed: 0.8, yPos: 20, color: "#C7B8FF", delay: 0.3},
  {text: "哦不，推推的开", speed: 0.4, yPos: 20, color: "#96CEB4", delay: 0.3},
  {text: "哦耶，爱爱的祥", speed: 0.75, yPos: 20, color: "#96CEB4", delay: 0.3},
  {text: "呃啊感性感性", speed: 0.8, yPos: 20, color: "#45B7D1", delay: 0.3},
  {text: "呃啊本能本能", speed: 0.6, yPos: 20, color: "#4ECDC4", delay: 0.3},
  {text: "呃啊理性理性", speed: 0.5, yPos: 20, color: "#FFEAA7", delay: 0.3},
  {text: "没有算了", speed: 1, yPos: 20, color: "#DDA0DD", delay: 0.3},
  {text: "真的唉", speed: 0.2, yPos: 20, color: "#a0caddff", delay: 0.3},
  {text: "汉墓封土", speed: 0.1, yPos: 20, color: "#0d6e9bff", delay: 0.3},
  
]

function L2dCanvas( {character, offsetBottom} ) {
  const live2DMgrRef = useRef(null)
  
  const model = character == "anon" ? 1 : 0 ; //saki = 0

  const [isDrawStart, setIsDrawStart] = useState(false)
  
  const glRef = useRef(null)
  const canvasRef = useRef(null);
  
  const dragMgrRef = useRef(null);
  const viewMatrixRef = useRef(null);
  const projMatrixRef = useRef(null);
  const deviceToScreenRef = useRef(null);

  const [isDrag, setIsDrag] = useState(false)
  const [lastMouseX, setLastMouseX] = useState(0)
  const [lastMouseY, setLastMouseY] = useState(0)

  const [isModelShown, setIsModelShown] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mouseHandler = (e) => { /* handle mouse */ };
    const touchHandler = (e) => { /* handle touch */ };

    canvas.addEventListener("mousedown", mouseHandler);
    canvas.addEventListener("mousemove", mouseHandler);
    canvas.addEventListener("mouseup", mouseHandler);
    canvas.addEventListener("mouseout", mouseHandler);

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

      if(model.initialized && !model.updating){


        const matrix = new L2DMatrix44();
        // if (i === 0) {
        //   matrix.translate(-0.2, 0); // left
        //   matrix.scale(0.8, 0.8);
        // } else {
        // matrix.translate(0.2, 0); // right
        // matrix.scale(0.8, 0.8);
        // }
        MatrixStack.multMatrix(matrix.getArray());

        model.update();
        model.draw(gl);

        if(!isModelShown && i == live2DMgr.numModels()-1){
          setIsModelShown((prev)=>!prev)
          //(prev)=>!prev
        }
      }

    }
    MatrixStack.pop();

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
    <>
      <canvas ref={canvasRef} id={'gl_canvas'} width={600} height={800}
        style={{bottom: offsetBottom }} //(canvasRef.current? canvasRef.current.offsetHeight:0)
      />
    </>
  )

}  


function Danmaku({danmaku, timelinesRef, index}){
  const ref = useRef(null);
  const [style] = useState(()=>({
      "--color": danmaku.color,
      "--top":`${Math.random() > 0.5? Math.random() * 30 + 60 : Math.random() * 30 + 10}vh`,
      "--size":`${Math.random() + 1} rem`
  }))

  // console.log("danmaku called")

  useEffect(()=> {
    if (!ref.current) return;

    const tl = gsap.timeline({ paused: true});
    tl.set(ref.current, { 
      opacity: 1,
        x:300
    })
    .to(ref.current, {
      x: -window.innerWidth - 300,
      duration: 1,
      ease: "none",
    });

    timelinesRef.current[index] = tl;

    // console.log("timelinesRef AFTER setting index", timelinesRef.current)

    return () => tl.kill();
  }, []);
  

  return(
      <p className='danmaku' 
        style={
          style
        }
        ref={ref}>
        {danmaku.text}
      </p>
  )
}


function DanmakuContainer(){
    const timelinesRef = useRef([]);

    console.log("DanmakuContainer called", DANMAKU)


    useEffect(()=> {
      const trigger = ScrollTrigger.create({
        trigger: ".animation-container",
        start: "top top",
        end: "bottom top",
        scrub: 0.3,
        onUpdate: (self) => {
          const progress = self.progress;
          // console.log("timelinesRef.current", timelinesRef.current)
          timelinesRef.current.forEach((tl, index) => {
            // const staggerDelay = (index / DANMAKU.length) * 0.8;
            // const adjustedProgress = Math.max(
            //   0, (progress - staggerDelay) / (1 - staggerDelay)
            // );

            const adjustedProgress = progress/DANMAKU[index].speed
            tl.progress(Math.min(Math.max(adjustedProgress, 0), 1))
          })
        }
      })
      return ()=> trigger.kill()
    },[])

    return (
      <div className='danmaku-container'>
        {DANMAKU.map((danmaku, index)=>
          (<Danmaku key={index} danmaku={danmaku} timelinesRef={timelinesRef} index={index}/>)
        )}
      </div>
    )
  }


function CharacterPage({navigateTo}) {
  const [character, setCharacter] = useState("anon")
  const canvasRef = useRef(null)
  const [images, setImages] = useState([]);
  // const l2dRef = useRef();
  const [offsetBottom, setoffsetBottom] = useState(0)
  // const [danmakuArray, setDanmakuArray] = useState([<></>])


  // const handleSwitch = () => {
  //   const model = character == "saki" ? "anon":"saki"
  //   setCharacter(model)
  // };

  useEffect(() => {
    const frameImages = [];
    for ( let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/frames/webp_frames/frame_${String(i+IMG_OFFSET).padStart(4, "0")}.webp`;
      frameImages.push(img)
    }
    setImages(frameImages)
  }, [])

  useEffect(()=>{
    const onScroll = () => {
      const sections = document.querySelectorAll(".character-section");
      sections.forEach((section, index) =>{
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight/2 && rect.bottom >= 0){
          setoffsetBottom(document.body.offsetHeight - section.offsetTop - .85 * rect.height + 20)
          console.log("setting character", index)
          setCharacter(index==0? "saki": "anon")
        }
      })
    }
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);
    onScroll();

    return ()=>{
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll);
    }
  }, [])

  useGSAP(()=>{
    if (images.length === 0) return;

    scrollTo(0,0)

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    
    const scale = window.devicePixelRatio || 1;
    canvas.width = 1920 * scale;
    canvas.height = 1080  * scale;
    context.scale(scale, scale)

    const frameState = { frame: 0 };

    console.log(scale)

    const render = () => {
      const img = images[frameState.frame];
      if(img?.complete){
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(
          img,
          0,
          0,
          canvas.width / scale,
          canvas.height / scale
        )
      }
    } //use decode.


    gsap.to(frameState, {
      frame: TOTAL_FRAMES - 1,
      ease: "none",
      snap: "frame",
      scrollTrigger: {
        trigger: ".animation-container",
        start: "top top",
        end: "bottom top",
        scrub: true,
        onEnter: () => canvas.classList.remove("hidden"),
        onLeaveBack: () => canvas.classList.add("hidden"),
        onLeave: () => canvas.classList.add("hidden"),
        onEnterBack: () => canvas.classList.remove("hidden"),
      },
      onUpdate: render,
      })

    images[0].onload = render;
    if (images[0].complete) render();
    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [images])



  // const danmakuComponents = DANMAKU.map(danmaku=> (<Danmaku danmaku = {danmaku}/>))
  // useEffect(()=>{
  //   const danmakuTimelines = []
  //   danmakuComponents.forEach((danmakuComponent)=>{
  //     const tl = gsap.timeline({ paused: true});

  //     tl.set(danmakuComponent, {
  //       opacity: 1,
  //       x: 300
  //     })
  //     .to(danmakuComponent, {
  //       x: - window.innerWidth - 300,
  //       duration: 1,
  //       ease: "none"
  //     });

  //     danmakuTimelines.push(tl);
  //   })
  // },[]
  // )



  return (
    <div className='flex flex-col page main-page'>
      <div className='character-curtain curtain'></div>
      <L2dCanvas character={character} offsetBottom={offsetBottom}/> 
      <section className='character-section saki-section'>
        <div className='dialog-box saki-border'>
          <h1>Togawa Sakiko</h1>
          <p>羽丘学院1年b班<br/>
            Ave Mujica键盘手
            炽天使31O部队队长<br/>
            霍格沃茨魔法学校，拉文克劳学院学生
            </p>
        </div>
      </section>

      <div className='animation-container'>
        <DanmakuContainer />
        <canvas
          ref={canvasRef}
          className='animation-canvas hidden'
          />


        <div className="card" style={{position:"relative",zIndex:2}}>
          <div style={{height: `${ANIMAION_DURATION}px`}}>
          </div>
        </div>
        
      </div>

      <section className='character-section anon-section'>
        <div className='dialog-box anon-border'>
          <h1>Chihaya Anon</h1>
          <p>羽丘学院1年a班<br/>
            Mygo 吉他手
            炽天使30A部队队长<br/>
            霍格沃茨魔法学校，拉文克劳学院学生
            </p>
        </div>
      </section>

      <button id='explore-button' onClick={()=>navigateTo("/relays")}>探索接力</button>
      <ScrollIndicator />
    </div>
  )
}

export default CharacterPage

