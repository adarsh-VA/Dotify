import { createSlice } from "@reduxjs/toolkit";

const initialState={
    notification:null,
    isNotificationVisible:false
}

const notificationSlice = createSlice({
    name:'notification',
    initialState,
    reducers:{
        setNotification:(state,action) => {
          state.notification = action.payload;
        },
        setIsNotificationVisible:(state,action) => {
            state.isNotificationVisible = action.payload;
        },
    }
})

export default notificationSlice.reducer;

export const {setNotification,setIsNotificationVisible} = notificationSlice.actions;
