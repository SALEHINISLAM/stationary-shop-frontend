import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../store"
import { TUserRole } from "../../../types/users"

export type TUser={
    email:string,
    role:TUserRole,
    iat:number,
    exp:number
}

type TAuthState={
    user:null|TUser,
    token:null |string
}

const initialState:TAuthState={
    user:null,
    token:null
}

const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        setUser:(state,action)=>{
            console.log(action.payload);
            const {user,token}=action.payload
            console.log('from user',user);
            state.user=user;
            state.token=token
        },
        logOut:(state)=>{
            state.user=null
            state.token=null
        }
    }
})

export const {setUser,logOut}=authSlice.actions

export default authSlice.reducer

export const useCurrentToken=(state:RootState)=>state.auth.token;
export const useCurrentUser=(state:RootState)=>state.auth.user;