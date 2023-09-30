//isLoggedIn=>
export const isLoggedIn = () => {
    let data = localStorage.getItem("data");
    if (data == null) return false;
    else return true;
};

//doLogin=> (data)=>set to local store
export const doLogin = (token,next) => {
    localStorage.setItem("data",JSON.stringify(token))
    next();
};

//doLogout=> remove from localstore
export const doLogout = (next) => {
    localStorage.removeItem("data");
    next();
};

//get currentUser
export const getCurrentUser = () => {
    if (isLoggedIn()) {
        return JSON.parse(localStorage.getItem("data")).user;
    }
    else return undefined;
}

//get token
export const getToken=()=>{
    if (isLoggedIn()) {
        return JSON.parse(localStorage.getItem("data")).token;
    }
    else return null;
}