import axios from 'axios'

const BASE_URL = 'https://www.universal-tutorial.com/api/psvQbdhbF96ArFNHXU2X7rcPDm3ddLnvmFnvhB0xnd21X_Fgtuk3aLaRp6DSwfStOe8';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

export function CommunitService() {

    const getCommunities = async () =>{
        try {
            const response = await axiosInstance.get(BASE_URL)
            console.log(response);
            return response
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    const getListPost  = async () => {
        try {
            const response = await axiosInstance.get(`${BASE_URL}listPosts`)
            return response
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    return(
        {getCommunities, getListPost}
    )
}