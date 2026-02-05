import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap/gsap-core';
import React, { use, useEffect, useReducer, useRef, useState } from 'react'
import "./ArcadePage.css"
import BulletElement from '../../components/BulletElement';

const CARDS = [
    { emoji: '🍬', name: 'Anon',  baseAttack: 1, baseHealth: 6, cost: 3, 
      description: '粉色章鱼' ,
      imageUrl: "/assets/game-assets/Anon.webp",
      ability:{},
      display_name:"",
      color:"#FF8899"
    },
    { emoji: '🐙', name: 'Saki',  baseAttack: 2, baseHealth: 3, cost: 3, 
      description: '蓝色章鱼' ,
      imageUrl: "/assets/game-assets/Saki.webp",
      ability:{},
      display_name:"",
      color:"#7799CC"
    },
    { emoji: '🦊', name: 'Soyo',  baseAttack: 3, baseHealth: 2, cost: 3, 
      description: '生活在月之森的狐狸。' ,
      imageUrl: "/assets/game-assets/Fox.webp",
      ability:{},
      display_name:"",
      color:"#FFDD88"
    },
    { emoji: '🐧', name: 'Tomori',baseAttack: 3, baseHealth: 1, cost: 3, 
      description: '喜欢收集石头的小企鹅' ,
      imageUrl: "/assets/game-assets/Penguin.webp",
      ability:{},
      display_name:"",
      color:"#77BBDD"
    },
    { emoji: '🐼', name: 'Taki',  baseAttack: 2, baseHealth: 4, cost: 3, 
      description: '有颗泪痣的大熊猫。' ,
      imageUrl: "/assets/game-assets/Panda.webp",
      ability:{},
      display_name:"",
      color:"#7777AA"
    },
    { emoji: '🐱', name: 'Raana', baseAttack: 2, baseHealth: 3, cost: 3, 
      description: '自由自在的猫咪。' ,
      imageUrl: "/assets/game-assets/Raana.webp",
      ability:{},
      display_name:"",
      color:"#77DD77"
    },
    { emoji: '🐕', name: 'Uika',  baseAttack: 3, baseHealth: 3, cost: 3, 
      description: '戴着鸭舌帽的大狗狗。' ,
      imageUrl: "/assets/game-assets/Puppy.webp",
      ability:{},
      display_name:"",
      color:"#BB9955"
    },
    { emoji: '🐺', name: 'Umiri', baseAttack: 4, baseHealth: 2, cost: 3, 
      description: '想要获取信任的狼。' ,
      imageUrl: "/assets/game-assets/Wolf.webp",
      ability:{},
      display_name:"",
      color:"#335566"
    },
    { emoji: '🥒', name: 'Mutsu', baseAttack: 6, baseHealth: 1, cost: 3, 
      description: '不喜欢说话的黄瓜精灵。' ,
      imageUrl: "/assets/game-assets/Cucumber.webp",
      ability:{},
      display_name:"",
      color:"#779977"
    },
    { emoji: '🐈‍⬛', name: 'Nyamu', baseAttack: 3, baseHealth: 2, cost: 3, 
      description: '毛发保养良好的紫色的猫猫。' ,
      imageUrl: "/assets/game-assets/Nyamu.webp",
      ability:{},
      display_name:"",
      color:"#AA4477"
    },
    { emoji: '🍩', name: 'Mana',  baseAttack: 2, baseHealth: 3, cost: 3, 
      description: '甜甜圈' ,
      imageUrl: "/assets/game-assets/Donut.webp",
      ability:{},
      display_name:"",
      color:"#6c5e53"
    },
]

