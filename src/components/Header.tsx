import React from 'react'

const Header = () => {
  return (
    <>
        <div className="text">
            <h1 className='bg-gradient-to-r text-4xl from-green-600 to-white bg-clip-text text-transparent'> MY EPAM Game</h1>  
            <h2 className='bg-gradient-to-t text-2xl  from-indigo-400 to-cyan-400 bg-clip-text text-transparent'  >Race Async</h2>
        </div>
        <div className="buttons">
            <button>Garage</button>
            <button>Winners</button>
        </div>
    </>
            
  )

}

export default Header