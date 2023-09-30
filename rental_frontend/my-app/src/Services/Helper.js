import axios from 'axios';
export const BASE_URL='http://localhost:7000';

export const myAxios = axios.create({
    baseURL:BASE_URL
})

export const privateAxios=axios.create({
    baseURL:BASE_URL
})
