import React, { useEffect, useRef, useState } from 'react'
import L2dCanvas from '../components/L2dCanvas'
import "./PhotoBoothPage.css"
import { useGSAP } from '@gsap/react';
import gsap from 'gsap/gsap-core';
import Spinner from "../components/Spinner"
import { createPortal } from 'react-dom';
import PopUpModal from '../components/PopUpModal';
import { isInt } from '../utils/util';
import Toast from '../components/Toast';
import useError from '../hooks/useError';
import { snapdom } from '@zumer/snapdom';

const INITIALL2DCONFIGS = 
[
    {
        paused: false,  
        faceDirectionX:0,
        faceDirectionY:0,
        motion: "idle01",
        expression: "default",
        motionPlayback: 0,
        positionX: -1.35,
        positionY: 1.15,
    },
    {
        paused: false,  
        faceDirectionX:0, 
        faceDirectionY:0,
        motion: "idle01",
        expression: "default",
        motionPlayback: 0,
        positionX: -0.65,
        positionY: 1.15,
    }
]

const MODEL_PATHS = {
    both: {
        display_name: "情侣服",
        imgUrl: "/assets/photobooth-assets/clothes/matching-outfit.webp",
        models: [
            "/assets/l2d/saki/data-matching-outfit/sakiko_school_winter-2023.moc",
            "/assets/l2d/anon/data-matching-outfit/anon_school_winter-2023.moc"
        ],
        textures: [
            "/assets/l2d/anon/data-matching-outfit/textures/texture_00.png",
            "/assets/l2d/anon/data-matching-outfit/textures/texture_01.png",
            "/assets/l2d/saki/data-matching-outfit/textures/texture_00_winter.png",
            "/assets/l2d/saki/data-matching-outfit/textures/texture_01_winter.png"
        ]
    },
    normalBoth: {
        display_name: "常服",
        imgUrl: "/assets/photobooth-assets/clothes/casual.webp",
        models: [
            "/assets/l2d/saki/data/model.moc",
            "/assets/l2d/anon/data/model.moc"
        ],
        textures: [
            "/assets/l2d/anon/data/textures/texture_00_winter.png",
            "/assets/l2d/anon/data/textures/texture_01_winter.png",
            "/assets/l2d/saki/data/textures/texture_00_winter.png",
            "/assets/l2d/saki/data/textures/texture_01_winter.png"
        ]
    },
    schoolSummer: {
        display_name: "夏季校服",
        imgUrl: "/assets/photobooth-assets/clothes/summer.webp",
        models: [
            "/assets/l2d/saki/data-summer/model.moc",
            "/assets/l2d/anon/data-summer/model.moc"
        ],
        textures: [
            "/assets/l2d/anon/data-summer/textures/texture_00_winter.png",
            "/assets/l2d/anon/data-summer/textures/texture_01_winter.png",
            "/assets/l2d/saki/data-summer/textures/texture_00_winter.png",
            "/assets/l2d/saki/data-summer/textures/texture_01_winter.png"
        ]
    },
    schoolWinter: {
        display_name: "冬季校服",
        imgUrl: "/assets/photobooth-assets/clothes/winter.webp",
        models: [
            "/assets/l2d/saki/data-winter/model.moc",
            "/assets/l2d/anon/data-winter/model.moc"
        ],
        textures: [
            "/assets/l2d/anon/data-winter/textures/texture_00_winter.png",
            "/assets/l2d/anon/data-winter/textures/texture_01_winter.png",
            "/assets/l2d/saki/data-winter/textures/texture_00_winter.png",
            "/assets/l2d/saki/data-winter/textures/texture_01_winter.png"
        ]
    },
    mujica: {
        display_name: "演出服",
        imgUrl: "/assets/photobooth-assets/clothes/mujica.webp",
        models: [
            "/assets/l2d/saki/data-mujica/model.moc",
            "/assets/l2d/anon/data-mujica/model.moc"
        ],
        textures: [
            "/assets/l2d/anon/data-mujica/textures/texture_00_winter.png",
            "/assets/l2d/anon/data-mujica/textures/texture_01_winter.png",
            "/assets/l2d/saki/data-mujica/textures/texture_00_winter.png",
            "/assets/l2d/saki/data-mujica/textures/texture_01_winter.png"
        ]
    }
}

const colors = {
    '#FF8899': 'rgb(255, 136, 153)',
    '#7799CC': 'rgb(119, 153, 204)',
    '#77DD77': 'rgb(119, 221, 119)',
    '#FFDD88': 'rgb(255, 221, 136)',
    '#7777AA': 'rgb(119, 119, 170)',
    '#77BBDD': 'rgb(119, 187, 221)',
    '#BB9955': 'rgb(187, 153, 85)',
    '#779977': 'rgb(119, 153, 119)',
    '#335566': 'rgb(51, 85, 102)',
    '#AA4477': 'rgb(170, 68, 119)',
    '#881144': 'rgb(136, 17, 68)',
    '#3388BB': 'rgb(51, 136, 187)',
    '#6C5E53': 'rgb(108, 94, 83)'
}

const BACKGROUNDS = [
    {
        name: "商城",
        url:"/assets/photobooth-assets/bg/mall.webp"
    },
    {
        name: "樱花",
        url:"/assets/photobooth-assets/bg/sakura.webp"
    },
    {
        name: "烟花",
        url:"/assets/photobooth-assets/bg/fireworks.webp"
    },
    {
        name: "街头",
        url:"/assets/photobooth-assets/bg/street-view.webp"
    },
    {
        name: "排练室",
        url:"/assets/photobooth-assets/bg/studio.webp"
    },
    {
        name: "天台",
        url:"/assets/photobooth-assets/bg/roof.webp"
    },
    {
        name: "学生会室",
        url:"/assets/photobooth-assets/bg/student-council-room.webp"
    },
    {
        name: "海边",
        url:"/assets/photobooth-assets/bg/sea.webp"
    },
    {
        name: "阁楼",
        url:"/assets/photobooth-assets/bg/anon-room.webp"
    },
    {
        name: "音乐教室",
        url:"/assets/photobooth-assets/bg/music-room.webp"
    },
    {
        name: "桌球室",
        url:"/assets/photobooth-assets/bg/saki-room.webp"
    },
]

