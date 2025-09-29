import { useEffect, useRef, useState } from 'react'
import './App.css'
import LandingPage from './pages/LandingPage'
import CharacterPage from './pages/CharacterPage'
import MenuBar from './components/MenuBar';
import RelayPage from './pages/RelayPage';
import RelayDetailsPage from './pages/RelayDetailsPage';
import InvitationPage from './pages/InvitationPage';

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

  const [currentRoute, setCurrentRoute] = useState('landing');
  const [currentRelayId, setCurrentRelayId] = useState(null); //to be implemented as record.
  const [touching, setTouching] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  //Example: navigateTo('/character')
  const navigateTo = (path) => {
    window.location.hash = path; 
  };

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
      addEventListener('hashchange', handleRouteChange)
      return ()=>{removeEventListener('hashchange', handleRouteChange);}
  },[])


  return (
    <div onClick={()=>setIsMenuOpen(false)}>
      <MenuBar navigateTo={navigateTo} isOpen={isMenuOpen} setIsOpen={setIsMenuOpen}/>
      {(()=>{ 
        switch(currentRoute){
        case 'landing':
          return <LandingPage navigateTo={navigateTo}/>;
        case 'character':
          return <CharacterPage navigateTo={navigateTo}/> 
        case 'relays':
          if(currentRelayId == null)
            return <RelayPage navigateTo={navigateTo}/>
          else
            return <RelayDetailsPage filename={decodeURI(currentRelayId)}></RelayDetailsPage>
        case "invitation":
            return <InvitationPage />
        }
      })()}
    </div>
  )
}

export default App
