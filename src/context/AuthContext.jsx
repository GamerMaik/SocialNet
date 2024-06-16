import { createContext, useContext, useState } from "react";
import { UserMicroService } from '../services/UserMicroServices'
import { CommunitService } from '../services/CommunitService';
import { ImagesService } from "../services/ImagesService";
import { getUsers } from "../services/ApiGet";

// eslint-disable-next-line react-refresh/only-export-components
const AuthContext = createContext();
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        console.log('no existe el contexto');
    }
    return context;
}

// eslint-disable-next-line react/prop-types
export function AuthProvider({children}){
    const [user, setUser] = useState(() => window.sessionStorage.getItem('key'));
    const userMicroService = UserMicroService()
    const communityService = CommunitService()
    const imagesService = ImagesService()
    const apiGet = getUsers()

    //REGISTRAR NUEVO USUARIO
    const registerUserByMicroservice = async (name, email, password)=>{
        console.log(name, email, password);
        try {
            const response= await userMicroService.createUserWithNameEmailAndPassword(name, email, password);
            console.log("Respuesta AuthContext",response);
            return response;
        } catch (error) {
            console.log("Error al registrar Usuario", error);
        }
    }

    //INICIAR SESION USUARIO
    const loginUserByMicroservice = async (email, password) => {
        try {
            const response = await userMicroService.loginUserWithEmailAndPassword(email, password);
            setUser(response.token);
            window.sessionStorage.setItem("key", response.token)
            //console.log(response);
        } catch (error) {
            console.log("Error", error);
        }
    }

    //CERRAR SESION
    const logout = async () =>{
        try {
            const response = await userMicroService.logoutAccount()
            window.sessionStorage.removeItem("key")
            window.sessionStorage.removeItem("UserRol")
            window.localStorage.removeItem("IdUser")
            window.localStorage.removeItem("nameUser")
            window.localStorage.removeItem("image")
            console.log("Respuesta AuthContext", response);
        } catch (error) {
            console.error("Error", error);
        }
    }
    //OBTENER DATOS DEL PERFIL POR ID
    const getUserProfileById = async (id) =>{
        try {
            const response = await userMicroService.getProfileUserById(id)
            return response
        } catch (error) {
            console.error(error);
        }
    }

    //OBTENER LA LISTA DE PAISES

    const getCountries = async() =>{
        try {
            const response = await userMicroService.getListCountries();
            return response;
        } catch (error) {
            console.error(error);
        }
    }
    //OBTENER LA LISTA DE AVATARES
    const getlistAvatars = async () =>{
        try {
            const response = await userMicroService.getUserAvatares();
            return response;
        } catch (error) {
            console.error(error);
        }
    }
    //ACTUALIZAR DATOS DEL USUARIO
    const updateUser = async(idUser, name_user = '',name_profile = '', id_image = '', description_profile = '', image_header_profile ='', day_birth_profile= '2000-01-01T00:00:00.000Z') => {
        try {
            await userMicroService.updateDataUser(
                idUser,
                name_user,
                name_profile,
                id_image,
                description_profile,
                image_header_profile,
                day_birth_profile
            );
        } catch (error) {
            console.error(error);
        }
    }

    //ACTUALIZAR DATOS DEL USUARIO
    const updateContactInfoUser = async(idUser, phone_profile = 0, gender_profile = 'O', id_country = 1) => {
        try {
            await userMicroService.updateContactInfoUser(
                idUser,
                parseInt(phone_profile),
                gender_profile,
                parseInt(id_country),
            );
        } catch (error) {
            console.error(error);
        }
    }

    //=================>> PEDIDA DE DATOS AL FIREBASE <<================

    //OBTENER DATOS DEL TOKEN
    const dataToken = async (token) => {
        try {
            const response = await communityService.getDataToken(token);
            //console.log(response);
            return response;
        }catch(error){
            console.error("Error", error);
        }
    }
    //OBTENER TODAS LAS COMUNIDADES
    const getCommunities = async() =>{
        try {
            const response = await communityService.getCommunities();
            //console.log("Respuesta Auth",response);
            return response
        } catch (error) {
            console.error("Error Auth", error);
        }
    }

    //OBTENER COMUNIDADES QUE UN USUARIO NO SIGUE
    const getCommunitiesById = async(idUser) =>{
        try {
            const response = await communityService.getCommunitiesByIdUser(idUser);
            //console.log("Respuesta Auth",response);
            return response
        } catch (error) {
            console.error("Error Auth", error);
        }
    }
    //OBTENER COMUNIDADES QUE EL USUSARIO ESTÁ SIGUIENDO
    const getCommunitiesfollowedByIdUser = async (idUser)=>{
        try {
            const response = await communityService.getCommunitiesfollowedByIdUser(idUser);
            return response;
        } catch (error) {
            if (error.code == 'ERR_BAD_REQUEST') {
                console.log("");
            }
        }
    }
    //SEGUIR UN CANAL
    const followChannel = async (idUser, idchanel)=>{
        try {
            const response = await communityService.followChannelPreference(idUser, idchanel);
            return response
        } catch (error) {
            console.error(error);
        }
    }
    //DEJAR DE SEGUIR UN CANAL
    const unfollowChannel = async (idUser, idchanel)=>{
        try {
            await communityService.unfollowCommunityByidAndidChannel(idUser, idchanel);
        } catch (error) {
            console.error(error);
        }
    }
    //OBTENER POST DE CANALES
    const getListPost = async() =>{
        try {
            const response = await communityService.getListPost();
            return response
        } catch (error) {
            console.error(error);
        }
    }

    //OBTENER DATOS DE UN CANAL POR ID
    const getDataChannelById= async(idChannel)=>{
        try {
            const response = await communityService.getDataChannelByIdChannel(idChannel);
            return response
        } catch (error) {
            console.error(error);
        }
    }
    //OBOTENER POST DE LOS CANALES QUE SIGUE EL USUARIO
    const getPostChannelById= async(idChannel)=>{
        try {
            const response = await communityService.getPostChannelByIdChannel(idChannel);
            return response
        } catch (error) {
            console.error(error);
        }
    }
    //CREAR UN NUEVO CANAL O COMUNIDAD
    const createNewChannel = async(IdUser, nameChannel, descriptionChannel, visibilityChannel, categoryChannel)=>{
        try {
            await communityService.createChannel(IdUser, nameChannel, descriptionChannel, visibilityChannel, categoryChannel);
        } catch (error) {
            console.error(error);
        }
    }

    //OBTENER CANALES QUE UN USUARIO CREÓ
    const getCreateChannelsByIduser = async (idUser)=>{
        try {
            const response = await communityService.getCreateChannelByIdUser(idUser);
            return response
        } catch (error) {
            console.error(error);
        }
    }
    //EDITAR UN CANAL POR ID DE CANAL
    const UpdateChannelbyiD = async(idChannel, nameChannel, descriptionChannel, idUser, visibilityChannel, estateChannel, categoryChannel) =>{
        try {
            const response = await communityService.updateChannelByIdChannel(idChannel, nameChannel, descriptionChannel, idUser, visibilityChannel, estateChannel, categoryChannel);
            return response;
        } catch (error) {
            console.error(error);
        }
    }


    //OBTENER IMAGENES PRUEBA
    const getImageList=async(valor)=>{
        try {
            const response = await imagesService.getlistImages(valor);
            return response;
        } catch (error) {
            console.error(error);
        }
    }

    //PUBLICAR UN POST EN UNA COMUNIDAD
    const postPublicationInComminity = async(idChannel, contenido, imagen)=>{
        try {
            await communityService.postPublicationinChannel(idChannel, contenido, imagen);
        } catch (error) {
            console.error(error);
        }
    }

    //OBTENER REACCIONES DE LOS POST
    const getNumberReactionPost = async(idPost)=>{
        try {
            const response = communityService.getNumberReactionsPublication(idPost);
            return response
        } catch (error) {
            console.error(error);
        }
    }

    //REALIZAR UNA REACCION A UNA PUBLICACION
    const postReactions = async(idPost, idUser)=>{
        try {
            await communityService.postReactionPublication(idPost, idUser);
        } catch (error) {
            console.error(error);
        }
    }

    //OBTENER LOS COMENTRARIOS DE UN POST
    const getPostComments= async(idPost)=>{
        try {
            const response = await communityService.getCommnetsPostByIdPost(idPost);
            return response
        } catch (error) {
            console.error(error);
        }
    }

    //REALIZAR UN COMENTARIO
    const postCommentInPublication= async(idPost, isUser, contenido)=>{
        try {
            await communityService.postCommentInPublication(idPost, isUser, contenido)
        } catch (error) {
            console.error(error);
        }
    }

    //LISTAR TODOS LOS USUARIOS
    const getAlluserActive = async () =>{
        try {
            const response = await apiGet.getUserActives();
            return response
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <AuthContext.Provider value={{
                user,
                registerUserByMicroservice,
                loginUserByMicroservice,
                logout,
                dataToken,
                getCommunities,
                followChannel,
                getListPost,
                getCommunitiesById,
                unfollowChannel,
                getUserProfileById,
                getCommunitiesfollowedByIdUser,
                getCountries,
                getlistAvatars,
                updateUser,
                updateContactInfoUser,
                getDataChannelById,
                getPostChannelById,
                createNewChannel,
                getCreateChannelsByIduser,
                UpdateChannelbyiD,
                getImageList,
                postPublicationInComminity,
                getNumberReactionPost,
                postReactions,
                getPostComments,
                postCommentInPublication,
                getAlluserActive
            }}>
            {children}
        </AuthContext.Provider>
    );
}