const ENEMY_TEMPLATE = [
  {
    emoji: "🍩",
    name: "donut",
    baseAttack: 3,
    baseHealth: 2,
    imageUrl: "",
    description: "一个高脂肪的甜甜圈",
    ability: {},
    display_name: "甜甜圈",
    color: "red"
  },
  {
    emoji: "🍪",
    name: "cookie",
    baseAttack: 2,
    baseHealth: 3,
    imageUrl: "",
    description: "一块香脆的巧克力饼干",
    ability: {},
    display_name: "饼干",
    color: "red"
  },
  {
    emoji: "🍫",
    name: "chocolate_bar",
    baseAttack: 4,
    baseHealth: 2,
    imageUrl: "",
    description: "一块浓郁的巧克力",
    ability: {},
    display_name: "巧克力",
    color: "red"
  },
  {
    emoji: "🍰",
    name: "cake_slice",
    baseAttack: 3,
    baseHealth: 4,
    imageUrl: "",
    description: "一片松软的蛋糕",
    ability: {},
    display_name: "蛋糕",
    color: "red"
  },
  {
    emoji: "🧁",
    name: "cupcake",
    baseAttack: 2,
    baseHealth: 2,
    imageUrl: "",
    description: "一个可爱的纸杯蛋糕",
    ability: {},
    display_name: "纸杯蛋糕",
    color: "red"
  },
  {
    emoji: "🍦",
    name: "ice_cream_cone",
    baseAttack: 2,
    baseHealth: 3,
    imageUrl: "",
    description: "一个融化的冰淇淋甜筒",
    ability: {},
    display_name: "冰淇淋甜筒",
    color: "red"
  },
  {
    emoji: "🍓",
    name: "strawberry",
    baseAttack: 1,
    baseHealth: 2,
    imageUrl: "",
    description: "一个新鲜的草莓",
    ability: {},
    display_name: "草莓",
    color: "red"
  },
  {
    emoji: "🍒",
    name: "cherries",
    baseAttack: 2,
    baseHealth: 1,
    imageUrl: "",
    description: "一对甜美的樱桃",
    ability: {},
    display_name: "樱桃",
    color: "red"
  },
  {
    emoji: "🍑",
    name: "peach",
    baseAttack: 2,
    baseHealth: 2,
    imageUrl: "",
    description: "一颗多汁的桃子",
    ability: {},
    display_name: "桃子",
    color: "red"
  },
  {
    emoji: "🍭",
    name: "lollipop",
    baseAttack: 1,
    baseHealth: 3,
    imageUrl: "",
    description: "一颗彩色的棒棒糖",
    ability: {},
    display_name: "棒棒糖",
    color: "red"
  },
  {
    emoji: "🍿",
    name: "popcorn",
    baseAttack: 3,
    baseHealth: 3,
    imageUrl: "",
    description: "加了黄油的爆米花",
    ability: {},
    display_name: "爆米花",
    color: "red"
  },
  {
    emoji: "🍘",
    name: "Senbei",
    baseAttack: 3,
    baseHealth: 3,
    imageUrl: "",
    description: "带海苔的仙贝",
    ability: {},
    display_name: "仙贝",
    color: "red"
  },
  {
    emoji: "🍖",
    name: "drumstick",
    baseAttack: 4,
    baseHealth: 4,
    imageUrl: "",
    description: "一根香喷喷的鸡腿",
    ability: {},
    display_name: "鸡腿",
    color: "red"
  },
  {
    emoji: "🍕",
    name: "pizza_slice",
    baseAttack: 3,
    baseHealth: 3,
    imageUrl: "",
    description: "一片热腾腾的披萨",
    ability: {},
    display_name: "披萨",
    color: "red"
  },
  {
    emoji: "🌭",
    name: "hot_dog",
    baseAttack: 2,
    baseHealth: 3,
    imageUrl: "",
    description: "一个美味的热狗",
    ability: {},
    display_name: "热狗",
    color: "red"
  },
  {
    emoji: "🍟",
    name: "french_fries",
    baseAttack: 2,
    baseHealth: 2,
    imageUrl: "",
    description: "一份炸薯条",
    ability: {},
    display_name: "薯条",
    color: "red"
  },
  {
    emoji: "🍔",
    name: "burger",
    baseAttack: 4,
    baseHealth: 4,
    imageUrl: "",
    description: "一个多层汉堡",
    ability: {},
    display_name: "汉堡",
    color: "red"
  },
  {
    emoji: "🌶️",
    name: "chili_pepper",
    baseAttack: 5,
    baseHealth: 2,
    imageUrl: "",
    description: "一个辣味十足的辣椒",
    ability: {},
    display_name: "辣椒",
    color: "red"
  },
  {
    emoji: "🍉",
    name: "watermelon_slice",
    baseAttack: 2,
    baseHealth: 4,
    imageUrl: "",
    description: "一片多汁的西瓜",
    ability: {},
    display_name: "西瓜",
    color: "red"
  }
];

