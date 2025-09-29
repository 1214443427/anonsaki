import React, { useEffect, useState } from 'react'
import Spinner from '../components/Spinner'

function RelayPost({post}){
    console.log(post)
    return(
        <div className='post-card'>
            {post.title && <h2 className='post-title'>{post.title}</h2>}
            <p className='post-author'>{post.author}</p>
            <p className='post-snippet'>{post.snippet}</p>
        </div>
    )
}


function RelayDetailsPage({filename}) {
    const [relay, setRelay] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState();

    useEffect(()=>{
        async function fetchData(){
            try{
                setLoading(true)
                const data = await fetch(`/data/${filename}数据.json`).then(res => res.json())
                setRelay(data)
                setLoading(false)
            }
            catch (err){
                console.error('Failed to fetch data', err);
                setError("无法获取接力信息！请联系作者B站。")
            }
        }
        fetchData();
    }, [])




    return (
        <div className='relays-page flex flex-col relay-details-page'>
            {relay == null || loading? <Spinner/>
            :
            <>
                <img src='./'></img>
                <div className='relay-details-grid'>
                    {relay.posts.map((post, i)=>(<RelayPost post={post} key={i}/>))}
                </div>
            </>
            }
        </div>
    )
}

export default RelayDetailsPage