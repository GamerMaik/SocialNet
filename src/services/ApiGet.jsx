import axios from 'axios'

const BASE_URL = `https://pk22ka6kj9.execute-api.us-east-2.amazonaws.com/social-communitys/admin/listUsersActives`;

const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

export function getUsers(){

    const getUserActives=async()=>{
        try {
            const response = await axiosInstance.get('listUsersActives')
            console.log(response);
            return response.data
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    return(
        {getUserActives}
    )
}
