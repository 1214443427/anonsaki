import { useEffect, useRef, useState } from 'react'
import './App.css'
import LandingPage from './pages/LandingPage'
import CharacterPage from './pages/CharacterPage'
import MenuBar from './components/MenuBar';
import RelayPage from './pages/RelayPage';
import RelayDetailsPage from './pages/RelayDetailsPage';
import InvitationPage from './pages/InvitationPage';
import PhotoBoothPage from './pages/PhotoBoothPage';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { prefetchContentAssets } from './utils/preFetchData';


gsap.registerPlugin(useGSAP);

function OctopusShowerElement({index, tl}){
  const source = index%2 == 0? "/assets/happy_saki_octo_matching.webp":"/assets/anon_octo.webp"
  const ref = useRef(null)
  const rotation = gsap.utils.random(-360,360)
  const delay = gsap.utils.random(0,50)
  const xOffset = gsap.utils.random(0,100)
  const speed = gsap.utils.random(1,1.5)
  useGSAP(()=>{
    if(ref.current == null|| tl == null) return
    tl.set(
      ref.current, {
        opacity: 1,
        left: `${xOffset}vw`,
        top: `-${delay}vh`
      },"<")
    .to(ref.current, 
      {
        y: "150vh",
        duration: ()=>5/speed,
        onComplete: ()=>{gsap.set(ref.current, {opacity: 0})},
        // delay: delay,
        rotate: rotation,
        ease: "none"
      },"<")
  }, [tl])
  return(
    <img className='octo-image non-select octo-shower-img' src={source} ref={ref}/>
  )
}

function App() {

  // function setL2DModel(name) {
  //   console.log(L2Dwidget)
  //   if (Object.keys(L2Dwidget.config).length) {
  //       L2Dwidget.config.model.jsonPath = `assets/l2d/${name}/model.json`;
  //       L2Dwidget.init();
  //   } else {
  //       L2Dwidget.init({
  //           model: {jsonPath: name?`assets/l2d/${name}/model.json`:'', scale: 1},
  //           display: {superSample: 2, width: 400, height: 800, position: 'left', hOffset: 70, vOffset: -70},
  //           mobile: {show: false},
  //           react: {opacityDefault: 1, opacityOnHover: 0.8},
  //           name: {div: ''},
  //           dialog: {enable: true}
  //         });
  //     }
  // }

  // setL2DModel("anon")
  
  // const [scriptLoading, setScriptLoading] = useState(false);
  // function loadScript(src) {
  //   return new Promise((resolve) => {
  //     const script = document.createElement("script");
  //     script.src = `/Cubeism2SDK/${src}.js`;
  //     script.onload = resolve;
  //     document.body.appendChild(script);
  //   });
  // }

  // async function loadAllScripts() {
  //   setScriptLoading(true)
  //   await  loadScript("lib/live2d.min")
  //   await  loadScript("framework/Live2DFramework")
  //   await  loadScript("live2d//utils/MatrixStack")
  //   await  loadScript("live2d//utils/getWegGLContext")
  //   await  loadScript("live2d//utils/ModelSettingJson")
  //   await  loadScript("live2d//PlatformManager")
  //   await  loadScript("live2d//LAppDefine")
  //   await  loadScript("live2d//LAppModel")
  //   await  loadScript("live2d/LAppLive2DManager")
  //   setScriptLoading(false)
  // }
  const NUM_OF_EASTEREGGS = 6;

  const [currentRoute, setCurrentRoute] = useState('landing');
  const [currentRelayId, setCurrentRelayId] = useState(null); //to be implemented as record.
  const [easterEgg, setEasterEgg] = useState([])
  const timelineRef = useRef(null)

  const {contextSafe} = useGSAP(()=>{
      timelineRef.current = gsap.timeline({paused: false, onComplete:()=>{setEasterEgg([]);timelineRef.current.revert()}})
    }
  )

  //Example: navigateTo('/character')
  const navigateTo = (path) => {
    window.location.hash = path; 
  };

  function collectEasterEgg(id){
    if (!easterEgg.includes(id)){
      // console.log("collecting", id)
      const collectedEasterEggs = [...easterEgg, id]
      if(collectedEasterEggs.length === NUM_OF_EASTEREGGS){
        
      }
      setEasterEgg(collectedEasterEggs)
    }
  }

  const octopusShower = Array.from({ length: 50 }).map((_, i)=>(<OctopusShowerElement key={i} index={i} tl={timelineRef.current}/>))
  const playOctopusShower = contextSafe(() => {timelineRef.current.play()})

  const parseRoute = () => {
    const hash = window.location.hash.slice(1);

    if(!hash || hash === "/"){
      return { route: 'landing', relayId: null};
    } else if (hash === '/character'){
      return { route: 'character', relayId: null};
    } else if (hash === '/relays'){
      return { route: 'relays', relayId: null}
    }else if (hash.startsWith('/relays/')){
      const relayId = hash.replace('/relays/', '');
      return {route: 'relays', relayId: relayId}
    }else if (hash === '/invitation'){
      return {route: 'invitation', relayId: null}
    }else if (hash === '/photo-booth'){
      return {route: 'photo-booth', relayId: null}
    }
    return {route: 'landing', relayId: null}
  }

  const handleRouteChange = () => {
    const { route, relayId } = parseRoute();
    setCurrentRoute(route);
    setCurrentRelayId(relayId);
  }

  useEffect(()=>{
      // loadAllScripts();
      handleRouteChange();
      prefetchContentAssets();
      addEventListener('hashchange', handleRouteChange)
      return ()=>{removeEventListener('hashchange', handleRouteChange);}
  },[])


  return (
    <div className='layout'>
      {easterEgg.length == NUM_OF_EASTEREGGS && octopusShower}
      <MenuBar navigateTo={navigateTo}/>
      {(()=>{ 
        switch(currentRoute){
        case 'landing':
          return <LandingPage navigateTo={navigateTo} collectEasterEgg={collectEasterEgg}/>;
        case 'character':
          return <CharacterPage navigateTo={navigateTo} collectEasterEgg={collectEasterEgg}/> 
        case 'relays':
          if(currentRelayId == null)
            return <RelayPage navigateTo={navigateTo} collectEasterEgg={collectEasterEgg}/>
          else
            return <RelayDetailsPage filename={decodeURI(currentRelayId)}></RelayDetailsPage>
        case "invitation":
            return <InvitationPage collectEasterEgg={collectEasterEgg}/>
        case "photo-booth":
            return <PhotoBoothPage />
        }
      })()}
    </div>
  )
}

export default App