const DECORATION_TEMPLATES = [
    {
        id: 'cat-whiskers',
        name: '胡须',
        type: 'decoration',
        url: "/assets/photobooth-assets/decorations/cat-whiskers.webp",
        width: 160,
        height: 80
    },    
    {
        id: 'cat-ear-pink',
        name: '粉猫耳',
        type: 'decoration',
        url: "/assets/photobooth-assets/decorations/cat-ear.png",
        width: 200,
        height: 100
    },
    {
        id: 'cat-ear-blue',
        name: '蓝猫耳',
        type: 'decoration',
        url: "/assets/photobooth-assets/decorations/cat-ear-blue.png",
        width: 200,
        height: 100
    },

    {
        id: 'sunglasses',
        name: '墨镜',
        type: 'decoration',
        url: "/assets/photobooth-assets/decorations/sunglasses.webp",
        width: 160,
        height: 60
    },
    {
        id: 'glasses',
        name: '眼镜',
        type: 'decoration',
        url: "/assets/photobooth-assets/decorations/glasses.webp",
        width: 160,
        height: 60
    },
    {
        id: 'butter',
        name: '黄油',
        type: 'decoration',
        url: "/assets/photobooth-assets/decorations/butter.webp",
        width: 100,
        height: 100
    },
    {
        id: 'speech-bubble',
        name: '对话气泡',
        type: 'decoration',
        svg: (
            <svg
            viewBox="-1 0 34 32"
            xmlns="http://www.w3.org/2000/svg"
            >
            {/* Outer shape (black outline area) */}
            <path
                d="M16 2c-8.838 0-16 5.373-16 12 0 4.127 2.446 7.724 6.675 9.886 0 0.026-0.008 0.044-0.008 0.073 0 1.793-1.005 3.765-1.594 4.779h0.002c-0.046 0.109-0.074 0.229-0.074 0.357 0 0.503 0.405 0.906 0.907 0.906 0.075 0 0.196-0.015 0.239-0.015 0.011 0 0.016 0 0.016 0.003 3.125-0.511 6.561-3.271 7.245-4.104 0.703 0.105 1.177 0.12 1.765 0.12 0.248 0 0.515-0.003 0.829-0.003 8.836 0 16-5.372 16-12 0-6.627-7.164-12-16-12z"
            />
            {/* Inner shape (white fill) */}
            <path
                d="M16 4c7.72 0 14 4.486 14 10s-6.28 10-14 10l-0.829 0.003c-0.55 0-0.909-0.015-1.471-0.099l-1.12-0.16-0.719 0.87c-0.331 0.399-2.017 1.785-3.878 2.677 0.378-1.001 0.657-2.094 0.683-3.175l0.010-0.059v-1.395l-1.090-0.556c-3.55-1.816-5.585-4.77-5.585-8.106 0-5.514 6.28-10 14-10z"
                fill="#ffffff"
            />
            </svg>
        ),
        width: 160,
        height: 140
    },
        {
        id: 'thought-bubble',
        name: '思考气泡',
        type: 'decoration',
        svg: (
            <svg
            viewBox="0 0 128 128"
            xmlns="http://www.w3.org/2000/svg"
            >
            {/* Main bubble */}
            <path
                d="M120.44 51.23a29.87 29.87 0 0 0 2.96-13.02c0-16.6-13.45-30.05-30.05-30.05c-3.89 0-7.61.75-11.03 2.1C77.95 6.45 72.22 4.1 66 4.1c-7.6 0-14.4 3.4-18.9 8.7c-3.5-1.9-7.5-3-11.7-3c-13.4.1-24.3 10.9-24.3 24.3c0 5 1.5 9.7 4.2 13.6c-5 4-8.5 9.9-9.2 16.8C4.8 77.9 14.7 90 28.3 91.3c3.2.3 6.2 0 9.1-.8c1.1 10.7 10.1 19 21.1 19c7 0 13.2-3.4 17-8.6c3.6 2.8 8.1 4.6 13.1 4.6c11 0 20.1-8.5 20.9-19.2C118 82.4 124 73.8 124 63.8c0-4.59-1.33-8.92-3.56-12.57z"
                fill="#ffffff"
                stroke="currentcolor"
                strokeWidth="6"
                strokeMiterlimit="10"
            />

            {/* Small bubble */}
            <path
                d="M24.3 97.3c-4.5-.5-8.5 2.8-9 7.3s2.8 8.5 7.3 8.9c4.5.5 8.5-2.8 9-7.3s-2.8-8.5-7.3-8.9z"
                fill="#ffffff"
                stroke="currentColor"
                strokeWidth="4.5"
                strokeMiterlimit="10"
            />

            {/* Tiny bubble */}
            <path
                d="M9 114.3c-3-.3-5.7 1.9-6 4.9s1.9 5.6 4.9 5.9s5.7-1.9 6-4.9c.3-2.9-1.9-5.6-4.9-5.9z"
                fill="#ffffff"
                stroke="currentColor"
                strokeWidth="4.5"
                strokeMiterlimit="10"
            />
            </svg>

        ),
        width: 160,
        height: 140
    },
        {
        id: 'text-box',
        name: '对话框',
        type: 'decoration',
        svg: (
            <svg
            viewBox="0 0 400 124"
            xmlns="http://www.w3.org/2000/svg"
            >
            {/* Shadow */}
            <rect
                x="4"
                y="24"
                width="392"
                height="92"
                rx="16"
                fill="#000000"
                opacity="0.15"
            />

            {/* Main box */}
            <rect
                x="0"
                y="20"
                width="392"
                height="92"
                rx="16"
                fill="rgba(255,255,255,0.92)"
                strokeWidth="2"
            />

            {/* Name tag */}
            <rect
                x="16"
                y="0"
                width="110"
                height="28"
                rx="14"
            />
            </svg>

        ),
        width: 260,
        height: 100
    },
    {
        id: 'heart-blue',
        name: '蓝心',
        type: 'decoration',
        url: "/assets/blue_heart.png",
        width: 100,
        height: 100
    },
    {
        id: 'heart',
        name: '粉心',
        type: 'decoration',
        url: "/assets/pink_heart.png",
        width: 100,
        height: 100
    },    
    {
        id: 'anon-plush',
        name: '爱音玩偶',
        type: 'decoration',
        url: "/assets/photobooth-assets/decorations/anon-plush.webp",
        width: 160,
        height: 220
    },    
    {
        id: 'saki-plush',
        name: '祥子玩偶',
        type: 'decoration',
        url: "/assets/photobooth-assets/decorations/saki-plush.webp",
        width: 200,
        height: 200
    },
    {
        id: 'mask',
        name: '面具',
        type: 'decoration',
        url: "/assets/photobooth-assets/decorations/mask.png",
        width: 100,
        height: 75
    },
    {
        id: 'angry',
        name: '生气',
        type: 'decoration',
        url: "/assets/photobooth-assets/decorations/angry-vein.png",
        width: 100,
        height: 100
    },    
    {
        id: 'balloons',
        name: '气球',
        type: 'decoration',
        url: "/assets/photobooth-assets/decorations/balloons.png",
        width: 200,
        height: 200
    },
    {
        id: 'star',
        name: '星星',
        type: 'decoration',
        svg: (
    <svg
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    >
    <path
        d="
        M50 5
        L61 38
        L95 38
        L67 58
        L78 91
        L50 71
        L22 91
        L33 58
        L5 38
        L39 38
        Z
        "
        stroke="white"
        strokeWidth="4"
        strokeLinejoin="round"
    />
    </svg>
        ),
        width: 100,
        height: 100
    },
    {
        id: 'sparkle',
        name: '四角星',
        type: 'decoration',
        svg: (
        <svg viewBox="0 0 40 40" className="w-full h-full">
            <path d="M20,5 L22,18 L35,20 L22,22 L20,35 L18,22 L5,20 L18,18 Z" 
            stroke="white" strokeWidth="2"/>
        </svg>
        ),
        width: 100,
        height: 100
    },
    {
    id: 'mustache',
    name: '胡子',
    type: 'decoration',
    svg: (
        <svg 
        fill="#000000" 
        height="200px" 
        width="200px" 
        version="1.1" 
        xmlns="http://www.w3.org/2000/svg"  
        viewBox="0 0 491.315 491.315" >
        <path d="M490.862,222.617c-0.576-3.477-2.816-6.443-6.016-7.936c-3.179-1.493-6.912-1.323-9.941,0.491 c-22.528,13.312-40.149,20.053-52.437,20.053c-15.36,0-21.696-10.325-32.448-30.101c-12.736-23.403-30.165-55.467-80.363-55.467 c-23.872,0-38.443,8.661-49.088,14.976c-12.437,7.381-17.387,7.381-29.824,0c-10.645-6.315-25.216-14.976-49.088-14.976 c-50.091,0-65.643,32-76.992,55.381c-9.707,20.011-15.531,30.421-31.744,30.421c-13.056,0-32.171-6.891-56.789-20.48 c-3.051-1.685-6.699-1.792-9.813-0.256c-3.115,1.515-5.312,4.437-5.867,7.872c-3.093,18.837,9.963,50.496,30.997,75.264 c24,28.245,54.613,43.797,86.208,43.797c42.667,0,69.269-15.488,90.667-27.925c14.165-8.235,25.344-14.741,37.333-14.741 c12.011,0,23.189,6.507,37.355,14.741c21.376,12.416,48,27.925,90.645,27.925c31.616,0,62.229-15.552,86.229-43.797 C480.921,273.113,493.956,241.455,490.862,222.617z"></path>
        </svg>
        ),
        width: 100,
        height: 100
    },
    {
        id: 'tophat',
        name: '高帽',
        type: 'decoration',
        url: "/assets/photobooth-assets/decorations/tophat.webp",
        width: 160,
        height: 160
    },
    {
        id: 'rose',
        name: '玫瑰',
        type: 'decoration',
        url: "/assets/photobooth-assets/decorations/rose.webp",
        width: 100,
        height: 160
    },
    {
        id: 'bowtie',
        name: '蝴蝶结',
        type: 'decoration',
        svg: (
        <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 456.48 456.48"
            xmlSpace="preserve"
        >
            <g strokeWidth="0" />
            <g strokeLinecap="round" strokeLinejoin="round" />
            <g>
            <g>
                <g>
                <path
                    d="M269.35,228.24v22.01c0,2.57-0.72,4.98-1.96,7.03c-2.38,3.91-6.68,6.52-11.59,6.52h-55.13
                    c-5.14,0-9.62-2.87-11.91-7.09c-1.05-1.92-1.64-4.12-1.64-6.46v-22.01v-22.02
                    c0-2.34,0.59-4.54,1.64-6.46c2.29-4.22,6.77-7.08,11.91-7.08h55.13
                    c4.91,0,9.21,2.61,11.59,6.52c1.24,2.04,1.96,4.45,1.96,7.02V228.24z"
                />
                <path
                    d="M269.35,228.24v-22.02c0-2.57-0.72-4.98-1.96-7.02l1.96-0.07l140.61-81.18
                    c7.8-4.5,17.76-0.64,20.51,7.93c10.68,33.28,16.01,67.83,16.01,102.36
                    s-5.33,69.08-16.01,102.36c-2.75,8.57-12.71,12.43-20.51,7.93l-140.61-81.18
                    l-1.96-0.07c1.24-2.05,1.96-4.46,1.96-7.03V228.24z"
                />
                <path
                    d="M187.12,228.24v22.01c0,2.34,0.59,4.54,1.64,6.46l-1.63,0.64L46.52,338.53
                    c-7.8,4.5-17.77,0.64-20.52-7.93c-10.67-33.28-16-67.83-16-102.36
                    s5.33-69.08,16-102.36c2.75-8.57,12.72-12.43,20.52-7.93l140.61,81.18
                    l1.63,0.63c-1.05,1.92-1.64,4.12-1.64,6.46V228.24z"
                />
                </g>

                <g>
                <polyline
                    fill="none"
                    stroke="#000000"
                    strokeWidth="20"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                    points="83.74,199.22 187.12,228.24 83.74,257.25"
                />
                <polyline
                    fill="none"
                    stroke="#000000"
                    strokeWidth="20"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                    points="372.73,257.25 269.35,228.24 372.73,199.22"
                />
                <path
                    fill="none"
                    stroke="#000000"
                    strokeWidth="20"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                    d="M187.13,257.35 L46.52,338.53c-7.8,4.5-17.77,0.64-20.52-7.93
                    c-10.67-33.28-16-67.83-16-102.36s5.33-69.08,16-102.36
                    c2.75-8.57,12.72-12.43,20.52-7.93l140.61,81.18"
                />
                <path
                    fill="none"
                    stroke="#000000"
                    strokeWidth="20"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                    d="M269.35,199.13 l140.61-81.18c7.8-4.5,17.76-0.64,20.51,7.93
                    c10.68,33.28,16.01,67.83,16.01,102.36s-5.33,69.08-16.01,102.36
                    c-2.75,8.57-12.71,12.43-20.51,7.93l-140.61-81.18"
                />
                <path
                    fill="none"
                    stroke="#000000"
                    strokeWidth="20"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                    d="M267.39,257.28
                    c-2.38,3.91-6.68,6.52-11.59,6.52h-55.13c-5.14,0-9.62-2.87-11.91-7.09
                    c-1.05-1.92-1.64-4.12-1.64-6.46v-22.01v-22.02
                    c0-2.34,0.59-4.54,1.64-6.46c2.29-4.22,6.77-7.08,11.91-7.08h55.13
                    c4.91,0,9.21,2.61,11.59,6.52c1.24,2.04,1.96,4.45,1.96,7.02
                    v22.02v22.01C269.35,252.82,268.63,255.23,267.39,257.28z"
                />
                </g>
            </g>
            </g>
        </svg>
          ),
        width: 100,
        height: 100
    },
    {
        id: 'text',
        name: '文字',
        type: 'text',
        textConfig: {
            text: "爱爱的祥!",
            style: "basic-text"
        },
        width: 160,
        height: 80
    },
    {
        id: 'bubbly-text',
        name: '气泡文字',
        type: 'text',
        textConfig: {
            text: "爱爱的祥!",
            style: "bubbly-text"
        },
        width: 160,
        height: 80
    },
    {
        id: 'christmas-hat',
        name: '圣诞帽',
        type: 'decoration',
        url: "/assets/christmas-hat.webp",
        width: 140,
        height: 140
    },
];

const FILTER_PRESET = [
  {
    name: "原图",
    slug: "original",
    imgUrl: "assets/photobooth-assets/filters/original.webp",
    values: {
      brightness: 1,
      contrast: 1,
      saturation: 1,
      temperature: 0,
      fade: 0
    }
  },

  {
    name: "清新",
    slug: "fresh",
    imgUrl: "assets/photobooth-assets/filters/fresh.webp",
    values: {
      brightness: 1.1,
      contrast: 1.05,
      saturation: 1.15,
      temperature: 5,
      fade: 0.05
    }
  },

  {
    name: "暖阳",
    slug: "warm",
    imgUrl: "assets/photobooth-assets/filters/warm.webp",
    values: {
      brightness: 1.05,
      contrast: 1.1,
      saturation: 1.1,
      temperature: 25,
      fade: 0.08
    }
  },

  {
    name: "冷调",
    slug: "cool",
    imgUrl: "assets/photobooth-assets/filters/cool.webp",
    values: {
      brightness: 0.95,
      contrast: 1.1,
      saturation: 0.95,
      temperature: -25,
      fade: 0.05
    }
  },

  {
    name: "复古",
    slug: "vintage",
    imgUrl: "assets/photobooth-assets/filters/vintage.webp",
    values: {
      brightness: 0.9,
      contrast: 1.0,
      saturation: 0.8,
      temperature: 10,
      fade: 0.35
    }
  },

  {
    name: "胶片",
    slug: "film",
    imgUrl: "assets/photobooth-assets/filters/film.webp",
    values: {
      brightness: 0.95,
      contrast: 1.0,
      saturation: 0.8,
      temperature: 15,
      fade: 0.45
    }
  },
//   {
//     name: "黑白",
//     slug: "bw",
//     imgUrl: "assets/photobooth-assets/filters/bw.webp",
//     values: {
//       brightness: 1,
//       contrast: 1.2,
//       saturation: 0,
//       temperature: 0,
//       fade: 0.1
//     }
//   },
  {
    name: "暗调",
    slug: "dark",
    imgUrl: "assets/photobooth-assets/filters/dark.webp",
    values: {
      brightness: 0.75,
      contrast: 1.25,
      saturation: 0.9,
      temperature: -5,
      fade: 0.15
    }
  }
];


