import React, { useRef, useEffect, useState } from 'react'
import PlayCard from './playCard'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { setPlaylistId, setPlayerSongs, setIsPlaying, setSongId } from '../store/reducers/playerSlice';

export default function PlaylistTabChild({ category, idx }) {

  var playlists = category.playlists;
  const dispatch = useDispatch();
  const playerDetails = useSelector((state) => state.player.playerDetails);
  var ContainerRef = useRef(null);
  var [maxElements, SetMaxElements] = useState(playlists.length);
  const user = useSelector((state) => state.user.user);

  function handleResize() {
    var container = ContainerRef.current;
    var firstChild = container.querySelector(':first-child');

    if (firstChild) {
      const containerStyle = getComputedStyle(container);
      const containerWidth = container.offsetWidth + parseFloat(containerStyle.padding);
      const childWidth = firstChild.offsetWidth + parseFloat(containerStyle.columnGap);
      const count = Math.floor(containerWidth / childWidth);
      SetMaxElements(count);
    }
  }

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    //Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  async function Play(data) {
    if (playerDetails.playlistId == data._id) {
      dispatch(setIsPlaying(true));
    }
    else {
      dispatch(setPlayerSongs(data.songs));
      dispatch(setPlaylistId(data._id))
      dispatch(setSongId(data.songs[0]._id));
    }
  }

  function Pause() {
    dispatch(setIsPlaying(false));
  }

  return (
    <div className={`p-2 px-4 text-white ${idx == 0 ? "bg-gradient-to-b from-zinc-800 from-0%" : ""}`}>
      <div className='flex justify-between'>
        <Link to={`section/${category._id.categoryId}`} className='text-2xl font-bold hover:underline'>{category._id.categoryName}</Link>
        {maxElements < playlists.length && <Link to={`section/${category._id.categoryId}`} className='text-zinc-400 hover:underline'>show all</Link>}
      </div>
      <div className='grid grid-flow-col py-6 overflow-x-hidden justify-start gap-6' ref={ContainerRef}>
        {
          playlists.slice(0, maxElements).map((x) => {
            return (<PlayCard key={x._id} props={x} name='playlists' user={user} clickPlay={Play} clickPause={Pause} isPlaying={x._id == playerDetails.playlistId && playerDetails.isPlaying} />)
          })
        }
      </div>
    </div>
  )
}
