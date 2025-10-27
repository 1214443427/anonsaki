import React, { useEffect, useState } from 'react'
import Spinner from '../components/Spinner'

function RelayPost({post}){
    // console.log(post)
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
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null);

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
                setLoading(false)
                setError("404，无法获取接力信息！")
            }
        }
        fetchData();
    }, [])




    return (
        <div className='relays-page flex flex-col relay-details-page'>
            {loading? <Spinner/>
            :
            error!=null?
            <>
                <p>{error}</p>
            </>
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