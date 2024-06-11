import { useEffect, useState } from 'react';
import './App.css'
import { useDispatch, useSelector } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Search from './Components/Search';
import PlaylistsTab from './Components/playlistsTab';
import NotFound from './Components/NotFound';
import PlaylistSection from './Components/PlaylistSection';
import PlaylistView from './Components/PlaylistView';
import Cookies from 'js-cookie';
import axios from 'axios';
import { backendUrl } from './constants';
import { setPlaylists, setToken, setUser } from './store/reducers/authSlice';
import Login from './Components/Login';
import ArtistView from './Components/ArtistView';
import SongView from './Components/SongView';
import Register from './Components/Register';
import Main from './Components/Main';

function App() {
  const dispatch = useDispatch();
  const accessToken = Cookies.get("accessToken");
  const userData = useSelector((state) => state.user.user);
  const [isUserFetched, setIsUserFetched] = useState(false);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Main />,
      children: [
        {
          path: '',
          element: <PlaylistsTab />
        },
        {
          path: 'section/:sectionId',
          element: <PlaylistSection />
        },
        {
          path: 'playlists/:playlistId',
          element: <PlaylistView />
        },
        {
          path: 'artists/:artistId',
          element: <ArtistView />
        },
        {
          path: 'songs/:songId',
          element: <SongView />
        },
        {
          path: 'search',
          element: <Search />
        }
      ]
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/register',
      element: <Register />
    },
    {
      path: '*',
      element: <NotFound />
    }
  ]);

  const fetchUser = async () => {
    if (accessToken) {
      await axios.get(`${backendUrl}/users/current-user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => {
          dispatch(setUser(res.data.user));
          dispatch(setToken(accessToken));
          dispatch(setPlaylists(res.data.playlists.playlists));
        })
        .catch((error) => {
          console.log(error);
        });
    }
    else {
      dispatch(setUser(null));
      dispatch(setToken(null));
    }
  }

  useEffect(() => {
    fetchUser()
      .then(() => {
        setIsUserFetched(true);
      })
  }, [])

  return (
    <div className='App'>
      {isUserFetched && <RouterProvider router={router} />}
    </div>
  );
}

export default App;