const filterSliders = [
  { key: "brightness", label: "亮度", min: 0.25, max: 1.25, step: 0.01, default: 1 },
  { key: "contrast",   label: "对比", min: 0.5, max: 1.5, step: 0.01, default: 1 },
  { key: "saturation", label: "饱和", min: 0,   max: 2.0, step: 0.01, default: 1 },
  { key: "temperature",label: "色温", min: -50, max: 50 , step: 1,    default: 0 },
  { key: "fade",       label: "淡化", min: 0,   max: 1.0, step: 0.01, default: 0 }
];

const positionSliders = [
  { key: "faceDirectionX", label: "朝向X", min: -1,    max: 1,     step: 0.01, default: 0 },
  { key: "faceDirectionY", label: "朝向Y", min: -1,    max: 1,     step: 0.01, default: 0 },
  { key: "positionX",      label: "位置X", min: -1.75, max: -0.25, step: 0.01, default: -1.35},
  { key: "positionY",      label: "位置Y", min: 0.55,  max: 1.55,  step: 0.01, default: 1.15 },
];


const subsections = [
    {
        name: "position",
        path: "M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4 0 114.7-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4 114.7 0 0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4 0-114.7 114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4-114.7 0 0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z",
        display: "位置"
    }, {
        name: "motion",
        viewBox: "0 -50 448 612",
        path: "M256.5-32a56 56 0 1 1 0 112 56 56 0 1 1 0-112zM123.6 176c-3.3 0-6.2 2-7.4 5L94.2 235.9c-6.6 16.4-25.2 24.4-41.6 17.8s-24.4-25.2-17.8-41.6l21.9-54.9C67.7 129.9 94.1 112 123.6 112l97.3 0c28.5 0 54.8 15.1 69.1 39.7l32.8 56.3 61.6 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-61.6 0c-22.8 0-43.8-12.1-55.3-31.8l-10-17.1-20.7 70.4 75.4 22.6c27.7 8.3 41.8 39 30.1 65.5L285.7 509c-7.2 16.2-26.1 23.4-42.2 16.2s-23.4-26.1-16.2-42.2l49.2-110.8-95.9-28.8c-32.7-9.8-52-43.7-43.7-76.8l22.7-90.6-35.9 0zm-8 181c13.3 14.9 30.7 26.3 51.2 32.4l4.7 1.4-6.9 19.3c-5.8 16.3-16 30.8-29.3 41.8L52.9 519.8c-13.6 11.2-33.8 9.3-45-4.3s-9.3-33.8 4.3-45l82.4-67.9c4.5-3.7 7.8-8.5 9.8-13.9L115.6 357z",
        display: "动作"
    }, {
        name: "expression",
        path: "M464 256a208 208 0 1 0 -416 0 208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0zm372.2 46.3c11.8-3.6 23.7 6.1 19.6 17.8-19.8 55.9-73.1 96-135.8 96-62.7 0-116-40-135.8-95.9-4.1-11.6 7.8-21.4 19.6-17.8 34.7 10.6 74.2 16.5 116.1 16.5 42 0 81.5-6 116.3-16.6zM144 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm164 8c0 11-9 20-20 20s-20-9-20-20c0-33.1 26.9-60 60-60l16 0c33.1 0 60 26.9 60 60 0 11-9 20-20 20s-20-9-20-20-9-20-20-20l-16 0c-11 0-20 9-20 20z",
        display: "表情"
    }, {
        name: "cloth",
        viewBox: "0 0 640 512",
        path: "M320.2 112c44.2 0 80-35.8 80-80l53.5 0c17 0 33.3 6.7 45.3 18.7L617.6 169.4c12.5 12.5 12.5 32.8 0 45.3l-50.7 50.7c-12.5 12.5-32.8 12.5-45.3 0l-41.4-41.4 0 224c0 35.3-28.7 64-64 64l-192 0c-35.3 0-64-28.7-64-64l0-224-41.4 41.4c-12.5 12.5-32.8 12.5-45.3 0L22.9 214.6c-12.5-12.5-12.5-32.8 0-45.3L141.5 50.7c12-12 28.3-18.7 45.3-18.7l53.5 0c0 44.2 35.8 80 80 80z",
        display: "服装"
    }, {
        name: "capture",
        path: "M193.1 32c-18.7 0-36.2 9.4-46.6 24.9L120.5 96 64 96C28.7 96 0 124.7 0 160L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64l-56.5 0-26-39.1C355.1 41.4 337.6 32 318.9 32L193.1 32zm-6.7 51.6c1.5-2.2 4-3.6 6.7-3.6l125.7 0c2.7 0 5.2 1.3 6.7 3.6l33.2 49.8c4.5 6.7 11.9 10.7 20 10.7l69.3 0c8.8 0 16 7.2 16 16l0 256c0 8.8-7.2 16-16 16L64 432c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l69.3 0c8 0 15.5-4 20-10.7l33.2-49.8zM256 384a112 112 0 1 0 0-224 112 112 0 1 0 0 224zM192 272a64 64 0 1 1 128 0 64 64 0 1 1 -128 0z",        
        display: "拍照"
    }, {
        name: "help",
        path: "M464 256a208 208 0 1 0 -416 0 208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0zm256-80c-17.7 0-32 14.3-32 32 0 13.3-10.7 24-24 24s-24-10.7-24-24c0-44.2 35.8-80 80-80s80 35.8 80 80c0 47.2-36 67.2-56 74.5l0 3.8c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-8.1c0-20.5 14.8-35.2 30.1-40.2 6.4-2.1 13.2-5.5 18.2-10.3 4.3-4.2 7.7-10 7.7-19.6 0-17.7-14.3-32-32-32zM224 368a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z",
        display: "帮助"
    }
]
const shareData = {
    title: ""
}

const helpConfig = [
    {
        text: "如果看不到live2d，请尝试切换模型或者刷新。",
        highlight: "#cloth",
        height: "135px"
    },    
    {
        text: "点击按钮来切换当前选择的live2d。",
        highlight: ".character-toggle",
        height: "120px"
    },
    {
        text: "设置好想要的表情,动作，朝向，模型等等。",
        highlight: "#position,#motion,#expression,#cloth",
        height: "135px"
    },    
    {
        text: "在合适的时机暂停当前live2d的动作。",
        highlight: "#pause-button",
        height: "135px"
    },
    {
        text: "切换栏目来添加装饰物，切换背景，和调整滤镜。",
        highlight: ".tab-selector",
        height: "135px"
    },
    {
        text: "按下拍照键或者截屏来拍摄。",
        highlight: "#capture",
        height: "120px"
    }
]


// function transformViewX(deviceX)
// {
//     var screenX = deviceToScreenRef.current.transformX(deviceX); 
//     return viewMatrixRef.current.invertTransformX(screenX); 
// }


// function transformViewY(deviceY)
// {
//     var screenY = deviceToScreenRef.current.transformY(deviceY); 
//     return  viewMatrixRef.current.invertTransformY(screenY); 
// }


// function transformScreenX(deviceX)
// {
//     return deviceToScreenRef.current.transformX(deviceX);
// }


// function transformScreenY(deviceY)
// {
//     return deviceToScreenRef.current.transformY(deviceY);
// }

function SectionButtons({onClick, displayText, image, active, svg, textConfig}){
    const [loading, setLoading] = useState((svg||textConfig)?false:true)

    return(
        <div className={`subsection-buttons flex ${active?"active": ""}`} onClick={onClick}>
            {image && <img className='button-background-images non-select' src={image} onLoad={()=>setLoading(false)}></img>}
            {svg && svg}
            {textConfig && <p className={textConfig.style}>{textConfig.text}</p>}
            {loading && <Spinner />}
            <p className='button-text'>{displayText}</p>
        </div>
    )
}

function FileUploadButton({handleCustomImageUpload}){
    const fileInputRef = useRef(null)
    const svg = (<svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    >
    <path
        d="
M18 20H4V6h9V4H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-9h-2v9zm-7.79-3.17l-1.96-2.36L5.5 18h11l-3.54-4.71zM20 4V1h-2v3h-3c.01.01 0 2 0 2h3v2.99c.01.01 2 0 2 0V6h3V4h-3z
        "
        stroke="white"
        strokeWidth="1"
        strokeLinejoin="round"
    />
    </svg>)

    return(
        <>
            <SectionButtons svg={svg} displayText={"上传图片"} onClick={()=>fileInputRef.current.click()}/>
            <input             
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleCustomImageUpload}
                className='upload-input'
            />
        </>
    )
}

