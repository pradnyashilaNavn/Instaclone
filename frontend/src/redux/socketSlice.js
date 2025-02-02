import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
    name:"socketio",
    initialState:{
        Socket: null
    },
    reducers:{
        // actions
        setSocket:(state, action) => {
            state.Socket = action.payload;
        }
    }
});
export const { setSocket } = socketSlice.actions;
export default socketSlice.reducer;