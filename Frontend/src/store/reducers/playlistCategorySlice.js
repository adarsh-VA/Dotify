import { createSlice } from "@reduxjs/toolkit";
//import axios from "axios";

const initialState={
    playlistCategories:[]
}

const playlistCategorySlice = createSlice({
    name:'playlistCategory',
    initialState,
    reducers:{
        setPlaylistCategory:(state,action) => {
          state.playlistCategories = action.payload;
        },
        getCategoryById:(state,action) => {
          state.playlistCategories.filter(x => x.categoryId === parseInt(action.payload))
        }
    }
})

export default playlistCategorySlice.reducer;

export const {setPlaylistCategory,getCategoryById} = playlistCategorySlice.actions;
