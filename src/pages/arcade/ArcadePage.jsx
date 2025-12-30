import React, { useEffect, useReducer, useState } from 'react'

function reducer(state, action){
    switch(action.type){
        case 'TICK': {
            console.log("Trigger calculation function")
            return {
                ...state
            }
        }

        case 'START_BATTLE':
            return {...state, phase: "battle"};
        case 'END_BATTLE':
            return {...state, phase: 'results'}

        default: 
            return state;
    }
}

const initalState = {
    phase:"shopping",
    team: [],
    shop: []
}

const CARDS = [
    { emoji: '🍬', name: 'Anon',  baseAttack: 2, baseHealth: 2, cost: 3, 
        description: '粉色章鱼' ,
        imageUrl: "",
        ability:{},
        display_name:"",
        color:"#FF8899"
    },
    { emoji: '🐙', name: 'Saki',  baseAttack: 1, baseHealth: 2, cost: 3, 
        description: '蓝色章鱼' ,
        imageUrl: "",
        ability:{},
        display_name:"",
        color:"#7799CC"
    },
    { emoji: '🦊', name: 'Soyo',  baseAttack: 1, baseHealth: 3, cost: 3, 
        description: '生活在月之森的狐狸。' ,
        imageUrl: "",
        ability:{},
        display_name:"",
        color:"#FFDD88"
    },
    { emoji: '🐧', name: 'Tomori',baseAttack: 3, baseHealth: 1, cost: 3, 
        description: '喜欢收集石头的小企鹅。' ,
        imageUrl: "",
        ability:{},
        display_name:"",
        color:"#77BBDD"
    },
    { emoji: '🐼', name: 'Taki',  baseAttack: 3, baseHealth: 2, cost: 3, 
        description: '有颗泪痣的大熊猫。' ,
        imageUrl: "",
        ability:{},
        display_name:"",
        color:"#7777AA"
    },
    { emoji: '🐱', name: 'Raana', baseAttack: 2, baseHealth: 3, cost: 3, 
        description: '自由自在的猫咪。' ,
        imageUrl: "",
        ability:{},
        display_name:"",
        color:"#77DD77"
    },
    { emoji: '🐕', name: 'Uika',  baseAttack: 3, baseHealth: 3, cost: 3, 
        description: '戴着鸭舌帽的大狗狗。' ,
        imageUrl: "",
        ability:{},
        display_name:"",
        color:"#BB9955"
    },
    { emoji: '🐺', name: 'Umiri', baseAttack: 1, baseHealth: 2, cost: 3, 
        description: '想要获取信任的狼。' ,
        imageUrl: "",
        ability:{},
        display_name:"",
        color:"#335566"
    },
    { emoji: '🥒', name: 'Mutsu', baseAttack: 1, baseHealth: 2, cost: 3, 
        description: '不喜欢说话的黄瓜精灵。' ,
        imageUrl: "",
        ability:{},
        display_name:"",
        color:"#779977"
    },
    { emoji: '🐈‍⬛', name: 'Nyamu', baseAttack: 3, baseHealth: 2, cost: 3, 
        description: '毛发保养良好的紫色的猫猫。' ,
        imageUrl: "",
        ability:{},
        display_name:"",
        color:"#AA4477"
    },
    { emoji: '🍩', name: 'Mana',  baseAttack: 3, baseHealth: 2, cost: 3, 
        description: '甜甜圈' ,
        imageUrl: "",
        ability:{},
        display_name:"",
        color:"#6c5e53"
    },
]

function ArcadePage() {

    const [state, dispatch] = useReducer(reducer, initalState)

    useEffect(()=>{

    })

    return (
        <div>
            <button onClick={()=>{dispatch({type: "TICK"})}}></button>
        </div>
    )
}

export default ArcadePage