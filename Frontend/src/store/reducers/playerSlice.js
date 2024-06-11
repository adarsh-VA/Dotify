import { createSlice } from "@reduxjs/toolkit";

const initialState={
    playerDetails:{
        playlistId:null,
        artistId:null,
        songs:[],
        isPlaying:false,
        currentSongId:null
    }

}

const playerSlice = createSlice({
    name:'player',
    initialState,
    reducers:{
        setPlaylistId:(state,action) => {
          state.playerDetails.playlistId = action.payload;
        },
        setArtistId:(state,action) => {
          state.playerDetails.artistId = action.payload;
        },
        setIsPlaying:(state,action) => {
          state.playerDetails.isPlaying = action.payload;
        },
        setPlayerSongs:(state,action) => {
          state.playerDetails.songs = action.payload;
        },
        setSongId:(state, action) =>{
          state.playerDetails.currentSongId = action.payload;
        },
        removeSongFromPlayerPlaylist:(state, action) =>{
          state.playerDetails.songs = state.playerDetails.songs.filter(item => item._id != action.payload);
        },
        resetPlayer:(state) =>{
          state.playerDetails.isPlaying = false;
          state.playerDetails.artistId = null;
          state.playerDetails.songs = [];
          state.playerDetails.playlistId = null;
          state.playerDetails.currentSongId = null;
        }
    }
})


export default playerSlice.reducer;

export const {setArtistId, setPlaylistId, setIsPlaying, setPlayerSongs, setSongId, resetPlayer, removeSongFromPlayerPlaylist} = playerSlice.actions;