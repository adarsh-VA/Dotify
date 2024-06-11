import { configureStore } from "@reduxjs/toolkit";
import playlistsSlice from "./reducers/playlistsSlice";
import playerDetails from './reducers/playerSlice';
import authSlice from "./reducers/authSlice";
import playlistCategorySlice from "./reducers/playlistCategorySlice";
import notificationSlice from "./reducers/notificationSlice";


const store = configureStore({
    reducer:{
        playlist: playlistsSlice,
        playlistCategory: playlistCategorySlice,
        player:playerDetails,
        user: authSlice,
        notification: notificationSlice
    },
})

export default store;