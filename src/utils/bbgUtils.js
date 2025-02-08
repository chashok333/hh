import httpSer from "./httpSer"


export const createUser = async (values, currentUser) => {
    try {
        return httpSer.post(`users/${currentUser?.id || ''}`, {
            ...values,
        })
    } catch (err) {

    }
}