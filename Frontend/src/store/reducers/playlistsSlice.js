import { createSlice } from "@reduxjs/toolkit";

const initialState={
    playlists:null,
}

const playlistSlice = createSlice({
    name:'playlists',
    initialState,
    reducers:{
        setPlaylists:(state,action) => {
          state.playlists = action.payload;
        },
        getPlaylistById:(state,action) => {
          state.playlists.filter(x => x.id === parseInt(action.payload))
        },
        getPlaylistsByIds:(state,action) => {
          state.playlists = [...state.playlists.filter(playlist => action.payload.includes(playlist.id))];
        }
    }
})

export default playlistSlice.reducer;

export const {setPlaylists,getPlaylistById,getPlaylistsByIds} = playlistSlice.actions;