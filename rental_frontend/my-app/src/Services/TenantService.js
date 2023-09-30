import { myAxios } from "./Helper";
import { getToken } from '../AuthServices/Auth';

export const getAllUser = async (user) => {
    try {
        const token = getToken();
        console.log("token:   ",token)
        const result = await myAxios.get('/user/getAll', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log("result:     ",result.data)
        return result.data;
    }
    catch (err) {
        if (err.response.status == 401) return "Unautho"
        console.log(err)
    }
};

export const deleteATenant = async (id) => {
    try {
        const token = getToken();
        await myAxios.delete(`/user/deleteUser/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }
    catch (err) {
        if (err.response.status == 401) return "Unautho"
    }
}

export const addTenant = (tenant) => {
    try {
        const token = getToken();
        return myAxios.post(`/user/create`, tenant, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((res) => res.data)
        .catch(err=>{
            if(err.response.status == '401')return 'Unautho'
        })
    }
    catch (err) {
        if (err.response.status == 401) return "Unautho"
    }
}

export const updateTenant = (tenant) => {
    try {
        const token = getToken();
        if (tenant.Bond_End_Date.indexOf('/') !== -1) {
            let date = tenant.Bond_End_Date.split("/")
            let ten = {
                id: tenant.RentId,
                rentPermonth: tenant.RentM,
                contractEndDt: `${date[2]}-${date[1]}-${date[0]}`,
                rentDate : tenant.RentDate
            }
            return myAxios.put(`/user/updateUser`, ten, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then((res) => res.data);
        }
        else {
            let ten = {
                id: tenant.RentId,
                rentPermonth: tenant.RentM,
                contractEndDt: tenant.Bond_End_Date,
                rentDate : tenant.RentDate
            }
            return myAxios.put(`/user/updateUser`, ten, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then((res) => res.data);
        }
    }
    catch (err) {
        if (err.response.status == 401) return "Unautho"
    }
}

export const getAllShopId = async () => {
    try {
        const token = getToken();
        const result = await myAxios.get('/user/getAllShopId', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return result.data;
    }
    catch (err) {
        if (err.response.status == 401) return "Unautho"
    }
};

export const getById = async (Id) => {
    try {
        const token = getToken();
        const result = await myAxios.get(`/user/getByDetailId/${Id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return result.data;
    }
    catch (err) {
        if (err.response.status == 401) return "Unautho"
    }
}

export const getTotalRent = async () => {
    try {
        const token = getToken();
        const result = await myAxios.get(`/user/TotalRentPerM`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return result.data;
    }
    catch (err) {
        if (err.response.status == 401) return "Unautho"
    }
};

export const getTotalAvanced = async () => {
    try {
        const token = getToken();
        const result = await myAxios.get(`/user/TotalAdvanced`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return result.data;
    }
    catch (err) {
        if (err.response.status == 401) return "Unautho"
    }
};

export const getDashboard = async (month) => {
    try {
        const token = getToken();
        const result = await myAxios.get(`/user/DashBoard/month/${month}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return result.data;
    }
    catch (err) {
        if (err.response.status == 401) return "Unautho"
    }
};