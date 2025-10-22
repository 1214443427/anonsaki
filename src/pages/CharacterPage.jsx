import { useEffect, useRef, useState, useImperativeHandle } from 'react'
import gsap from "gsap"
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react';
import ScrollIndicator from '../components/ScrollIndicator';
import ToolTips from '../components/ToolTips';
import L2dCanvas from '../components/L2dCanvas';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 180;
const IMG_OFFSET = 3;
const ANIMAION_DURATION = 3000;
const DANMAKU = [
  {text: "爱祥99", speed: 0.85, yPos: 10, color: "#881144", delay: 0},  //ave mujica
  {text: "爱祥99", speed: 0.8, yPos: 20, color: "#3388BB", delay: 0.9}, //mygo
  {text: "哦不，推推的开", speed: 0.4, yPos: 20, color: "#FF8899", delay: 0.8},  //anon
  {text: "哦耶，爱爱的祥", speed: 0.75, yPos: 20, color: "#77DD77", delay: 0.7},  //raana
  {text: "呃啊感性感性", speed: 0.8, yPos: 20, color: "#FFDD88", delay: 0.6},  //soyo
  {text: "呃啊本能本能", speed: 0.6, yPos: 20, color: "#7777AA", delay: 0.5},  //taki
  {text: "呃啊理性理性", speed: 0.5, yPos: 20, color: "#77BBDD", delay: 0.4},  //tomori
  {text: "没有算了", speed: 1, yPos: 20, color: "#7799CC", delay: 0.2},  //saki
  {text: "真的唉", speed: 0.2, yPos: 20, color: "#BB9955", delay: 0.1},  //uika
  {text: "汉墓封土", speed: 0.5, yPos: 20, color: "#779977", delay: 2.0},  //mutsumi
  {text: "祥祥？什么时候？", speed: 0.5, yPos: 20, color: "#335566", delay: 2.0}, //umiri
  {text: "爱祥，你在哪里", speed: 0.5, yPos: 20, color: "#AA4477", delay: 2.0}, //umiri
  {text: "place holder", speed: 0.5, yPos: 20, color: "#FFFF66", delay: 2.0}, //sumimi tentitive.
  
]


function Danmaku({danmaku, timelinesRef, index}){
  const ref = useRef(null);
  const [style] = useState(()=>({
      "--color": danmaku.color,
      "--top":`${Math.random() > 0.5? Math.random() * 30 + 60 : Math.random() * 30 + 10}vh`,
      "--size":`${Math.random() + 1}rem`
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
      x: -window.innerWidth - 300*(1+DANMAKU[index].delay),
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
        // markers: true,
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
    <div className='page character-page'>
      <div className='character-page-background'></div>
      <div className='character-curtain curtain'></div>
      <L2dCanvas character={character} offsetBottom={offsetBottom} width={600} height={800}/> 
      <section className='character-section saki-section'>
        <div className='dialog-box saki-border'>
          <h1>Togawa Sakiko</h1>
          <p>羽丘学院1年b班</p>
          <p>
            Ave Mujica键盘手
          </p>
            <ToolTips displayText={"炽天使31O部队队长"} 
              link={"https://ngabbs.com/read.php?tid=41989465"}
              content={"丰川祥子、为了人类的未来而战……真的能战吗？"}
              />
            {/* <ToolTips displayText={"霍格沃茨魔法学校，拉文克劳学院学生"} 
              content={"迷子和人偶们在破坏霍格沃茨的世界观。"} 
              link={"https://ngabbs.com/read.php?tid=40811445"}
              /> */}
            <ToolTips displayText={"千早家的猫"} 
              content={"领养的蓝色猫咪有点怪?!"} 
              link={"https://sakikoblivionis.lofter.com/post/8a3fd737_2bf77668e"}
              style = "spoiler"
              />
        </div>
      </section>

      <div className='animation-container' style={{height: `${ANIMAION_DURATION}px`}}>
        <DanmakuContainer />
        <canvas
          ref={canvasRef}
          className='animation-canvas hidden'
          />


        {/* <div className="card" style={{position:"relative",zIndex:2}}>
          <div style={{height: `${ANIMAION_DURATION}px`}}>
          </div>
        </div> */}
        
      </div>

      <section className='character-section anon-section'>
        <div className='dialog-box anon-border'>
          <h1>Chihaya Anon</h1>
          <p>羽丘学院1年a班</p>
          <p>
            Mygo 吉他手
          </p>
            {/* <ToolTips displayText={"炽天使30A部队队长"} 
              link={"https://ngabbs.com/read.php?tid=41989465"}
              content={"丰川祥子、为了人类的未来而战……真的能战吗？"}
              /> */}
            <ToolTips displayText={"霍格沃茨魔法学校，拉文克劳学院学生"} 
              content={"迷子和人偶们在破坏霍格沃茨的世界观。"} 
              link={"https://ngabbs.com/read.php?tid=40811445"}
              />
            <ToolTips displayText={"AnonTokyo Auto Repair店长"} 
              content={"修车粉毛"} 
              link={"https://www.bilibili.com/video/BV1D13qziEgG"}
              style = "spoiler"
              />
        </div>
      <button id='explore-button' onClick={()=>navigateTo("/relays")}>探索接力</button>
      </section>

      <ScrollIndicator />
    </div>
  )
}

export default CharacterPage

