import { myAxios } from "./Helper";

export const singUp=(user)=>{
    return myAxios.post('/api/v1/auth/register',user).then((response)=>response.data)
};

export const login=(loginDetail)=>{
    return myAxios.post('/api/v1/auth/login',loginDetail).then((response)=>response.data)
} 

export const sendotp = (gmail)=>{
    return  myAxios.post(`/api/v1/auth/user/${gmail}/sendOTP`).then((response)=>response.data)
}