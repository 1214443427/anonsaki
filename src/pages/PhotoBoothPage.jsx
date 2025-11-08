import React, { useState } from 'react'
import L2dCanvas from '../components/L2dCanvas'

function PhotoBoothPage() {
    const [character, setCharacter] = useState("anon")
    const [pausedCharacter, setPausedCharacter] = useState([])


    function toggleCharacter(character){
        if(pausedCharacter.includes(character)){
            setPausedCharacter(prev=>prev.filter(x=>x!=character))
        }
        else{
            setPausedCharacter([...pausedCharacter, character])
        }
    }

    return (
        <div>
            <button onClick={()=>setCharacter("both")}>render</button>
            <L2dCanvas character={character} width={600} height={600} pausedCharacter={pausedCharacter}/>
        </div>
    )
    }

export default PhotoBoothPage