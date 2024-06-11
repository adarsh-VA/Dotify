import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { firebaseImgUrl } from '../constants';


export default function PlayCard({ props, name, user, clickPlay, clickPause, isPlaying }) {

  const navigate = useNavigate();

  function handlePlay(e) {
    e.preventDefault();
    user ? clickPlay(props) : navigate('/login');
  }

  function handlePause(e) {
    e.preventDefault();
    clickPause();
  }

  function truncateString(str) {
    // If the length of str is less than or equal to num
    // just return str--don't truncate it.
    if (str.length <= 40) {
      return str
    }
    // Return str truncated with '...' concatenated to the end of str.
    return str.slice(0, 40) + '...'
  }

  return (
    <Link to={`/${name + '/' + props._id}`} className='p-4 w-44 rounded-md bg-zinc-900 group hover:bg-zinc-800 hover:cursor-pointer hover:duration-300'>
      <div className='h-36 mb-3 shadow-[0px_4px_18px_-5px_rgb(0,0,0)] relative'>
        <img src={firebaseImgUrl(props.image)} alt="" className='w-full h-full rounded-md' />
        {
          isPlaying ?
            <button onClick={handlePause} className='absolute bottom-0 right-0 text-black bg-green-500 h-10 w-10 rounded-full m-2 hover:scale-105 drop-shadow-[0px_3px_5px_rgb(0,0,0)] opacity-100'><i className="fa-solid fa-pause" ></i> </button>
            : <button onClick={handlePlay} className={`absolute bottom-[-10px] right-0 text-black bg-green-500 h-10 w-10 rounded-full m-2 hover:scale-105 drop-shadow-[0px_3px_5px_rgb(0,0,0)] ${isPlaying ? `` : `opacity-0 group-hover:opacity-100 group-hover:duration-300 group-hover:bottom-0`}`}><i className="fa-solid fa-play"></i></button>
        }


      </div>
      <h3 className='font-bold mb-1'>{props.title}</h3>
      <p className='text-sm text-zinc-400'>{truncateString(props.description)}</p>
    </Link>
  )
}