function Decorations({url, selected, id, svg, textConfig, width, height, onClick, onDelete, canvasContainerRef}){
    const [scale, setScale] = useState(1)
    const [rotation, setRotation] = useState(0)
    const [center, setCenter] = useState({x: 200, y: 200})
    const ref = useRef(null)
    const parentDragRef = useRef(null)
    const [flip, setFlip] = useState(false)
    const [color, setColor] = useState(()=>gsap.utils.random(Object.keys(colors)))
    const [text, setText] = useState(textConfig? textConfig.text : null)
    const [isEditingText, setIsEditingText] = useState(false)
    const textRef = useRef(null)
    const [zIndex, setZIndex] = useState(51)
    const [zIndexDisplay, setZIndexDisplay] = useState(1)

    // useGSAP(()=>{
    //     parentDragRef.current = Draggable.create(ref.current,
    //         {
    //             type: 'x, y',
    //             onPress: onClick,
    //             bounds: ".photo-booth-canvas-container",
    //             cancel: ".resizing-editor",
    //             dragClickables: true,
    //         }
    //     ) 
    // }, [])
    // useGSAP(()=>{
    //     const tl = gsap.timeline({paused:true})
    //     tl.to(".resizing-editor", {
    //         x: 3 * width,
    //         y: 3 * height,
    //         ease: "none"
    //     })
    //     Draggable.create(".resizing-editor",
    //         {
    //             type: 'x, y',
    //             onDragStart: function() {
    //                 parentDragRef.current[0].disable()
    //             },
    //             onDrag: function(){
    //                 let progress = gsap.utils.clamp(0, 1, (this.x) /(3 * width))
    //                 tl.progress(progress)
    //             },
    //             onDragEnd: function() {
    //                 parentDragRef.current[0].enable()
    //             },
    //         }
    //     ) 
    // }, [isSelected])
    const [isDragging, setIsDragging] = useState(false)
    const [isResizing, setIsResizing] = useState(false)
    const [isRotating, setIsRotating] = useState(false)
    const [anchorStart, setAnchorStart] = useState()
    const colorPickerRef = useRef(null)
    const timeoutRef = useRef(null)
    
    const isSelected = selected == id
    const [showPortal, setShowPortal] = useState(isSelected)

    function handleDragStart(e){
        onClick() //select the element
        if(isEditingText)return;
        setIsDragging(true)
        updateAnchorStart(e)
        // parentDragRef.current[0].disable()
    }

    function handleResizeStart(e){
        setIsResizing(true)
        updateAnchorStart(e)
    }
    
    function handleRotationStart(e){
        setIsRotating(true)
        updateAnchorStart(e)
    }
    
    function updateAnchorStart(e){
        e.stopPropagation()
        const rect = canvasContainerRef.current?.getBoundingClientRect();
        let x 
        let y 
        if (e.touches) {
            x = e.touches[0].clientX - (rect?.left || 0);
            y = e.touches[0].clientY - (rect?.top || 0);
        }else{
            x = e.clientX - (rect?.left || 0);
            y = e.clientY - (rect?.top || 0);
        }
        const initialDistance = Math.sqrt(Math.pow(x - center.x, 2) + Math.pow(y - center.y, 2));
        const angle = Math.atan2(y - center.y, x - center.x) * 180 / Math.PI;
        setAnchorStart({x: x, y: y, distance: initialDistance, scale: scale, angle: angle - rotation})
    }

    useEffect(() => {
        function handleMouseMove(e) {
            if (!canvasContainerRef.current) return;
        
            const rect = canvasContainerRef.current.getBoundingClientRect();
            let x 
            let y
            if (e.touches) {
                x = e.touches[0].clientX - rect.left;
                y = e.touches[0].clientY - rect.top;
            }
            else{
                x = e.clientX - rect.left;
                y = e.clientY - rect.top;
            }
            if(isDragging){
                setCenter({
                    x: gsap.utils.clamp(0, rect.width, center.x + x - anchorStart.x),
                    y: gsap.utils.clamp(0, rect.height, center.y + y - anchorStart.y)
                })
            }else if(isResizing){
                const deltaX = x - anchorStart.x
                const deltaY = y - anchorStart.y
                const currentDistance = Math.sqrt(Math.pow(x - center.x, 2) + Math.pow(y - center.y, 2));
                const distanceRatio = currentDistance / anchorStart.distance;
                const newScale = Math.max(0.3, Math.min(3, anchorStart.scale * distanceRatio));
                // console.log(deltaX, deltaY, newScale)
                setScale(newScale)
            }else if(isRotating){
                const normalize = a => ((a + 180) % 360) - 180
                const angle = Math.atan2(y - center.y, x - center.x) * 180 / Math.PI;
                setRotation(normalize(angle - anchorStart.angle));
            }
        }
        function handleDragEnd(){
            setIsDragging(false)
            setIsResizing(false)
            setIsRotating(false)
            // parentDragRef.current[0].enable()
        }
        if(isDragging||isResizing||isRotating){
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleDragEnd);
            window.addEventListener('touchmove', handleMouseMove, { passive: false });
            window.addEventListener('touchend', handleDragEnd);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleDragEnd);
            window.removeEventListener('touchmove', handleMouseMove, { passive: false });
            window.removeEventListener('touchend', handleDragEnd);
        }
    }, [isDragging, isResizing, isRotating, anchorStart]);

    useEffect(() => {
        if (isSelected && textConfig && isEditingText){
            textRef.current.focus()
        }
    }, [isEditingText, isSelected])

    useEffect(()=>{
        if(!isSelected){
            if(selected == null){
                timeoutRef.current = setTimeout(()=>{
                    setShowPortal(false);
                    timeoutRef.current = null;
                }, 500)
            }else{
                clearTimeout(timeoutRef.current)
                setShowPortal(false)
            }
        }else{
            clearTimeout(timeoutRef.current)
            setShowPortal(true)
        }
    }, [isSelected, selected])

    useEffect(()=>{
        if(Number.isInteger(zIndexDisplay)){
            const numericAmount = parseInt(zIndexDisplay)
            setZIndex(numericAmount+50)
        }
    }, [zIndexDisplay])

    function handleZIndexChange(amount, set=false){
        if(isResizing) return
        if(set == true){
            const value = amount.target.value
            if(isInt(value)){
                const numericAmount = parseInt(value)
                setZIndexDisplay(gsap.utils.clamp(-49, 49, numericAmount))
            }else{
                setZIndexDisplay(value)
            }
        }else if(zIndex + amount < 100 && zIndex + amount > 0){
            setZIndex(prev=>prev+amount)
            setZIndexDisplay(prev=>{
                if (isInt(prev)){
                    return prev+amount
                }else{
                    return 1
                }
            })
        }
    }

    return(
        <>
        <div 
            className={`decoration-container flex ${zIndex>50?"decoration-infront":"decoration-behind"}`} 
            ref={ref}
            style={{
                "--width": textConfig? "auto":`${width * scale}px`,
                "--height": `${height * scale}px`,
                "--left": `${center.x - width/2 * scale}px`,
                "--top": `${center.y - height/2 * scale}px`,
                "--rotation": `${rotation}deg`,
                "--zIndex": zIndex,
                "--scale": scale,
                "--pointer": isEditingText ? "auto" : "grab"
            }}
            onMouseDown={(e)=>handleDragStart(e)}
            onClick={(e)=>e.stopPropagation()}
            onTouchStart={(e)=>handleDragStart(e)}
        >
            <div className={`decoration-assets-container non-select flex ${flip?"mirror-horizontal":""}`} style={{"--color": color }}>
                {url && <img src={url}></img>}
                {svg && svg}
                {textConfig && 
                    <input 
                        ref={textRef}
                        className={`text-decoration ${textConfig.style}`}
                        style={{
                            "--scale":scale,
                            "--width":`${text.length * 1.5}ch`,
                            pointerEvents: isEditingText ? "all" : "none"
                        }}
                        value={text} 
                        contentEditable={true}
                        onChange={e=>setText(e.target.value)}
                        onBlur={()=>{
                            setIsEditingText(false)
                        }}
                        onKeyDown={(e)=>{
                            if(e.key == "Enter"){ 
                                e.target.blur()
                            }
                        }}
                        ></input>}
            </div>
            {isSelected && 
                <div className='edit-overlay'>
                    <div className='resizing-editor overlay-buttons flex' 
                        onMouseDown={(e)=>handleResizeStart(e)}
                        onTouchStart={(e)=>handleResizeStart(e)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="12px" height="12px"><path d="M344 0L488 0c13.3 0 24 10.7 24 24l0 144c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-39-39-87 87c-9.4 9.4-24.6 9.4-33.9 0l-32-32c-9.4-9.4-9.4-24.6 0-33.9l87-87-39-39c-6.9-6.9-8.9-17.2-5.2-26.2S334.3 0 344 0zM168 512L24 512c-13.3 0-24-10.7-24-24L0 344c0-9.7 5.8-18.5 14.8-22.2S34.1 320.2 41 327l39 39 87-87c9.4-9.4 24.6-9.4 33.9 0l32 32c9.4 9.4 9.4 24.6 0 33.9l-87 87 39 39c6.9 6.9 8.9 17.2 5.2 26.2S177.7 512 168 512z"/></svg>
                        </div>
                    <div className='overlay-close-button overlay-buttons flex' onClick={onDelete}>
                        <svg fill="#fff" height="10px" width="10px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460.775 460.775">
                            <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55  c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55  c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505  c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55  l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719  c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"/>
                        </svg>
                    </div>
                    <div className='rotation-button overlay-buttons flex'
                        onMouseDown={(e)=>handleRotationStart(e)}
                        onTouchStart={(e)=>handleRotationStart(e)}
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="12px" height="12px"><path d="M436.7 74.7L448 85.4 448 32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 128c0 17.7-14.3 32-32 32l-128 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l47.9 0-7.6-7.2c-.2-.2-.4-.4-.6-.6-75-75-196.5-75-271.5 0s-75 196.5 0 271.5 196.5 75 271.5 0c8.2-8.2 15.5-16.9 21.9-26.1 10.1-14.5 30.1-18 44.6-7.9s18 30.1 7.9 44.6c-8.5 12.2-18.2 23.8-29.1 34.7-100 100-262.1 100-362 0S-25 175 75 75c99.9-99.9 261.7-100 361.7-.3z"/></svg>
                    </div>
                    {(svg||textConfig) && scale > 0.5 && <div className='fill-button overlay-buttons flex' 
                        onPointerUp={(e)=>{
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    >
                        <svg style={{"--color": color}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M296 64c6.9 0 13.5 2.7 18.3 7.6L440.4 197.7c4.9 4.9 7.6 11.5 7.6 18.3s-2.7 13.5-7.6 18.3L386.7 288 65.3 288c1.3-3.9 3.4-7.4 6.3-10.3l96.4-96.4 33.4 33.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L213.3 136 277.7 71.6c4.9-4.9 11.5-7.6 18.3-7.6zM122.7 136L26.3 232.4C9.5 249.3 0 272.1 0 296s9.5 46.7 26.3 63.6L152.4 485.7C169.3 502.5 192.1 512 216 512s46.7-9.5 63.6-26.3L485.7 279.6C502.5 262.7 512 239.9 512 216s-9.5-46.7-26.3-63.6L359.6 26.3C342.7 9.5 319.9 0 296 0s-46.7 9.5-63.6 26.3L168 90.7 118.6 41.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L122.7 136z"/></svg>
                        <div className='color-picker-wraper'>
                            <input className='color-picker' type='color' ref={colorPickerRef} list="colorOptions" value={color} onChange={(e)=>setColor(e.target.value)}/>
                            <datalist id="colorOptions">
                                {Object.keys(colors).map((key)=>(
                                    <option value={key} key={key}></option>
                                ))}
                            </datalist>
                        </div>
                    </div>}
                    {(textConfig) && <div className='text-edit-button overlay-buttons flex' 
                        onPointerUp={(e)=>{
                        }}
                        onClick={(e)=>{
                            // console.log("triggered")
                            e.preventDefault();
                            e.stopPropagation();
                            setIsEditingText(true)
                            // e.preventDefault();
                            // e.stopPropagation();
                        }}
                        // onTouchEnd={(e)=>{
                        //     e.preventDefault();
                        //     e.stopPropagation();
                        //     setIsDragging(false)
                        // }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152L0 424c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 112c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 64z"/></svg>
                    </div>}
                    {scale > 0.5 &&
                        <>
                            <div className='flip-button overlay-buttons flex'
                                onPointerUp={(e)=>{
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setFlip(prev=>!prev)
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M502.6 150.6l-96 96c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L402.7 160 32 160c-17.7 0-32-14.3-32-32S14.3 96 32 96l370.7 0-41.4-41.4c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l96 96c12.5 12.5 12.5 32.8 0 45.3zm-397.3 352l-96-96c-12.5-12.5-12.5-32.8 0-45.3l96-96c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3L109.3 352 480 352c17.7 0 32 14.3 32 32s-14.3 32-32 32l-370.7 0 41.4 41.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0z"/></svg>
                            </div>
                            <div 
                            className='overlay-buttons flex' 
                            id='z-index-button-1'
                            onPointerUp={()=>{handleZIndexChange(1)}}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z"/></svg>                    
                            </div>
                            <div 
                                className='overlay-buttons flex' 
                                id='z-index-button-2'
                                onPointerUp={()=>{handleZIndexChange(-1)}}
                                >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32z"/></svg>
                            </div>
                        </>
                    }
                </div>
            }
        </div>

        {showPortal && createPortal(
            <div onClick={(e)=>e.stopPropagation()} className='detailed-control-inner-container flex flex-col'>
                <Slider 
                    config={{label: "大小", min: 0.3, max: 3, step: 0.1, value: scale}} 
                    onChange={(e)=>{
                        setScale(parseFloat(e.target.value))}
                    }
                    reset={()=>setScale(1)}
                />
                <Slider 
                    config={{label: "旋转", min: -180, max: 180, step: 1, value: rotation}} 
                    onChange={(e)=>{
                        setRotation(parseInt(e.target.value))}
                    }
                    reset={()=>setRotation(0)}
                />
                <div className='flex detailed-control-bottom'>
                    <div className='flex layer-input'>
                        <label htmlFor="z-index-input">层次</label>
                        <input 
                            id='z-index-input' 
                            type='number' 
                            value={zIndexDisplay}
                            onChange={(e)=>{
                                handleZIndexChange(e, true)
                            }}
                            onBlur={(e)=>{
                                if(!isInt(e.target.value)){
                                    setZIndexDisplay(1)
                                }
                            }}
                            ></input>
                    </div>
                    {(svg || textConfig) && 
                        <div className='flex layer-input'>                            
                            <p>颜色</p>
                            <input
                                type='color'
                                list="colorOptions" 
                                className='color-picker-block' 
                                // style={{"--background-color":color}}
                                value={color} onChange={(e)=>setColor(e.target.value)}
                                />
                        </div>
                    }
                </div>
                {
                    textConfig &&
                    <div className='flex layer-input'>
                        <p>文字</p>
                        <input type='text' value={text} onChange={(e)=>setText(e.target.value)}></input>
                    </div>
                }
                <button className="detailed-delete-button tools-section-buttons" onClick={onDelete}>删除</button>
            </div>, document.getElementsByClassName("decoration-detailed-control")[0]
        )}
        </>
    )
}

function Slider({ config, onChange, reset}){
    return(
        <div className='flex input-container'>
            <span>{config.label}</span>
            <div className='slider-container flex'>
                <span>{config.min}</span>
                <input type="range" 
                    onChange={onChange} 
                    min={config.min}
                    max={config.max}
                    step={config.step}
                    value={config.value}
                    />
            <span>{config.max}</span>
            </div>
            <input type='number'
                onChange={onChange}
                min={config.min}
                max={config.max}
                step={config.step}
                value={config.value}
            />
            <div className={""} onClick={reset}> 
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M65.9 228.5c13.3-93 93.4-164.5 190.1-164.5 53 0 101 21.5 135.8 56.2 .2 .2 .4 .4 .6 .6l7.6 7.2-47.9 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 53.4-11.3-10.7C390.5 28.6 326.5 0 256 0 127 0 20.3 95.4 2.6 219.5 .1 237 12.2 253.2 29.7 255.7s33.7-9.7 36.2-27.1zm443.5 64c2.5-17.5-9.7-33.7-27.1-36.2s-33.7 9.7-36.2 27.1c-13.3 93-93.4 164.5-190.1 164.5-53 0-101-21.5-135.8-56.2-.2-.2-.4-.4-.6-.6l-7.6-7.2 47.9 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 320c-8.5 0-16.7 3.4-22.7 9.5S-.1 343.7 0 352.3l1 127c.1 17.7 14.6 31.9 32.3 31.7S65.2 496.4 65 478.7l-.4-51.5 10.7 10.1c46.3 46.1 110.2 74.7 180.7 74.7 129 0 235.7-95.4 253.4-219.5z"/></svg>
            </div>
        </div>
    )
}

function PhotoBoothPage() {
    const [character, setCharacter] = useState("init")
    const [modelData, setModelData] = useState([])
    
    const [loading, setLoading] = useState()
    const [error, setError] = useError(3000)

    const [activeTab, setActiveTab] = useState("model")
    const activeTabRef = useRef(null)
    const [selectedCharacter, setSelectedCharacter] = useState(0)
    const [activeSubsection, setActiveSubsection] = useState("home")
    // const [pausedCharacter, setPausedCharacter] = useState([])
    // const [turnCords, setTurnCords] = useState([{x:0, y:0}, {x:0, y:0}])
    
    const [decorations, setDecorations] = useState([])
    const [selectedDecorations, setSelectedDecorations] = useState(null)
    const currentId = useRef(0)
    const canvasContainerRef = useRef(null)
    const l2dCanvasRef = useRef(null)
    const [background, setBackground] = useState(()=>BACKGROUNDS[0].url)
    const [filterSliderValue, setFilterSliderValue] = useState({
        brightness: 1,
        contrast: 1,
        saturation: 1,
        temperature: 0,
        fade: 0,
    })

    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState(null);
    const [popupAnimationState, setPopupAnimationState] = useState("closed")
    const [isFlashing, setIsFlashing] = useState(false)
    const shutterAudioRef = useRef(null)
    const [isRemoveAllShown, setIsRemoveAllShown] = useState(false)

    const [showHelp, setShowHelp] = useState(false)
    const [helpStep, setHelpStep] = useState(0)

    async function fetchData(models, textures){
        try{
            setLoading(true)
            await fetch(models[0])
            await fetch(models[1])
            for (let i = 0; i < textures.length; i++) {;
                const img = new Image();
                img.src = textures[i];  
            }
            setLoading(false)
        }
        catch (err){
            console.error('Failed to fetch data', err);
            setError({type:"fetch", msg:"❌无法获取模型信息！请联系作者B站"})
            return false
        }
    }

   useEffect(()=>{
        async function fetchModelData(){
            const sakiData = await fetch("/assets/l2d/saki/model-matching-outfit.json").then(res => res.json())
            const anonData = await fetch("/assets/l2d/anon/model-matching-outfit.json").then(res => res.json())
            setModelData([anonData, sakiData])
        }
        fetchData(MODEL_PATHS.both.models, MODEL_PATHS.both.textures)
        fetchModelData()
        setCharacter("both")
    }, [])

    useEffect(()=>{
        if(MODEL_PATHS[character])
            fetchData(MODEL_PATHS[character].models, MODEL_PATHS[character].textures);
    }, [character])

    const [live2DConfigs, setLive2dConfigs] = useState(INITIALL2DCONFIGS)

    useGSAP(()=>{
        const index = activeTab == "model"? 0: activeTab == "decor"? 1: activeTab == "background"? 2: 3
        gsap.to(".tabs-container", {
            xPercent: index * -25,
            duration: 0.25
        })
    }, [activeTab])

    const {contextSafe} = useGSAP(()=>{
        gsap.to(".pill", {
            xPercent: selectedCharacter * 100,
            backgroundColor: selectedCharacter? "rgb(150, 174, 210)": "rgb(246, 162, 174)",
            duration: 0.25
        })
    }, [selectedCharacter])

    useGSAP(()=>{
        const tl = gsap.timeline()
        if(popupAnimationState == "opening"){
            tl.fromTo(".sticky-note-popup", 
                {opacity: 0},
                {
                    opacity: 1,
                    duration: 0.25,
                    pointerEvents: "all"
                }
            ).fromTo(".photo-popup", {
                rotate: ()=>gsap.utils.random(-50, 50),
                top: "0%",
                yPercent: -200,
            }, {
                rotate: 0,
                top: "50%",
                yPercent: -50,
                duration: 0.5,
                ease: "none",
            }, ">")
        }else if(popupAnimationState == "closing"){
            if(generatedImage!=null){
                tl.to(".photo-popup", {
                    top: "100%",
                    yPercent: 100,
                    duration: 0.5,
                    ease: "none",
                }).to(".sticky-note-popup", 
                {
                    opacity: 0,
                    duration: 0.25,
                    pointerEvents: "none"
                }, ">"
            )
            }
        }
        tl.play()
    }, [popupAnimationState])

    useEffect(() => {
        return () => {
            if (generatedImage) {
                URL.revokeObjectURL(generatedImage);
            }
        };
    }, [generatedImage]);
    
    function changeTab(tab){
        if(!showHelp){
            setActiveTab(tab)
        }
    }

    const switchSubsection = contextSafe((section)=>{
        if (section == activeSubsection || showHelp) return;
        if (section == "capture") return captureCanvas();
        if (section == "help") return handleShowHelp();
        const target = section !== "home"? "#home": "#back"
        const destination = section == "home"? "#home": "#back"
        const tl = gsap.timeline()
        tl.to(".subsection-container", {
            opacity: 0,
            duration: 0.25,
            onComplete: ()=> setActiveSubsection(section)
        })
        .to(target, {
            duration: 0.25,
            opacity: 0
        }, "<")
        .to(".subsection-container", {
            opacity: 1,
            duration: 0.25,
        }, ">")
        .to(destination, {
            duration: 0.25,
            opacity: 1
        }, "<")
    })

    const canvasFlash = contextSafe(()=>{
        setIsFlashing(true)
        const tl = gsap.timeline({onComplete:()=>{setIsFlashing(false)}});
        shutterAudioRef.current.volume = 0.5
        shutterAudioRef.current.play()
        tl.fromTo("#flash-overlay", 
            {opacity: 0}, 
            {opacity: 1, duration: 0.3}
        ).to("#flash-overlay",
            {opacity: 0, duration: 0.1}
        )
    })

    function handleDrag(event, character){
        const rect = event.target.getBoundingClientRect();
        const sx = transformScreenX(event.clientX - rect.left);
        const sy = transformScreenY(event.clientY - rect.top);
        const vx = transformViewX(event.clientX - rect.left);
        const vy = transformViewY(event.clientY - rect.top);
    }  


    const selectCharacter = contextSafe((character) => {
        if (character == selectedCharacter) return;
        if (activeSubsection == "home"){
            return setSelectedCharacter(character)
        }
        const direction = character? -1 : 1
        const tl = gsap.timeline()
        tl.to(".subsection-container", {
            xPercent: direction * 100,
            duration: 0.25,
            ease: "power1.out",
            onComplete: 
            ()=> setSelectedCharacter(character)
        }).set(
            ".subsection-container",{
                xPercent: (-direction) * 100,
            }
        )
        .to(".subsection-container", {
            xPercent: 0,
            ease: "power1.out",
            duration: 0.25, //replace with x-transition
        }, ">")
    })

    function toggleCharacter(character){
        setLive2dConfigs(prev => prev.map((config, index)=>(
                index == character? {...config, paused:!config.paused}: config
        )))
    }

    function changeCharacterConfig(name, value){
        const numericValue = parseFloat(value)
        setLive2dConfigs(prev => prev.map((config, index)=>(
            index == selectedCharacter? {...config, [name]:Number.isNaN(numericValue)?value:numericValue}: config
        )))
    }

    function changeCloth(modelName){
        setCharacter(modelName)
        setLive2dConfigs(prev=> prev.map((config)=>(
            {...config, paused:false}
        )))
    }

    function resetConfig(){
        setLive2dConfigs(prev => prev.map((config, index)=>(
            index == selectedCharacter? {
                ...config,
                faceDirectionX:0, 
                faceDirectionY:0,
                positionX: selectedCharacter == 0? -1.35: -0.65,
                positionY: 1.15,
            }: config
        )))
    }

    function handleMotionOnClick(motion){
        changeCharacterConfig("motion", motion)
        changeCharacterConfig("motionPlayback", live2DConfigs[selectedCharacter].motionPlayback+1)
    }

    const propContainerRef = useRef(null)

    async function captureCanvas(){
        if(isGenerating) return;
        setIsGenerating(true)
        canvasFlash()
        const decorationBehindCanvas = await snapdom.toCanvas(propContainerRef.current, {
                scale: 1,
                filter: el => !el.classList.contains('edit-overlay')&&!el.classList.contains('decoration-infront'),
            })
        
        const decorationInfrontCanvas = await snapdom.toCanvas(propContainerRef.current, {
                scale: 1,
                filter: el => !el.classList.contains('edit-overlay')&&!el.classList.contains('decoration-behind'),
            })
        
        if(!decorationBehindCanvas || !decorationInfrontCanvas){
            setIsGenerating(false)
            setError({type:"generation", msg:"❌生成失败，请尝试截图"})
            return
        }


        document.body.appendChild(decorationBehindCanvas)

        const glCanvas = l2dCanvasRef.current;
        const out = new OffscreenCanvas(decorationBehindCanvas.width, decorationBehindCanvas.height)
        const img = new Image()
        img.src = background;
        const ctx = out.getContext('2d');
        img.onload = ()=>{                
            ctx.drawImage(img, 0, 0, out.width, out.height);
            requestAnimationFrame(async () => {
                ctx.filter = `brightness(${getFilterValue("brightness")})
                                hue-rotate(${getFilterValue("hue")})
                                saturate(${getFilterValue("saturation")})
                                contrast(${getFilterValue("contrast")})`
                ctx.drawImage(decorationBehindCanvas, 0, 0)
                ctx.drawImage(
                    glCanvas, 
                    0, 0, glCanvas.width, glCanvas.height,
                    0, 0, decorationBehindCanvas.width, decorationBehindCanvas.height
                )
                ctx.drawImage(decorationInfrontCanvas, 0, 0)
                const blob = await out.convertToBlob({ type: 'image/png' })
                setGeneratedImage(URL.createObjectURL(blob))
                setIsGenerating(false)
                setPopupAnimationState("opening")
                ctx.reset(); 
            })
            
        }
        
    }

    const handleDownload = () => {
        // console.log("downloading")
        if (!generatedImage) return;
        setError(null)
        const a = document.createElement('a');
        a.href = generatedImage;
        a.download = `anonsaki-win-${crypto.randomUUID()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    async function handleShare(){
        try {
            const response = await fetch(generatedImage);
            const blob = await response.blob();
            
            const file = new File([blob], `anonsaki-win-${crypto.randomUUID()}.png`, { type: blob.type });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                files: [file],
                title: '图片分享',
                text: '爱爱的祥生产图片'
            });
            } else {
                setError({type: "share", msg: "❌错误:无法获得分享许可。请下载图片。"});
            }
        } catch (err) {
            console.error("Could not share file:", err);
        }
    };

    function getFilterValue(variable) {
        switch(variable) {
            case "brightness":
            return `${filterSliderValue.brightness + 0.2 * filterSliderValue.fade}`;
            case "contrast":
            return `${filterSliderValue.contrast - 0.5 * filterSliderValue.fade}`;
            case "saturation":
            return `${filterSliderValue.saturation + filterSliderValue.temperature / 200}`;
            case "hue":
            return `${filterSliderValue.temperature * 0.5}deg`;
            default:
            return "";
        }
    }

    function addDecoration(decoration){
        const newId = currentId.current++
        setDecorations((prev)=>[...prev, {...decoration, id: newId, x:200, y:200 }])
        setSelectedDecorations(newId)
    }
    
    function decorationUploadCallback(imageDataUrl){
        const img = new Image();
        img.onload = () => {
            const customDecoration = {
                name: "custom-decoration",
                type: "decoration",
                url: imageDataUrl,
                width: 100,
                height: img.height / img.width * 100
            }
            addDecoration(customDecoration);
            img.onload = null; 
            img.src = "";
        };
        img.src = imageDataUrl;
    }

    function handleCustomImageUpload(e, callback){
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setError({type:"file", msg:"❌上传失败。请选择图片文件。"})
            return;
        }
        if (file.size > 20 * 1024 * 1024) {
            setError({type:"file", msg:"❌上传失败。请选择20MB以下的图片文件。"})
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const imageDataUrl = event.target?.result;
            callback(imageDataUrl)
        }
        reader.readAsDataURL(file);
    }

    function deleteDecoration(id){
        setSelectedDecorations(null);
        setDecorations((prev)=>prev.filter((decor)=>decor.id!=id))
    }

    function handleDeleteAll(){
        setDecorations([])
        setIsRemoveAllShown(false)
        setSelectedDecorations(null)
    }

    function deleteAllToggle(){
        setIsRemoveAllShown(prev=>!prev)
    }

    function handleShowHelp(){
        setHelpStep(0)
        setShowHelp(true)
    }

    function helpStepOnClick(){
        if(helpStep == helpConfig.length-1){
            handleCloseHelp()
        }else{
            setHelpStep(prev=>prev+1);
        }
    }

    const handleCloseHelp = contextSafe(()=>{
        gsap.set(helpConfig[helpStep].highlight, {
            zIndex: 0,
            clearProps: "filter",
        })
        setShowHelp(false)
    })

    useGSAP(()=>{
        if(showHelp){
            gsap.set(".tabs-container", {
                clearProps: "transform"
            })
            gsap.set(helpConfig[helpStep].highlight, {
                zIndex: 150,
                filter: "drop-shadow(0 0 7.5px rgb(var(--saki-color)))",
                onComplete: function() {
                    this.targets()[0].scrollIntoView({behavior: 'smooth',  block: 'nearest' })
                }
            })
            if(helpStep>0){
                gsap.set(helpConfig[helpStep-1].highlight, {
                zIndex: 0,
                clearProps: "filter",
                })
            }
        }
    }, {dependencies: [helpStep, showHelp]})

    if(error && error.type == "fetch"){
        return(
            <div>{error.msg}</div>
        )
    }

    return (
        <div className='photobooth-page flex flex-col'
            onClick={(e)=>{
            // if (e.target.dataset.drag)
                setSelectedDecorations(null)
            }}>
            <audio
                src="/assets/sound-effects/camera-shutter-click-08.mp3" 
                ref={shutterAudioRef}>
            </audio>
            <div 
                className='photo-booth-canvas-container flex flex-col' 
                style={{
                    "--background-image": `url(${background})`,
                    "--brightness": getFilterValue("brightness"),
                    "--contrast": getFilterValue("contrast"),
                    "--saturation": getFilterValue("saturation"),
                    "--hue": getFilterValue("hue"),
                }}
                ref={canvasContainerRef}
                >
                <div id='flash-overlay'></div>
                <div className='prop-container' ref={propContainerRef}>
                    {decorations.map((decoration, index)=>(
                        <Decorations 
                            key={decoration.id}
                            url={decoration.url}
                            svg={decoration.svg}
                            textConfig={decoration.textConfig}
                            selected={selectedDecorations}
                            id={decoration.id}
                            // rotation={decoration.rotation}
                            width={decoration.width}
                            height={decoration.height}
                            canvasContainerRef = {canvasContainerRef}
                            onClick={()=>{
                                setSelectedDecorations(decoration.id)
                            }}
                            onDelete={()=>deleteDecoration(decoration.id)}
                        />))
                    }
                </div>
                    <L2dCanvas 
                        character={character} 
                        width={1200} height={1400} 
                        className='photo-booth-canvas'
                        live2DConfigs={live2DConfigs}
                        ref={l2dCanvasRef}
                    />
                    {loading&&
                        <div>
                            <Spinner />
                        </div>
                    }
            </div>

            <div className='flex flex-col tools-section'>
                <div className='tabs-container flex'>
                    <div className = "tabs flex flex-col model-tab" ref={activeTab == "model"? activeTabRef: null}>
                        <div className="flex character-selection">
                            <span className='back-button flex' onClick={()=>{switchSubsection("home")}}>
                                <svg className = "back-button-svg" id='home' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                    <path d="M240 6.1c9.1-8.2 22.9-8.2 32 0l232 208c9.9 8.8 10.7 24 1.8 33.9s-24 10.7-33.9 1.8l-8-7.2 0 205.3c0 35.3-28.7 64-64 64l-288 0c-35.3 0-64-28.7-64-64l0-205.3-8 7.2c-9.9 8.8-25 8-33.9-1.8s-8-25 1.8-33.9L240 6.1zm16 50.1L96 199.7 96 448c0 8.8 7.2 16 16 16l48 0 0-104c0-39.8 32.2-72 72-72l48 0c39.8 0 72 32.2 72 72l0 104 48 0c8.8 0 16-7.2 16-16l0-248.3-160-143.4zM208 464l96 0 0-104c0-13.3-10.7-24-24-24l-48 0c-13.3 0-24 10.7-24 24l0 104z"/>                                </svg>
                                <svg className = "back-button-svg" id='back' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                    <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288 544 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-434.7 0 73.4-73.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-128 128z"/>
                                </svg>
                            </span>
                            <div className='character-toggle flex'>
                                <button className={"character-toggle-button"} onClick={()=>{selectCharacter(0)}}>Anon</button>
                                <button className={"character-toggle-button"} onClick={()=>{selectCharacter(1)}}>Saki</button>
                                <div className='pill'></div>
                            </div>
                            <button className='tools-section-buttons' id={"pause-button"} onClick={()=>{toggleCharacter(selectedCharacter)}}>{live2DConfigs[selectedCharacter].paused?"继续live2d":"暂停live2d"}</button>
                        </div>
                        <div className='subsection-container'>
                            {activeSubsection == "home" &&
                                <div className='tools-subsections home-subsection flex'>
                                    {subsections.map((section, index)=>(
                                        <div 
                                            key={index} 
                                            className='home-subsection-icon flex flex-col'
                                            id={section.name}
                                            onClick={()=>switchSubsection(section.name)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox={section.viewBox?section.viewBox:"0 0 512 512"}>
                                                <path d={section.path} />
                                            </svg>
                                            {section.display}
                                        </div>
                                    ))}
                                </div>
                            }
                            {activeSubsection == "position" && 
                            <div className='tools-subsections flex flex-col position-subsection'>
                                {positionSliders.map((slider)=>{
                                    const defaultValue = (selectedCharacter == 1 && slider.key == "positionX")? -0.65: slider.default
                                    return(
                                        <Slider 
                                            key={slider.key}
                                            config={{...slider, value: live2DConfigs[selectedCharacter][slider.key]}}
                                            onChange={(e)=>changeCharacterConfig(slider.key, e.target.value)} 
                                            reset={(e)=>changeCharacterConfig(slider.key, defaultValue)}
                                        />
                                )})}
                                    {/* <div className='flex input-container'>
                                        <span>朝向X轴:</span>
                                        <input type="range" 
                                            onChange={(e)=>changeCharacterConfig("faceDirectionX", e.target.value)} 
                                            min={-1}
                                            max={1}
                                            step={0.01}
                                            value={live2DConfigs[selectedCharacter].faceDirectionX}
                                            />
                                        <button className={""} onClick={(e)=>changeCharacterConfig( "faceDirectionX", 0)}> 
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M65.9 228.5c13.3-93 93.4-164.5 190.1-164.5 53 0 101 21.5 135.8 56.2 .2 .2 .4 .4 .6 .6l7.6 7.2-47.9 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 53.4-11.3-10.7C390.5 28.6 326.5 0 256 0 127 0 20.3 95.4 2.6 219.5 .1 237 12.2 253.2 29.7 255.7s33.7-9.7 36.2-27.1zm443.5 64c2.5-17.5-9.7-33.7-27.1-36.2s-33.7 9.7-36.2 27.1c-13.3 93-93.4 164.5-190.1 164.5-53 0-101-21.5-135.8-56.2-.2-.2-.4-.4-.6-.6l-7.6-7.2 47.9 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 320c-8.5 0-16.7 3.4-22.7 9.5S-.1 343.7 0 352.3l1 127c.1 17.7 14.6 31.9 32.3 31.7S65.2 496.4 65 478.7l-.4-51.5 10.7 10.1c46.3 46.1 110.2 74.7 180.7 74.7 129 0 235.7-95.4 253.4-219.5z"/></svg>
                                        </button>
                                    </div>
                                    <div className='flex input-container'>
                                        <span>朝向Y轴:</span>
                                        <input type="range" 
                                            onChange={(e)=>changeCharacterConfig( "faceDirectionY", e.target.value)} 
                                            min={-1}
                                            max={1}
                                            step={0.01}
                                            value={live2DConfigs[selectedCharacter].faceDirectionY}
                                            />
                                        <button className={""} onClick={(e)=>changeCharacterConfig("faceDirectionY", 0)}> 
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M65.9 228.5c13.3-93 93.4-164.5 190.1-164.5 53 0 101 21.5 135.8 56.2 .2 .2 .4 .4 .6 .6l7.6 7.2-47.9 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 53.4-11.3-10.7C390.5 28.6 326.5 0 256 0 127 0 20.3 95.4 2.6 219.5 .1 237 12.2 253.2 29.7 255.7s33.7-9.7 36.2-27.1zm443.5 64c2.5-17.5-9.7-33.7-27.1-36.2s-33.7 9.7-36.2 27.1c-13.3 93-93.4 164.5-190.1 164.5-53 0-101-21.5-135.8-56.2-.2-.2-.4-.4-.6-.6l-7.6-7.2 47.9 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 320c-8.5 0-16.7 3.4-22.7 9.5S-.1 343.7 0 352.3l1 127c.1 17.7 14.6 31.9 32.3 31.7S65.2 496.4 65 478.7l-.4-51.5 10.7 10.1c46.3 46.1 110.2 74.7 180.7 74.7 129 0 235.7-95.4 253.4-219.5z"/></svg>
                                        </button>
                                    </div>
                                    <div className='flex input-container'>
                                        <span>位置X轴:</span>
                                        <input type="range" 
                                            onChange={(e)=>changeCharacterConfig("positionX", e.target.value)} 
                                            min={-1.75}
                                            max={-0.25}
                                            step={0.01}
                                            value={live2DConfigs[selectedCharacter].positionX}
                                            />                            
                                        <button className={""} onClick={()=>changeCharacterConfig( "positionX", selectedCharacter==0?-1.35: -0.65)}> 
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M65.9 228.5c13.3-93 93.4-164.5 190.1-164.5 53 0 101 21.5 135.8 56.2 .2 .2 .4 .4 .6 .6l7.6 7.2-47.9 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 53.4-11.3-10.7C390.5 28.6 326.5 0 256 0 127 0 20.3 95.4 2.6 219.5 .1 237 12.2 253.2 29.7 255.7s33.7-9.7 36.2-27.1zm443.5 64c2.5-17.5-9.7-33.7-27.1-36.2s-33.7 9.7-36.2 27.1c-13.3 93-93.4 164.5-190.1 164.5-53 0-101-21.5-135.8-56.2-.2-.2-.4-.4-.6-.6l-7.6-7.2 47.9 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 320c-8.5 0-16.7 3.4-22.7 9.5S-.1 343.7 0 352.3l1 127c.1 17.7 14.6 31.9 32.3 31.7S65.2 496.4 65 478.7l-.4-51.5 10.7 10.1c46.3 46.1 110.2 74.7 180.7 74.7 129 0 235.7-95.4 253.4-219.5z"/></svg>
                                        </button>
                                    </div>
                                    <div className='flex input-container'>
                                        <span>位置Y轴:</span>
                                        <input type="range" 
                                            onChange={(e)=>changeCharacterConfig( "positionY", e.target.value)} 
                                            min={0.55}
                                            max={1.55}
                                            step={0.01}
                                            value={live2DConfigs[selectedCharacter].positionY}
                                            />
                                        <button className={""} onClick={()=>changeCharacterConfig("positionY", 1.15)}> 
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M65.9 228.5c13.3-93 93.4-164.5 190.1-164.5 53 0 101 21.5 135.8 56.2 .2 .2 .4 .4 .6 .6l7.6 7.2-47.9 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 53.4-11.3-10.7C390.5 28.6 326.5 0 256 0 127 0 20.3 95.4 2.6 219.5 .1 237 12.2 253.2 29.7 255.7s33.7-9.7 36.2-27.1zm443.5 64c2.5-17.5-9.7-33.7-27.1-36.2s-33.7 9.7-36.2 27.1c-13.3 93-93.4 164.5-190.1 164.5-53 0-101-21.5-135.8-56.2-.2-.2-.4-.4-.6-.6l-7.6-7.2 47.9 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 320c-8.5 0-16.7 3.4-22.7 9.5S-.1 343.7 0 352.3l1 127c.1 17.7 14.6 31.9 32.3 31.7S65.2 496.4 65 478.7l-.4-51.5 10.7 10.1c46.3 46.1 110.2 74.7 180.7 74.7 129 0 235.7-95.4 253.4-219.5z"/></svg>
                                        </button>
                                    </div> */}
                                    <button className={"tools-section-buttons"} onClick={resetConfig}> 
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M65.9 228.5c13.3-93 93.4-164.5 190.1-164.5 53 0 101 21.5 135.8 56.2 .2 .2 .4 .4 .6 .6l7.6 7.2-47.9 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 53.4-11.3-10.7C390.5 28.6 326.5 0 256 0 127 0 20.3 95.4 2.6 219.5 .1 237 12.2 253.2 29.7 255.7s33.7-9.7 36.2-27.1zm443.5 64c2.5-17.5-9.7-33.7-27.1-36.2s-33.7 9.7-36.2 27.1c-13.3 93-93.4 164.5-190.1 164.5-53 0-101-21.5-135.8-56.2-.2-.2-.4-.4-.6-.6l-7.6-7.2 47.9 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 320c-8.5 0-16.7 3.4-22.7 9.5S-.1 343.7 0 352.3l1 127c.1 17.7 14.6 31.9 32.3 31.7S65.2 496.4 65 478.7l-.4-51.5 10.7 10.1c46.3 46.1 110.2 74.7 180.7 74.7 129 0 235.7-95.4 253.4-219.5z"/></svg>
                                        重置所有
                                    </button>
                                </div>
                            }
                            {activeSubsection == "motion" && 
                                <div className='tools-subsections  motion-subsection'>
                                    {Object.keys(modelData[selectedCharacter].motions).map((motion, index)=>(
                                        <SectionButtons 
                                            key={`${selectedCharacter}-${index}`} 
                                            onClick={()=>handleMotionOnClick(motion)} 
                                            displayText={modelData[selectedCharacter].motions[motion][0].display_name}
                                            image = {modelData[selectedCharacter].motions[motion][0].image}
                                            active = {live2DConfigs[selectedCharacter].motion === motion}
                                            />
                                    ))}
                                </div>}
                            {activeSubsection == "expression" && 
                                <div className='tools-subsections expression-subsection'>
                                    {modelData[selectedCharacter].expressions.map((expression, index)=>(
                                        <SectionButtons 
                                            key={`${selectedCharacter}-${index}`} 
                                            onClick={()=>changeCharacterConfig("expression", expression.name)} 
                                            displayText={expression.display_name}
                                            image = {expression.image}
                                            active = {live2DConfigs[selectedCharacter].expression === expression.name}
                                            />
                                    ))}
                            </div>}
                            {activeSubsection == "cloth" && 
                                <div className='tools-subsections cloth-subsection'>
                                    {
                                    Object.entries(MODEL_PATHS).map(([key, model])=>{
                                        return(
                                        <SectionButtons
                                            key={key}
                                            onClick={()=>changeCloth(key)}
                                            displayText={model.display_name}
                                            image={model.imgUrl}
                                            active={character == key}
                                        />
                                    )})
                                    }
                            </div>}
                        </div>
                    </div>
                    <div className = "tabs decor-tab" ref={activeTab == "model"? activeTabRef: null}>
                        <div
                            className='decoration-detailed-control flex flex-col'
                            style={{
                                "--height": selectedDecorations!==null? "100%":"0%",
                                "--borderWidth": selectedDecorations!==null? "1px": "0px",
                            }}
                        > 
                            {/* {portal destination} */}
                        </div> 
                        <div className='tools-subsections decor-subsection'>
                            <SectionButtons 
                                key={"delete-all"}
                                onClick={deleteAllToggle}
                                displayText={"清空所有"}
                                svg={(
                                    <svg
                                        fill="#000000"
                                        viewBox="-6.51 0 122.88 122.88"
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlSpace="preserve"
                                        >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M50.04,48.8l11.91-0.04c2.15-0.01,3.62,0.38,5.03,2.24L70.35,57l3.41-2.11l-5.87,10.27L56,65.11l3.63-2.11
                                            l-6.12-10.36c-0.58-0.98-1-1.76-1.84-2.58C51.18,49.58,50.62,49.16,50.04,48.8z
                                            M52.91,98.61l-11.43,0.02c-2.53-0.39-4.15-1.76-4.63-3.67c-0.42-1.65-0.01-2.41,0.71-3.83
                                            c0.85-1.69,1.86-3.32,2.83-4.97l12.65,0.04L52.91,98.61z
                                            M34.71,94.16l-5.99-10.29c-1.08-1.86-1.48-3.33-0.58-5.48l3.52-5.91l-3.53-1.9
                                            l11.83-0.05l5.9,10.31l-3.64-2.09l-5.91,10.48
                                            c-0.56,0.99-1.03,1.75-1.31,2.88C34.83,92.79,34.74,93.47,34.71,94.16z
                                            M75.98,67.25l5.73,9.88c0.93,2.38,0.55,4.47-0.86,5.84
                                            c-1.22,1.18-2.08,1.21-3.67,1.3c-1.89,0.11-3.81,0.05-5.72,0.03
                                            l-6.29-10.98L75.98,67.25z
                                            M81.22,85.24L75.3,95.57c-1.07,1.87-2.14,2.95-4.45,3.24l-6.88-0.09l0.12,4
                                            l-5.95-10.22l5.98-10.27l0.01,4.2l12.03-0.12
                                            c1.14-0.01,2.03,0.01,3.15-0.3C79.98,85.83,80.61,85.56,81.22,85.24z
                                            M37.09,62.33l5.69-9.91c1.6-2,3.6-2.71,5.49-2.18
                                            c1.63,0.46,2.09,1.2,2.96,2.53c1.04,1.59,1.95,3.28,2.89,4.94
                                            l-6.37,10.94L37.09,62.33z
                                            M4.02,9.36h35.47V5.4c0-1.49,0.61-2.84,1.58-3.81
                                            C42.06,0.61,43.41,0,44.89,0h20.54c1.49,0,2.83,0.61,3.81,1.58
                                            c0.98,0.98,1.58,2.33,1.58,3.81v3.97h35.02
                                            c1.1,0,2.11,0.45,2.84,1.19c0.73,0.73,1.18,1.73,1.18,2.84v11.19H0V13.38
                                            c0-1.1,0.45-2.11,1.18-2.84C1.91,9.82,2.92,9.36,4.02,9.36z
                                            M41.23,12.84H4.02c-0.15,0-0.29,0.06-0.38,0.15
                                            c-0.1,0.1-0.16,0.24-0.16,0.39v9.45h102.9v-9.45
                                            c0-0.15-0.06-0.29-0.16-0.39c-0.09-0.09-0.23-0.15-0.38-0.15H69.08
                                            V5.39c0-0.52-0.22-1-0.56-1.35c-0.35-0.35-0.82-0.56-1.35-0.56H44.89
                                            c-0.53,0-1.01,0.21-1.35,0.56c-0.35,0.35-0.56,0.83-0.56,1.35v7.45z
                                            M10.18,28.77h90.29c1.24,0.11,2.4,0.67,3.25,1.5
                                            c0.89,0.88,1.46,2.06,1.46,3.38l-7.64,83.78
                                            c-0.12,1.37-0.71,2.62-1.62,3.53
                                            c-0.91,0.91-2.13,1.47-3.53,1.47h-75.11
                                            c-1.4,0-2.62-0.56-3.54-1.47
                                            c-0.91-0.91-1.49-2.17-1.62-3.54L5.03,34.08
                                            c0-1.32,0.57-2.5,1.46-3.38
                                            c0.85-0.83,2.01-1.39,3.26-1.5z"
                                        />
                                    </svg>
                                  )}
                             />
                            <FileUploadButton handleCustomImageUpload={(e)=>handleCustomImageUpload(e, decorationUploadCallback)}/>
                            {DECORATION_TEMPLATES.map(decoration=>(
                                <SectionButtons 
                                    key={decoration.id}
                                    onClick={(e)=>{
                                        e.stopPropagation();
                                        addDecoration(decoration)
                                    }}
                                    displayText={decoration.name}
                                    image={decoration.url}
                                    svg={decoration.svg}
                                    textConfig={decoration.textConfig}
                                />
                            ))}
                        </div>
                    </div>
                    <div className = "tabs background-tab" ref={activeTab == "model"? activeTabRef: null}>
                        <div className='tools-subsections background-subsection'>
                            <FileUploadButton handleCustomImageUpload={(e)=>handleCustomImageUpload(e, setBackground)}/>
                            {BACKGROUNDS.map((background, index)=>(
                                <SectionButtons
                                    key={index}
                                    onClick={()=>setBackground(background.url)
                                    }
                                    displayText = {background.name}
                                    image={background.url}
                                />
                            ))}
                        </div>
                    </div>
                    <div className = "tabs flex flex-col filter-tab" ref={activeTab == "model"? activeTabRef: null}>
                        {filterSliders.map((slider, index)=>(
                            <Slider 
                                key={index} 
                                config={{...slider, value: filterSliderValue[slider.key]}}
                                onChange={(e)=>{setFilterSliderValue(prev=>({...prev, [slider.key]: parseFloat(e.target.value)}))}}
                                reset={()=>setFilterSliderValue(prev=>({...prev, [slider.key]:slider.default}))}
                            />
                        ))}
                        <div className='filter-subsection'>
                            {FILTER_PRESET.map((preset, index)=>(
                                <SectionButtons
                                key={index}
                                displayText={preset.name}
                                image={preset.imgUrl}
                                onClick={()=>setFilterSliderValue({...preset.values})}
                                /> 
                            ))}
                        </div>
                    </div>
                </div>
                <div className='flex tab-selector'>
                    <div 
                        className={`tab-selector-button ${activeTab == "model"? "active":""}`}
                        onClick={()=>{activeTab == "model" ? switchSubsection("home"):changeTab("model")}}
                        >
                        <svg className="selection-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M464 256a208 208 0 1 0 -416 0 208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0zm177.3 63.4C192.3 335 218.4 352 256 352s63.7-17 78.7-32.6c9.2-9.6 24.4-9.9 33.9-.7s9.9 24.4 .7 33.9c-22.1 23-60 47.4-113.3 47.4s-91.2-24.4-113.3-47.4c-9.2-9.6-8.9-24.8 .7-33.9s24.8-8.9 33.9 .7zM144 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm164 8c0 11-9 20-20 20s-20-9-20-20c0-33.1 26.9-60 60-60l16 0c33.1 0 60 26.9 60 60 0 11-9 20-20 20s-20-9-20-20-9-20-20-20l-16 0c-11 0-20 9-20 20z"/></svg>
                        模型</div>
                    <div 
                        className={`tab-selector-button ${activeTab == "decor"? "active":""}`}
                        onClick={()=>changeTab("decor")}
                        >
                        <svg className="selection-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2399 2399"><path className="fil0" d="M997 1050c-149 173.4375-338 356.25-594 320.3125-154 121.875-295 256.25-402 398.4375 187 104.6875 185 92.1875 417 39.0625-9 229.6875-57 401.5625-51 595.3125 237-356.25 556-701.5625 742-1226.5625-92-98.4375-55-64.0625-111-126.5625zm406-10.9375c149 173.4375 338 356.25 594 320.3125 154 121.875 295 256.25 402 398.4375-187 104.6875-185 92.1875-417 39.0625 9 229.6875 57 401.5625 51 595.3125-237-356.25-556-701.5625-742-1226.5625 92-98.4375 55-64.0625 111-126.5625zm1-542.1875c255-451.5625 905-901.5625 746 135.9375 167 787.5-318 859.375-729 343.75 35-171.875 20-346.875-16-478.125zm-43 0c-38-114.0625-299-120.3125-337 0-38 120.3125-42 389.0625 0 507.8125 42 118.75 294 123.4375 337 0 43-123.4375 38-393.75 0-507.8125zm-380 0c-255-451.5625-905-901.5625-746 135.9375-167 787.5 324 853.125 735 335.9375-35-171.875-26-339.0625 10-471.875z"/></svg>
                        装饰</div>
                    <div 
                        className={`tab-selector-button ${activeTab == "background"? "active":""}`}
                        onClick={()=>changeTab("background")}
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zm64 80a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM272 224c8.4 0 16.1 4.4 20.5 11.5l88 144c4.5 7.4 4.7 16.7 .5 24.3S368.7 416 360 416L88 416c-8.9 0-17.2-5-21.3-12.9s-3.5-17.5 1.6-24.8l56-80c4.5-6.4 11.8-10.2 19.7-10.2s15.2 3.8 19.7 10.2l26.4 37.8 61.4-100.5c4.4-7.1 12.1-11.5 20.5-11.5z"/></svg>
                        背景</div>
                    <div 
                        className={`tab-selector-button ${activeTab == "filter"? "active":""}`}
                        onClick={()=>changeTab("filter")}
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M263.4-27L278.2 9.8 315 24.6c3 1.2 5 4.2 5 7.4s-2 6.2-5 7.4L278.2 54.2 263.4 91c-1.2 3-4.2 5-7.4 5s-6.2-2-7.4-5L233.8 54.2 197 39.4c-3-1.2-5-4.2-5-7.4s2-6.2 5-7.4L233.8 9.8 248.6-27c1.2-3 4.2-5 7.4-5s6.2 2 7.4 5zM110.7 41.7l21.5 50.1 50.1 21.5c5.9 2.5 9.7 8.3 9.7 14.7s-3.8 12.2-9.7 14.7l-50.1 21.5-21.5 50.1c-2.5 5.9-8.3 9.7-14.7 9.7s-12.2-3.8-14.7-9.7L59.8 164.2 9.7 142.7C3.8 140.2 0 134.4 0 128s3.8-12.2 9.7-14.7L59.8 91.8 81.3 41.7C83.8 35.8 89.6 32 96 32s12.2 3.8 14.7 9.7zM464 304c6.4 0 12.2 3.8 14.7 9.7l21.5 50.1 50.1 21.5c5.9 2.5 9.7 8.3 9.7 14.7s-3.8 12.2-9.7 14.7l-50.1 21.5-21.5 50.1c-2.5 5.9-8.3 9.7-14.7 9.7s-12.2-3.8-14.7-9.7l-21.5-50.1-50.1-21.5c-5.9-2.5-9.7-8.3-9.7-14.7s3.8-12.2 9.7-14.7l50.1-21.5 21.5-50.1c2.5-5.9 8.3-9.7 14.7-9.7zM460 0c11 0 21.6 4.4 29.5 12.2l42.3 42.3C539.6 62.4 544 73 544 84s-4.4 21.6-12.2 29.5l-88.2 88.2-101.3-101.3 88.2-88.2C438.4 4.4 449 0 460 0zM44.2 398.5L308.4 134.3 409.7 235.6 145.5 499.8C137.6 507.6 127 512 116 512s-21.6-4.4-29.5-12.2L44.2 457.5C36.4 449.6 32 439 32 428s4.4-21.6 12.2-29.5z"/></svg>
                        滤镜</div>
                </div>
            </div>
            <div className='sticky-note-popup'>
                <div className='popup-backdrop' onClick={(e)=>{
                    e.stopPropagation();
                    setError(null)
                    setPopupAnimationState("closing")}
                }></div>
                <div className='photo-popup polaroid-container' onClick={(e)=>{e.preventDefault(); e.stopPropagation()}}>
                    <img src={generatedImage} key={generatedImage}></img>
                    <div className='photo-popup-buttons-container flex'>
                        <button className='photo-popup-buttons'
                            onClick={handleDownload}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-242.7c0-4.2-1.7-8.3-4.7-11.3L320 86.6 320 176c0 17.7-14.3 32-32 32l-160 0c-17.7 0-32-14.3-32-32l0-96-32 0zm80 0l0 80 128 0 0-80-128 0zM0 96C0 60.7 28.7 32 64 32l242.7 0c17 0 33.3 6.7 45.3 18.7L429.3 128c12 12 18.7 28.3 18.7 45.3L448 416c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM160 320a64 64 0 1 1 128 0 64 64 0 1 1 -128 0z"/></svg>
                            保存</button>
                        <button className='photo-popup-buttons'
                            onClick={handleShare}
                            >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M425.5 7c-6.9-6.9-17.2-8.9-26.2-5.2S384.5 14.3 384.5 24l0 56-48 0c-88.4 0-160 71.6-160 160 0 46.7 20.7 80.4 43.6 103.4 8.1 8.2 16.5 14.9 24.3 20.4 9.2 6.5 21.7 5.7 30.1-1.9s10.2-20 4.5-29.8c-3.6-6.3-6.5-14.9-6.5-26.7 0-36.2 29.3-65.5 65.5-65.5l46.5 0 0 56c0 9.7 5.8 18.5 14.8 22.2s19.3 1.7 26.2-5.2l136-136c9.4-9.4 9.4-24.6 0-33.9L425.5 7zm7 97l0-22.1 78.1 78.1-78.1 78.1 0-22.1c0-13.3-10.7-24-24-24L338 192c-50.9 0-93.9 33.5-108.3 79.6-3.3-9.4-5.2-19.8-5.2-31.6 0-61.9 50.1-112 112-112l72 0c13.3 0 24-10.7 24-24zm-320-8c-44.2 0-80 35.8-80 80l0 256c0 44.2 35.8 80 80 80l256 0c44.2 0 80-35.8 80-80l0-24c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 24c0 17.7-14.3 32-32 32l-256 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l24 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-24 0z"/></svg>
                            分享</button>
                    </div>
                </div>
            </div>
           {(!isFlashing && isGenerating) && 
           <div className='loading-popup'>
                <Spinner> 
                    <p>生产图片中...</p>
                    <p>可能会消耗1-10秒时间</p>
                </Spinner>
            </div>}

            <PopUpModal showModal={isRemoveAllShown} closeModal={deleteAllToggle}>
                <p>确定要忘却一切吗？</p>
                <div className='flex pwa-buttons'>
                    <button className='menu-button' onClick={handleDeleteAll}>
                        确定
                    </button>
                    <button className='menu-button' onClick={deleteAllToggle}>
                        取消
                    </button>
                </div>
            </PopUpModal>
            
            <PopUpModal 
                showModal={showHelp} 
                closeModal={helpStepOnClick}
                className={"photo-help-modal flex flex-col"}
                style={{"--height":helpConfig[helpStep].height}}
                >
                <p>
                    {helpConfig[helpStep].text}
                </p>
                <div className='flex pwa-buttons'>
                    {helpStep!=helpConfig.length-1 && <button className='menu-button' onClick={helpStepOnClick}>
                        下一步
                    </button>}
                    <button className='menu-button' onClick={handleCloseHelp}>
                        关闭
                    </button>
                    <span className='help-count'>{helpStep+1} / {helpConfig.length}</span>
                </div>
            </PopUpModal>

            <Toast message={error?.msg} active={error}/>
        </div>
    )
    }

export default PhotoBoothPage