const BOSS_ENEMY_TEMPLATE = [
    {
        emoji: "🦄",
        name: "unicorn",
        baseAttack: 1,
        baseHealth: 2,
        imageUrl: "",
        description: "一只阴湿的独角兽",
        ability: {},
        display_name: "独角兽",
        color: "purple"
    },
    {
        emoji: "🍅",
        name: "tomato",
        baseAttack: 1,
        baseHealth: 2,
        imageUrl: "",
        description: "一颗腐烂的西红柿",
        ability: {},
        display_name: "柿本",
        color: "brown"
    },
]

const ITEMS = [
  {
    emoji: "☕",
    name: "咖啡",
    healthModifier: 1,
    attackModifier: 1,
    expModifier: 0,
    duration: 100,
    description: "",
    imageUrl: "",
  },
  {
    emoji: "🍫",
    name: "能量棒",
    healthModifier: 0,
    attackModifier: 5,
    expModifier: 0,
    duration: 1,
    description: "",
    imageUrl: "",
  },
  {
    emoji: "🛡️",
    name: "钢板",
    healthModifier: 3,
    attackModifier: 0,
    expModifier: 0,
    duration: 100,
    description: "",
    imageUrl: "",
  },
  {
    emoji: "🎹",
    name: "键盘",
    healthModifier: 0,
    attackModifier: 3,
    expModifier: 0,
    duration: 100,
    description: "众所周知，琴声能无视护甲。",
    imageUrl: "",
  },
  {
    emoji: "📓",
    name: "笔记本",
    healthModifier: 3,
    attackModifier: 3,
    expModifier: 0,
    duration: 1,
    description: "写满了振奋人心的歌词",
    imageUrl: "",
  },
  {
    emoji: "🍦",
    name: "抹茶巴菲",
    healthModifier: 0,
    attackModifier: 0,
    expModifier: 1,
    duration: 100,
    description: "",
    imageUrl: "",
  }
]

const PHASE = {
  shopping: "shopping",
  battle: "battle",
  results: "results",
}

const UNIT_COST = 3

function startRound(state){
    const currentLevel = state.level
    const enemyCount = gsap.utils.clamp(1, 5, currentLevel)
    const enemies = []
    for (let i = 0; i < enemyCount; i++) {
      const randomEnemy = gsap.utils.random(ENEMY_TEMPLATE)
      enemies.push({
        ...randomEnemy,
        maxAttack: randomEnemy.baseAttack + currentLevel * 2,
        maxHealth: randomEnemy.baseHealth + currentLevel * 2,
        currentAttack: randomEnemy.baseAttack + currentLevel * 2,
        currentHealth: randomEnemy.baseHealth + currentLevel * 2,
      })
    }
    return {
      ...state,
      phase: PHASE.battle,
      enemies: enemies
    }
}

function generateShop(state){
  if(state.shop.locked) return state;
  const currentLevel = state.level
  const unit = []
  for (let i = 0; i < 3; i++) {
    const randomUnit = gsap.utils.random(CARDS)
    unit.push({key: state.shop.nextKey, ...randomUnit})
  }
  const randomItem = gsap.utils.random(ITEMS)
  return {
    ...state,
    shop: {
      nextKey: state.shop.nextKey + 1,
      locked: false,
      units: unit,
      items: [randomItem],
    }
  }
}

