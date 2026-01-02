import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap/gsap-core';
import React, { useEffect, useReducer, useState } from 'react'
import "./ArcadePage.css"

const CARDS = [
    { emoji: '🍬', name: 'Anon',  baseAttack: 1, baseHealth: 6, cost: 3, 
      description: '粉色章鱼' ,
      imageUrl: "",
      ability:{},
      display_name:"",
      color:"#FF8899"
    },
    { emoji: '🐙', name: 'Saki',  baseAttack: 2, baseHealth: 3, cost: 3, 
      description: '蓝色章鱼' ,
      imageUrl: "",
      ability:{},
      display_name:"",
      color:"#7799CC"
    },
    { emoji: '🦊', name: 'Soyo',  baseAttack: 3, baseHealth: 2, cost: 3, 
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
    { emoji: '🐼', name: 'Taki',  baseAttack: 2, baseHealth: 4, cost: 3, 
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
    { emoji: '🐺', name: 'Umiri', baseAttack: 4, baseHealth: 2, cost: 3, 
      description: '想要获取信任的狼。' ,
      imageUrl: "",
      ability:{},
      display_name:"",
      color:"#335566"
    },
    { emoji: '🥒', name: 'Mutsu', baseAttack: 6, baseHealth: 1, cost: 3, 
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
    { emoji: '🍩', name: 'Mana',  baseAttack: 2, baseHealth: 3, cost: 3, 
      description: '甜甜圈' ,
      imageUrl: "",
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
      enemies: enemies
    }
}

function generateShop(state){
  if(state.shop.locked) return state;
  const currentLevel = state.level
  const unit = []
  for (let i = 0; i < 3; i++) {
    const randomUnit = gsap.utils.random(CARDS)
    unit.push(randomUnit)
  }
  const randomItem = gsap.utils.random(ITEMS)
  return {
    ...state,
    shop: {
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
  const newShopUnits = shopUnitsArray.toSpliced(position, 1);
  const existingUnitIndex = playerUnitsArray.find((x)=> x.name == unitToPurchase.name);
  let newPlayerUnitArray = playerUnitsArray
  if (existingUnitIndex){
    const existingUnit = playerUnitsArray[existingUnitIndex]
    newPlayerUnitArray = playerUnitsArray.toSpliced(existingUnitIndex, 1)
                                          .toSpliced(existingUnitIndex, 0, {
                                            ...existingUnit,
                                            xp: existingUnit.xp + 1
                                          })
  }else{
    newPlayerUnitArray = playerUnitsArray.concat(unitToPurchase)
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
    }
  })
}

function reducer(state, action){
    switch(action.type){
      case 'START_GAME': 
        // const newState = 
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
        board: Array.from({ length: 5 }, () => ({
          name: "empty",
          level: 0,
          xp: 0,
        })),
        bench: Array.from({ length: 5 }, () => ({
          name: "empty",
          level: 0,
          xp: 0,
        })),
    },
    shop: {
        locked: false,
        units:[],
        items:[],
    },
    enemies: [],
    combat: {
        tick: 0,
        animating: false,
        events: [],
        outcome: "",
    }
}

function Unit({unit}){

  console.log(unit, unit.name == "empty")

  if(unit.name == "empty"){
    return
  }

  return(
    <div className='unit-container'>
      <div className='levels-container'>{unit.level}</div>
      {unit.emoji}
      <div className='flex'>
        <div className='attack-indicator'>{unit.currentAttack}</div>
        <div className='health-indicator'>{unit.currentHealth}</div>
      </div>
    </div>
  )
}

function ArcadePage() {

  const [state, dispatch] = useReducer(reducer, initialState)

  // useGSAP(()=>{
  //     //render animation. 
  // }, [state.combat.events])

  return (
    <div className='pages flex flex-col arcade-page'>
      <div className='game-container flex flex-col'>
        <div className='arcade-top-section flex'>   
          <div className='shop-section'>
            <div className='unit-section'>
              {state.shop.units.map((unit, index)=>(
                <div className='slot' key={index}>
                  <Unit unit={unit}/>
                </div>
              ))}
            </div>
            <div className='item-section'>
              <div className='slot'>
                {state.shop.items.length > 0 && 
                  <div>
                    {state.shop.items[0].name}
                  </div>
                  }
              </div>
            </div>
          </div>
          <div className='enemy-section'>
            {state.phase == PHASE.battle && state.enemies.map((unit, index)=>(
              <div className='slot'>
                <Unit unit={unit}/>
              </div>
            ))}
          </div>
        </div>
        <div className='arcade-bottom-section'>
          <div className='team-section'>
            {state.team.board.map((unit, index)=>(
              <div className='slot' key={index}>
                <Unit unit={unit}/>
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