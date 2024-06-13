import debounce from 'lodash.debounce';
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../constants';
import { useSelector } from 'react-redux';
import CardPreview from './CardPreview';


const debouncedSearch = debounce((query, accessToken, setPlaylists, setArtists, setSongs) => {
  axios.get(`${backendUrl}/playlists/search?q=${query}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((res) => {
      if (res.data.length > 0) {
        setPlaylists(res.data);
      }
      else {
        setPlaylists(null);
      }
    });
  axios.get(`${backendUrl}/songs/search?q=${query}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((res) => {
      if (res.data.length > 0) {
        setSongs(res.data);
      }
      else {
        setSongs(null);
      }
    });
  axios.get(`${backendUrl}/artists/search?q=${query}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((res) => {
      if (res.data.length > 0) {
        setArtists(res.data);
      }
      else {
        setArtists(null);
      }
    });
}, 300);

export default function Search() {

  const [searchParams, setSearchParams] = useSearchParams();
  const accessToken = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.user);
  const [songs, setSongs] = useState(null);
  const [artists, setArtists] = useState(null);
  const [playlists, setPlaylists] = useState(null);

  useEffect(() => {
    if (user) {
      let query = searchParams.get('q');
      debouncedSearch(query, accessToken, setPlaylists, setArtists, setSongs);
    }

    return () => {
      // Cleanup debounce on unmount
      debouncedSearch.cancel();
    };
  }, [searchParams])

  return (
    <div className='pt-16 p-4'>
      {searchParams.get('q') == null && user ?
        <div className='text-center mt-5'>
          <span className="text-7xl font-bold bg-gradient-to-r from-[#be22ff] via-[#ff279c] to-[#ff981f] text-transparent bg-clip-text">What do you want to play?</span>
        </div>
        :
        <></>
      }
      {
        !user &&
        <div className='text-center mt-5'>
          <span className="text-7xl font-bold bg-gradient-to-r from-[#be22ff] via-[#ff279c] to-[#ff981f] text-transparent bg-clip-text">Please log In to search!</span>
        </div>
      }
      {
        (artists || songs || playlists) &&

        <div className='space-y-4'>
          <h1 className='text-zinc-400 text-3xl text-center mt-4 font-semibold'> Search results...</h1>
          {playlists &&
            <div className='space-y-2'>
              <h1 className='text-white font-semibold text-2xl pl-2'>Playlists</h1>
              <div className='flex flex-wrap gap-5'>
                {
                  playlists && playlists.map((playlist) => {
                    return (<CardPreview key={playlist._id} props={playlist} linkName={'playlists'} />)
                  })
                }
              </div>
            </div>
          }
          {
            songs &&

            <div className='space-y-2'>
              <h1 className='text-white font-semibold text-2xl pl-2'>Songs</h1>
              <div className='flex flex-wrap gap-5'>
                {
                  songs && songs.map((song) => {
                    return (<CardPreview key={song._id} props={song} linkName={'songs'} />)
                  })
                }
              </div>
            </div>
          }
          {
            artists &&

            <div className='space-y-2'>
              <h1 className='text-white font-semibold text-2xl pl-2'>Artists</h1>
              <div className='flex flex-wrap gap-5'>
                {
                  artists && artists.map((artist) => {
                    return (<CardPreview key={artist._id} props={artist} linkName={'artists'} />)
                  })
                }
              </div>
            </div>
          }
        </div>

      }
    </div>
  )
}
