import axios from 'axios'

const API_KEY = 'ORTYRKEzJG82-ElAXNHdIHM-m123Wh93fMKp0MPVyHI'
const BASE_URL = `https://api.unsplash.com/search/photos/`;


const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

export function ImagesService(){

    const getlistImages=async(valor)=>{
        try {
            const response = await axiosInstance.get(`?client_id=${API_KEY}&query=${valor}`)
            //console.log(response);
            return response.data
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    return(
        {getlistImages}
    )
}

//Aplication ID: 621947

//Access Key: ORTYRKEzJG82-ElAXNHdIHM-m123Wh93fMKp0MPVyHI

//Secret key: ZiextCp8NXUteFwFWKoqwmGYAhsifwi7bWzC6SgWRVc
