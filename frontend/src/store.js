import { createSlice, configureStore } from "@reduxjs/toolkit";

const credentialsSlice = createSlice({
    name: "credentials",
    initialState: {
        login: window.localStorage.getItem("LOGIN"),
        password: window.localStorage.getItem("PASSWORD"),
    },
    reducers: {
        setCredentials: (state, action) => {
            window.localStorage.setItem("LOGIN", action.payload.login);
            window.localStorage.setItem("PASSWORD", action.payload.password);
            state.login = action.payload.login;
            state.password = action.payload.password;
        },
        resetCredentials: (state) => {
            window.localStorage.removeItem("LOGIN");
            window.localStorage.removeItem("PASSWORD");
            state.login = null;
            state.password = null;
        },
    },
})

export const { setCredentials, resetCredentials } = credentialsSlice.actions;

export default configureStore({
    reducer: {
        credentials: credentialsSlice.reducer,
    },
})
