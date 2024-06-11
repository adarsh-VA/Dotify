import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import PlayCard from './playCard';
import { setPlaylistId, setPlayerSongs, setIsPlaying, setSongId } from '../store/reducers/playerSlice';
import axios from 'axios';
import { backendUrl } from '../constants';

export default function PlaylistSection() {

  const { sectionId } = useParams();
  const [playlists, setPlaylists] = useState(null);
  const [categoryName, setCategoryName] = useState(null);
  const playerDetails = useSelector((state) => state.player.playerDetails);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const accessToken = useSelector((state) => state.user.token);

  useEffect(() => {
    axios.get(`${backendUrl}/playlists/playlistsByCategory/${sectionId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    })
      .then((res) => {
        setPlaylists(res.data);
        setCategoryName(res.data[0].categories.find(item => item._id == sectionId).name);
      });
  }, [])

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
    <div className='p-3 px-4 text-white pt-16'>
      {
        playlists &&
        <>
          <h1 className='text-2xl font-bold'>{categoryName}</h1>
          <div className='flex flex-wrap gap-6 mt-4'>
            {
              playlists.map((x) => {
                return (<PlayCard key={x._id} props={x} user={user} name='playlists' clickPlay={Play} clickPause={Pause} isPlaying={x._id == playerDetails.playlistId && playerDetails.isPlaying} />)
              })
            }
          </div>
        </>
      }
    </div>
  )
}