function purchaseUnit(state, position){
  const shopUnitsArray = state.shop.units;
  const playerUnitsArray = state.team.board;
  const unitToPurchase = shopUnitsArray[position];
  if(unitToPurchase.name === "empty"){
    return state
  }
  const newShopUnits = shopUnitsArray.toSpliced(position, 1, {
    name: "empty",
  });
  const existingUnitIndex = playerUnitsArray.findIndex((x)=> x.name == unitToPurchase.name);
  let newPlayerUnitArray = playerUnitsArray
  const events = [];
  if (existingUnitIndex !== -1){
    const existingUnit = playerUnitsArray[existingUnitIndex]
    console.log(existingUnitIndex, existingUnit)
    let newXp = existingUnit.xp + 1;
    if(newXp>= Math.pow(2, existingUnit.level)){
      newPlayerUnitArray = playerUnitsArray.toSpliced(existingUnitIndex, 1)
                                      .toSpliced(existingUnitIndex, 0, {
                                        ...existingUnit,
                                        xp: 0,
                                        level: existingUnit.level +1,
                                        currentAttack: existingUnit.currentAttack + existingUnit.baseAttack * Math.pow(2, existingUnit.level - 1) ,
                                        currentHealth: existingUnit.currentHealth + existingUnit.baseHealth * Math.pow(2, existingUnit.level - 1),
                                      })
      events.push({name: existingUnit.name, type: "level-up"})
      }else{
        newPlayerUnitArray = playerUnitsArray.toSpliced(existingUnitIndex, 1)
        .toSpliced(existingUnitIndex, 0, {
          ...existingUnit,
          xp: newXp,
        })
      }
    }else{
    const emptySlot = playerUnitsArray.findIndex((x)=>x.name=="empty")
    if(emptySlot === -1){
      return state
    }
    newPlayerUnitArray = playerUnitsArray.toSpliced(emptySlot, 1, {
      ...unitToPurchase,
      xp: 0,
      level: 1,
      currentAttack: unitToPurchase.baseAttack,
      currentHealth: unitToPurchase.baseHealth
    })
  }
  return({
    ...state,
    shop: {
      ...state.shop,
      units: newShopUnits
    },
    team: {
      ...state.team,
      board: newPlayerUnitArray 
    },
    economy: {
      start: state.economy.star - unitToPurchase.cost
    }
  })
}

function reducer(state, action){
    switch(action.type){
      case 'START_GAME': 
        const initialShop = generateShop(state);
        return {...initialState, ...initialShop};
      case 'TICK': {
        if (state.phase != PHASE.battle) return state
        if (state.combat.animating) return state
        console.log("Trigger calculation function", state)
        return {
            ...state
        }
      }
      case 'START_BATTLE':{
        const newState = startRound(state)
        return {...newState, phase: PHASE.battle};
      }
      case 'END_BATTLE':
        return {...state, phase: PHASE.results}        
      case 'START_SHOP':{
        const newState = generateShop(state);
        return {...newState, phase: PHASE.shopping}
      }
      case 'PURCHASE_UNIT':{
        console.log("purchasing", action.position)
        const newState = purchaseUnit(state, action.position);
        return {...newState}
      }

      default: 
        return state;
    }
}

const initialState = {
    phase: PHASE.shopping,
    level: 1,
    economy: {
        star: 10,
    },
    team: {
        board: [
          {...CARDS[0],
            xp: 0,
            level: 1,
            currentAttack: CARDS[0].baseAttack,
            currentHealth: CARDS[0].baseHealth
          }, //default card 1
          {...CARDS[1],
            xp: 0,
            level: 1,
            currentAttack: CARDS[1].baseAttack,
            currentHealth: CARDS[1].baseHealth
          }, //default card 2
          ...Array.from({ length: 3 }, () => ({
          name: "empty",
          level: 0,
          xp: 0,
        }))],
        bench: Array.from({ length: 5 }, () => ({
          name: "empty",
          level: 0,
          xp: 0,
        })),
        events: [],
    },
    shop: {
        locked: false,
        nextKey: 0,
        units:Array.from({ length: 3 }, () => ({
          name: "empty",
          level: 0,
          xp: 0,
        })),
        items:[{
          name: "empty",
        }],
    },
    enemies: [],
    combat: {
        tick: 0,
        animating: false,
        events: [],
        outcome: "",
    }
}

function ParticleElement({elements}){
  const ref = useRef(null)
  useGSAP(()=>{
    gsap.fromTo(ref.current, {
      top: "100%"
    },{
      top: "0%",
      xPercent: gsap.utils.random(-100, 100),
      duration: 1, 
    })
  }, [])
  return(
    <div className='particle' ref={ref}>
      {gsap.utils.random(elements)}
    </div>
  )
}

