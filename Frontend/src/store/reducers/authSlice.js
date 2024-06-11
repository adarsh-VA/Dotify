import { createSlice, createAsyncThunk  } from '@reduxjs/toolkit';
import { backendUrl } from '../../constants';
import axios from 'axios';
import Cookies from 'js-cookie';

export const fetchUser = createAsyncThunk(async () => {
  const accessToken = Cookies.get("accessToken");
  
  if(accessToken){
    const response = await axios.get(`${backendUrl}/users/current-user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to fetch user information');
    }
  }
  else{
    return null;
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    playlists: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setPlaylists: (state, action) => {
      state.playlists = action.payload;
    },
    selectUser: (state, ) => {
      return state.user;
    },
    addUserPlaylist: (state, action) => {
      state.playlists.push(action.payload);
    },
    removeUserPlaylist: (state, action) => {
      if (state.playlists) {
          state.playlists = state.playlists.filter(playlist => playlist._id != action.payload);
      }
    },
    selectToken: (state) => {
      return state.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { setUser, setToken, selectUser, setPlaylists, addUserPlaylist, removeUserPlaylist, selectToken, logout } = authSlice.actions;
export default authSlice.reducer;
