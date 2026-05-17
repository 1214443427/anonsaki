import React from 'react'
import Spinner from '../components/Spinner'
import "./LoadingPage.css"

function LoadingPage({from}) {
  let color;
  switch(from){
    case("challenge"):
      color = "rgb(var(--saki-color-alpha))";
      break;
    case("relays"):
      color = "rgba(var(--combined-color), 0.5)"
      break;
    case("photo-booth"):
      color = "rgb(var(--anon-color-alpha))"
      break;
  }
  return (
    <div className={`page loading-page`} style={{"--bg-color": color}}>
        <Spinner />
    </div>
  )
}

export default LoadingPage