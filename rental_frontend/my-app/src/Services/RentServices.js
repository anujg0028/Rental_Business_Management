import { myAxios } from "./Helper";
import { getToken } from '../AuthServices/Auth';



export const getAllUnpaid = async () => {
    try {
        const token = getToken();
        let result;
        await myAxios.get('/rent/allUnpaidRent', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((res) => {
            result = res.data
        })
            .catch(err => {
                if (err.response.status === 404) result = null
                if (err.response.status == 401) return "Unautho"
            })
        return result
    }
    catch (err) {
        if (err.response.status == 401) return "Unautho"
    }
};

export const updateRent = async (rent, call) => {
    const token = getToken();
    let data;
    if (call === 'Complete') {
        data = {
            rentId: rent.RentId,
            month: rent.Month,
            amtPaid: rent.Amount_Left,
            year: rent.Year
        }
    }
    else {
        data = {
            rentId: rent.RentId,
            month: rent.Month,
            amtPaid: rent.Amount_Paid,
            year: rent.Year
        }
    }
    try {
        await myAxios.put('/rent/updateRent', data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }
    catch (err) {
        if (err.response.status == '401') return "Unautho"
    }
};

export const getAll = async () => {
    try {
        const token = getToken();
        const result = await myAxios.get('/rent/getAll', {
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

export const getAllByMonth = async (month, year) => {
    try {
        const token = getToken();
        const result = await myAxios.get(`/rent/getAllByMonth/month/${month}/year/${year}`, {
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

export const getByIdAndMonth = async (id, month, year) => {
    try {
        const token = getToken();
        let result;
        await myAxios.get(`/rent/getByIdAndMonth/id/${id}/month/${month}/year/${year}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((res) => {
            result = res.data
            console.log(result)
        })
            .catch(err => {
                if (err.response.status === 404) result = null
                if (err.response.status === 401) result = "Unautho"
            })
        return result
    } catch (err) {
        if (err.response.status == 401) return "Unautho"
    }
};

export const getTotalRent = async (month, year) => {
    try {
        const token = getToken();
        const result = await myAxios.get(`/rent/getTotalRent/month/${month}/year/${year}`, {
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

export const getTotalAmountR = async () => {
    try {
        const token = getToken();
        const result = await myAxios.get(`/rent/totalAmountR`, {
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

export const getAllHalfpaid = async () => {
    try {
        const token = getToken();
        let result;
        await myAxios.get('/rent/allHalfPaidRent', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((res) => {
            result = res.data
        })
            .catch(err => {
                if (err.response.status === 404) result = null
                if (err.response.status === 401) result = "Unautho"
            })
        return result
    }
    catch (err) {
        if (err.response.status == 401) return "Unautho"
    }
};

export const getById = async (id, year) => {
    try {
        const token = getToken();
        const result = await myAxios.get(`/rent/getAllRentByYear/year/${year}/rentId/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (result.data.Data.length == 0) return null;
        return result.data;
    }
    catch (err) {
        if (err.response.status == 401) return "Unautho"
    }
};

export const addRent = async (rent) => {
    try {
        console.log(rent)
        const token = getToken();
        let data = {
            rentId: parseInt(rent.RendId),
            amtPaid: rent.Amount
        }
        await myAxios.post('/rent/create', data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }
    catch (err) {
        if (err.response.status == 401) return "Unautho"
    }
};




