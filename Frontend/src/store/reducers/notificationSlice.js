import { createSlice } from "@reduxjs/toolkit";

const initialState={
    notification:null,
    isNotificationVisible:false,
    loading:false
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
        setLoading:(state,action) => {
            state.loading = action.payload;
        }
    }
})

export default notificationSlice.reducer;

export const {setNotification,setIsNotificationVisible,setLoading} = notificationSlice.actions;
