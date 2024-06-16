import axios from 'axios'

const endpoints ={
    userCreate: 'https://create-account-microservice.onrender.com/',
    loginLogout: 'https://login-logout-microservice.onrender.com/',
    getProfileUser: 'https://list-users-microservice.onrender.com/user/getUserById/',
    getListCountries: 'https://list-users-microservice.onrender.com/listCountries',
    updateUserProfile:'https://edit-user-profile.onrender.com/user/updateProfileDetails/',
    updateContactInfo: 'https://edit-user-profile.onrender.com/user/updateContactInfo/',
    getAvatarList: 'https://list-users-microservice.onrender.com/listImages'
}

//Crear instancias de axios para cada micro servicio
const axiosInstance = {
    userCreateService: axios.create({baseURL: endpoints.userCreate}),
    loginLogoutService: axios.create({baseURL: endpoints.loginLogout}),
    getProfileUser: axios.create({baseURL: endpoints.getProfileUser}),
    getCountries: axios.create({baseURL: endpoints.getListCountries}),
    updateUser: axios.create ({baseURL: endpoints.updateUserProfile}),
    updateInfoUser: axios.create({baseURL: endpoints.updateContactInfo}),
    getAvatars: axios.create({baseURL: endpoints.getAvatarList})
}

//Funciones de servicio que utilizan las instancias de axios apropiadas
export function UserMicroService() {

    //CREAR USUARIO
    const createUserWithNameEmailAndPassword = async (name, email, password) =>{
        console.log(name, email, password);
        try {
            const response = await axiosInstance.userCreateService.post('user/create',{
                name_user: name,
                email_user: email,
                password_user: password
            });
            console.log("Response Server", response);
        } catch (error) {
            console.error("Error al Crear Usuario", error);
            throw error;
        }
    }

     //INICIAR SESION
    const loginUserWithEmailAndPassword = async (email, password) => {
        try {
            const response = await axiosInstance.loginLogoutService.post('login',{
                email_user: email,
                password_user: password
            });
            console.log("Data",response.data);
            return response.data;
        } catch (error) {
            console.error("Error al iniciar sesion", error);
            throw error;
        }
    }

    //CERRAR SESION
    const logoutAccount = async() =>{
        try {
            const response = await axiosInstance.loginLogoutService.post('logout',{});
            console.log(response.data);
            return response.data

        } catch (error) {
            console.error("Error al cerrar Sesion", error);
            throw error;
        }
    }
    //OBTENER DATOS DEL PERFIL POR ID
    const getProfileUserById = async (idUser) =>{
        try {
            const response = await axiosInstance.getProfileUser.get(`${idUser}`);
            //console.log(response.data);
            return response.data;
        } catch (error) {
            console.error("El usuario no se pudo obtener", error);
            throw error;
        }
    }

    //OBTENER LA LISTA DE PAISES
    const getListCountries = async()=>{
        try {
            const response = await axiosInstance.getCountries.get();
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    //OBTENER LOS AVATARES
    const getUserAvatares = async()=>{
        try {
            const response = await axiosInstance.getAvatars.get();
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    //ACTUALIZAR LOS DATOS DE PERFIL DE UN USAUARIO
    const updateDataUser = async (idUser, name_user ,name_profile, id_image, description_profile, image_header_profile, day_birth_profile) => {
        try {
            await axiosInstance.updateUser.put(`${idUser}`, {
                name_user: name_user,
                profile: {
                    name_profile: name_profile,
                    id_image: id_image,
                    description_profile: description_profile,
                    image_header_profile: image_header_profile,
                    day_birth_profile: day_birth_profile
                }
            });
        } catch (error) {
            console.error(error);
        }
    };
    //ACTUALIZAR LOS DATOS DE CONTACTO DE UN USAUARIO
    const updateContactInfoUser = async (idUser, phone_profile ,gender_profile , id_country ) => {
        try {
            await axiosInstance.updateInfoUser.put(`${idUser}`, {
                profile: {
                    phone_profile: phone_profile,
                    gender_profile: gender_profile,
                    id_country: id_country
                }
            });
        } catch (error) {
            console.error(error);
        }
    };
    return{
        createUserWithNameEmailAndPassword,
        loginUserWithEmailAndPassword,
        logoutAccount,
        getProfileUserById,
        getListCountries,
        getUserAvatares,
        updateDataUser,
        updateContactInfoUser
    }
}