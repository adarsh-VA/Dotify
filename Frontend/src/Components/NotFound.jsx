import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function () {

  const navigate = useNavigate();

  return (
    <div className='flex flex-col justify-center items-center h-screen bg-zinc-900'>
      <div className='text-center'>
        <img src="/images/VA.png" className='mx-auto h-40' alt="" />
        <h1 className='text-white text-6xl font-semibold'>Page not found!..</h1>
        <button onClick={()=>{navigate('/')}} className='text-black text-lg font-semibold bg-green-500 px-8 rounded-full p-2 mt-5 hover:scale-105'>Home</button>
        <p className='mt-3 text-zinc-500'>Developed by <span className="bg-gradient-to-r from-[#be22ff] via-[#ff279c] to-[#ff981f] text-transparent bg-clip-text text-lg font-semibold">Adarsh Vodnala.</span> &copy; 2023 Dotify.</p>
      </div>
    </div>
  )
}