function Unit({unit, mode}){
  const unitRef = useRef(null)
  const [displayLevel, setDisplayLevel] = useState(1) 
  const [displayXp, setDisplayXp] = useState(0) 
  const level = unit.level

  useGSAP(()=>{
    if(level > 1){
      setDisplayXp(Math.pow(2, level))
      gsap.timeline().to(".unit-image", {
        rotateY: "+=360",
        duration: 1,
        filter: "drop-shadow(0px 0px 20px rgba(255,245,46,0.9))",
        ease: "power2.inOut",
        onComplete: ()=>{
          setDisplayLevel(prev=>prev+1);
          setDisplayXp(0)
        }
      }).to(".unit-image", {
        filter: "drop-shadow(0px 0px 10px rgba(196, 196, 195, 0.9))",
        duration: 0.5,
        ease: "power2.inOut",
      })
    }
  }, {scope: unitRef.current, dependencies: [level]})

  useEffect(()=>{
    if(unit.xp!=0){
      setDisplayXp(unit.xp)
    }    
  }, [unit.xp])


  if(unit.name == "empty"){
    return
  }

  return(
    <div className='unit-container flex flex-col' ref={unitRef}>
      {unit.level && <div className='levels-container'>
        <p className='levels-text' data-text={`Lv${displayLevel}`}>Lv
          <span className='levels-number'>{displayLevel}</span>
        </p>
        <div className='xp-progress-bar flex'>
          {Array.from({length: Math.pow(2, displayLevel)}).map((_, index)=>
            (
            <div 
              className={`xp-block ${index<displayXp?"filled":""}`} 
              style={displayXp>0?{transition: "background-position 0.5s ease-out"}:{}}
              key={index}>
            </div>)
          )}
        </div>
      </div>}
      <div className='unit-image-container'>
        {
          unit.imageUrl ? 
          <img 
          className='unit-image'
          src={unit.imageUrl} />:
          <p className='unit-image'>
            {unit.emoji}
          </p>
        }
      </div>
      <div className='flex'>
        <div className='attack-indicator'>
          <img src='/assets/game-assets/attack.webp'></img>
          <p id='attack-text'>{mode == "shop"? unit.baseAttack : unit.currentAttack}</p>
        </div>
        <div className='health-indicator'>
            <img src='/assets/game-assets/hp.webp'></img>
            <p id='hp-text'>{mode == "shop"? unit.baseHealth : unit.currentHealth}</p>
        </div>
      </div>
    </div>
  )
}

function ArcadePage() {

  const [state, dispatch] = useReducer(reducer, initialState)
  
  useEffect(()=>{
    dispatch({type: "START_GAME"})
  }, [])

  useGSAP(()=>{
    const phase = state.phase
    let intervalId;
    if(phase == PHASE.battle){
      gsap.to(".game-container", {duration: 2, scrollTo: {x: 1000}})
      intervalId = setInterval(()=>dispatch({type: "TICK"}), 2000)
    }
    if(phase == PHASE.shopping){
      clearInterval(intervalId)
      gsap.to(".game-container", {duration: 2, scrollTo: {x: 0}})
    }
    return ()=> clearInterval(intervalId)
  }, [state.phase])


  return (
    <div className='pages flex flex-col arcade-page'>
      <div className='game-container flex flex-col'>
        <div className='arcade-top-section flex'>   
          <div className='shop-section flex'>
            <div className='flex shop-section-lane'>
              <div className='unit-section flex'>
                {state.shop.units.map((unit, index)=>(
                  <div className='slot' key={index} onClick={()=>dispatch({type: "PURCHASE_UNIT", position: index})}>
                    <Unit unit={unit} mode={"shop"}/>
                  </div>
                ))}
              </div>
              <div className='item-section flex'>
                <div className='slot'>
                  {state.shop.items.length > 0 && 
                    <div>
                      {state.shop.items[0].name}
                    </div>
                    }
                </div>
              </div>
            </div>
          </div>
          <div className='enemy-section flex'>
            <div className='enemy-lane'>
              {state.phase == PHASE.battle && state.enemies.map((unit, index)=>(
                <div className='slot' key={index}>
                  <Unit unit={unit} mode={"enemy"}/>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='arcade-bottom-section'>
          <div className='team-section'>
            {state.team.board.map((unit, index)=>(
              <div className='slot' key={index}>
                <Unit unit={unit} mode={"team"}/>
              </div>
            ))}
          </div>
        </div>
        <div className='game-overlay'>
          <button onClick={()=>{dispatch({type: "TICK"})}}>tick</button>
          <button onClick={()=>{dispatch({type: "START_BATTLE"})}}>start battle</button>
          <button onClick={()=>{dispatch({type: "START_SHOP"})}}>start battle</button>
        </div>
      </div>
    </div>
  )
}

export default ArcadePage