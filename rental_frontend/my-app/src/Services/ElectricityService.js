import { myAxios } from "./Helper";
import { getToken } from '../AuthServices/Auth';

export const getAllUnpaidElectric = async () => {
    try {
        const token = getToken();
        let result;
        await myAxios.get('/electricity/allUnpaidElectric', {
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

export const updateElectric = async (electric, call) => {
    try {
        const token = getToken();
        let data;
        if (call === 'Complete') {
            data = {
                rentId: electric.RentId,
                month: electric.Month,
                amtPaid: electric.Amount_Left,
                year: electric.Year
            }
        }
        else {
            data = {
                rentId: electric.RentId,
                month: electric.Month,
                amtPaid: electric.Amount_Paid,
                year: electric.Year
            }
        }
        console.log("sending:  ", data)
        await myAxios.put('/electricity/updateElectric', data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }
    catch (err) {
        if (err.response.status == 401) return "Unautho"
    }
};

export const getAll = async () => {
    try {
        const token = getToken();
        const result = await myAxios.get('/electricity/getAll', {
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
        const result = await myAxios.get(`/electricity/getAllByMonthE/month/${month}/year/${year}`, {
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

export const getByIdAndMonthE = async (id, month, year) => {
    try {
        const token = getToken();
        let result;
        await myAxios.get(`/electricity/getByIdAndMonthE/${id}/month/${month}/year/${year}`, {
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

export const getTotalElect = async (month, year) => {
    try {
        const token = getToken();
        const result = await myAxios.get(`/electricity/getTotalElec/month/${month}/year/${year}`, {
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
        await myAxios.get('/electricity/allHalfPaidElectric', {
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
        const result = await myAxios.get(`/electricity/getAllElecByYear/year/${year}/rentId/${id}`, {
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

export const getTotalAmountE = async () => {
    try {
        const token = getToken();
        const result = await myAxios.get(`/electricity/total`, {
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


export const addElectric = async (electric) => {
    try {
        const token = getToken();
        let data = {
            rentId: parseInt(electric.RendId),
            amtPaid: electric.Amount,
            currReading: electric.CurrReading
        }
        await myAxios.post('/electricity/create', data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }
    catch (err) {
        if (err.response.status == 401) return "Unautho"
    }
};


