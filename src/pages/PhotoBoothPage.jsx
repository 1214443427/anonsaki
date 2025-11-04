import React, { useState } from 'react'
import L2dCanvas from '../components/L2dCanvas'

function PhotoBoothPage() {
    const [character, setCharacter] = useState("anon")
    return (
        <div>
            <button onClick={()=>setCharacter("both")}>render</button>
            <L2dCanvas character={character} width={600} height={600}/>
        </div>
    )
    }

export default PhotoBoothPage