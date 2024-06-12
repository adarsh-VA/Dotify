import React, { useEffect } from 'react'
import PlaylistTabChild from './playlistTabChild'
import { useDispatch, useSelector } from 'react-redux'
import { backendUrl } from '../constants'
import axios from 'axios'
import { setPlaylistCategory } from '../store/reducers/playlistCategorySlice'
import { setLoading } from '../store/reducers/notificationSlice'
import Loading from './Loading'

export default function PlaylistsTab() {

  const dispatch = useDispatch();
  const playlistCategories = useSelector((state) => state.playlistCategory.playlistCategories);
  const accessToken = useSelector((state) => state.user.token);
  const isLoading = useSelector((state) => state.notification.loading);

  useEffect(() => {
    if (playlistCategories.length == 0) {
      dispatch(setLoading(true));
      axios.get(`${backendUrl}/playlists/allPlaylistsByCategory`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      })
        .then((res) => {
          dispatch(setPlaylistCategory(res.data));
          dispatch(setLoading(false));
        })
    }
  }, [])

  if (isLoading) {
    return (<Loading />);
  }


  return (
    <div className='pt-16'>
      {playlistCategories &&
        playlistCategories.map((category, idx) => {
          return <PlaylistTabChild category={category} key={idx} idx={idx} />
        })
      }
    </div>
  )
}
