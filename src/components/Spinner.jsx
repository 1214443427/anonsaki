import React from 'react'

function Spinner({children}) {
  return (
    <div className='spinner-container flex'>
        <div className='spinner'></div>
        {children == null?
          <p>加载中...</p>
          :
          <>
            {children}
          </>
        }
    </div>
  )
}

export default Spinner