import axios from 'axios'

const BASE_URL = 'https://socialcommunitys.somee.com/';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

export function CommunitService() {

    //OBTENER DATOS DEL TOKEN
    const getDataToken = async (token_user) =>{
        try {
            const response = await axiosInstance.get('api/Tokens/decodeToken',{
                params: {
                    token: token_user
                }
            })
            console.log(response.data);
            if (response.data.userId === "19") {
                window.sessionStorage.setItem("UserRol","Admin")
            }else{
                window.sessionStorage.setItem("UserRol","User")
            }
            return response.data;
        } catch (error) {
            console.error("Error al obtener Usuario", error);
            throw error;
        }
    }
    //OBTENER LAS COMUNIDADES
    const getCommunities = async () =>{
        try {
            const response = await axiosInstance.get('api/Channels')
            //console.log("Respuesta Server",response.data);
            return response.data
        } catch (error) {
            console.error();(error);
            throw error;
        }
    }
    //OBTENER COMUNIDADES QUE EL USUARIO NO SIGUE
    const getCommunitiesByIdUser = async (IdUser) => {
        try {
            const response = await axiosInstance.get(`api/Users/${IdUser}/unfollowedChannels`);
            //console.log("Respuesta Server", response.data);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    //OBTENER COMUNIDADES QUE EL USUARIO SIGUE
    const getCommunitiesfollowedByIdUser = async (IdUser) => {
        try {
            const response = await axiosInstance.get(`api/Users/${IdUser}/followedChannels`);
            //console.log("Respuesta Server", response.data);
            return response;
        } catch (error) {
            if (error.code == 'ERR_BAD_REQUEST') {
                console.log("El usuario no sigue a ninguna comunidad");
            }
            throw error;
        }
    }
    //DEJAR DE SEGUIR UN CANAL
    const unfollowCommunityByidAndidChannel = async (idUser, idChannel) =>{
        try {
            await axiosInstance.delete(`api/UserChannelSubscriptions/${idUser}/subscriptions/${idChannel}`)
        } catch (error) {
            console.error(error);
        }
    }

    //SEGUIR UN CANAL
    const followChannelPreference = async (idUser,idChannel) =>{
        try {
            await axiosInstance.post('api/UserChannelSubscriptions',{
                key: "string",
                userId: idUser,
                channelId: idChannel,
                content: "string"
            });
            return "1"
        } catch (error) {
            console.error("Error Server", error);
            throw error;
        }
    }
    //OBTENER DATOS DE UN CANAL POR ID
    const getDataChannelByIdChannel = async (idChannel)=>{
        try {
            const response = await axiosInstance.get(`api/Channels/${idChannel}/channelbychannelId`)
            //console.log(response.data[0]);
            return response.data[0]
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    //OBTENER LOS POST EN GENERAL
    const getListPost  = async () => {
        try {
            const response = await axiosInstance.get('listPosts')
            //console.log(response);
            return response.data
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    //OBTENER LOS POST DE LOSCANALES QUE SIGUE EL USUARIO
    const getPostChannelByIdChannel = async (idChannel)=>{
        try {
            const response = await axiosInstance.get(`api/Channels/${idChannel}/postsbychannel`)
            //console.log(response);
            return response.data
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    //CREAR UN CANAL NUEVO
    const createChannel = async(IdUser, nameChannel, descriptionChannel, visibilityChannel, categoryChannel)=>{
        try {
            await axiosInstance.post('api/Channels',{
                key:"string",
                name: nameChannel,
                description: descriptionChannel,
                idUser: IdUser,
                visibility: visibilityChannel,
                estate: true,
                category: categoryChannel
            })
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    //EDITAR UN CANAL EXISTENTE
    const updateChannelByIdChannel = async (idChannel, nameChannel, descriptionChannel, idUser, visibilityChannel, estateChannel, categoryChannel)=>{
        try {
            const response = await axiosInstance.put(`api/Channels/${idChannel}/channelupdate`,{
                key: "string",
                name: nameChannel,
                description: descriptionChannel,
                idUser: idUser,
                visibility: visibilityChannel,
                estate: estateChannel,
                category: categoryChannel
            })
            console.log("Error servidor",response);
            return response
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    //OBTENER LOS CANALES DE UN USUARIO POR ID USUARIO
    const getCreateChannelByIdUser = async (IdUser)=>{
        try {
            const response = await axiosInstance.get(`api/Channels/${IdUser}/channelsbyusers`)
            //console.log(response.data);
            return response.data
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    //PUBLICAR EL POST EN UN CANAL ESPECIFICO
    const postPublicationinChannel= async(idChannel, contenido, imagen)=>{
        const currentDate = new Date().toISOString();
        try {
            await axiosInstance.post('api/Posts',{
                postKey: "string",
                idChannel: idChannel,
                content: contenido,
                image: imagen,
                file: "string",
                publication_Date: currentDate,
                estate: true
            })
        } catch (error) {
            console.error(error);
            throw error
        }
    }
    //OBTENER EL NUMERO DE REACCIONES DE CADA POST
    const getNumberReactionsPublication = async(idPost)=> {
        try {
            const response = await axiosInstance.get(`api/Posts/${idPost}/reactionsbypost`)
            return response.data
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    //REALIZAR UNA REACCION AL POST
    const postReactionPublication = async(idPost, idUser)=>{
        try {
            await axiosInstance.post('api/Reactions',{
                idPost: idPost,
                reactionType: 0,
                idUser: idUser,
                estate: true
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    //OBTENER COMENTARIOS DE UN POST
    const getCommnetsPostByIdPost= async(idPost)=>{
        try {
            const response = await axiosInstance.get(`api/Posts/${idPost}/commentsbypost`);
            return response.data
        } catch (error) {
            console.error(error);
        }
    }

    //REALIZAR UN COMENTARIO A UN POST
    const postCommentInPublication= async(idPost, isUser, contenido)=>{
        const currentDate = new Date().toISOString();
        try {
            await axiosInstance.post('api/Comments',{
                idPost: idPost,
                idUser: isUser,
                content: contenido,
                publication_Date: currentDate,
                estate: true,
                reports: 0
            })
        } catch (error) {
            console.error(error);
            throw error
        }
    }
    return({
        getDataToken,
        getCommunities,
        getListPost,
        followChannelPreference,
        getCommunitiesByIdUser,
        getCommunitiesfollowedByIdUser,
        unfollowCommunityByidAndidChannel,
        getDataChannelByIdChannel,
        getPostChannelByIdChannel,
        createChannel,
        getCreateChannelByIdUser,
        updateChannelByIdChannel,
        postPublicationinChannel,
        getNumberReactionsPublication,
        postReactionPublication,
        getCommnetsPostByIdPost,
        postCommentInPublication
    });
}

