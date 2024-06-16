import { Link } from 'react-router-dom';
import { Navbar, PanelLeft, CardUser, OpcionSelector, PanelMiddle, PanelRight, CardChannel, Button, CardPost, MainContainer, Icons } from '../components/Index';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function HomePage() {
    //VARIABLE PARA LA CONEXION AL AUTHCONTEXT
    const auth = useAuth();
    //DEFINICIÓN DE ESTADOS PRINCIPALES
    const [username, setUsername] = useState('');
    const [userImage, setUserImage] = useState('');
    const [feeds, setFeeds] = useState([]);
    const [communities, setCommunities] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [communitiesById, setCommunitiesById] = useState([]);
    const [followedCommunities, setFollowedCommunities] = useState([]);

    const useRol = window.sessionStorage.getItem("UserRol")

    //OBTENER DATOS DE USUARIO
    const UserID = window.localStorage.getItem("IdUser");

    //FUNCION PARA OBTENER LOS DATOS DEL USUARIO, CANALES Y COMUNIDADES
    useEffect(() => {
        const getDataUserAndPost = async () => {
            try {
                // Obtener los datos del usuario (Nombre, imagen) por token
                const responseUser = await auth.dataToken(window.sessionStorage.getItem('key'));
                window.localStorage.setItem('IdUser', responseUser.userId);
                window.localStorage.setItem('image', responseUser.image);
                window.localStorage.setItem('nameUser', responseUser.nameUser)

                // Obtener las comunidades que el usuario aun no sigue
                const responseCommunities = await auth.getCommunitiesById(UserID);

                // Obtener Ids de canales que sigue el usuario:
                const responseCommunitiesById = await auth.getCommunitiesfollowedByIdUser(UserID);
                if (responseCommunitiesById != undefined) {
                    setCommunitiesById(responseCommunitiesById.data);

                    // Obtener los post de las comunidades por ID
                    const postPromises = responseCommunitiesById.data.map(async (community) => {
                        const responsePost = await auth.getPostChannelById(community.key);
                        //console.log(responsePost);
                        return responsePost;
                    });

                    const posts = await Promise.all(postPromises);
                    const flattenedPosts = posts.flat();
                    setFeeds(flattenedPosts);
                }

                const filteredCommunities = responseCommunities.filter(community =>
                    community.estate === true && community.visibility === 'Publico' && community.idUser != UserID
                );

                setCommunities(getRandomCommunities(filteredCommunities, 3));

                if (responseUser && responseUser.nameUser) {
                    setUsername(responseUser.nameUser);
                    setUserImage(responseUser.image);
                }
            } catch (error) {
                console.error("Error al obtener datos del usuario", error);
            }
        };
        getDataUserAndPost();
    }, [auth, UserID, followedCommunities]);

    //FUNCION PARA OBTENER CANALES QUE NO SIGUE DE MANERA RANDOM
    const getRandomCommunities = (communities, count) => {
        const shuffled = [...communities].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    //FUNCION PARA SEGUIR UN CANAL Y DEJAR DE SEGUIRLO
    const handleToggleFollow = async (idChannel) => {
        try {
            if (followedCommunities.includes(idChannel)) {
                // Dejar de seguir el canal
                await auth.unfollowChannel(UserID, idChannel);
                setFollowedCommunities(followedCommunities.filter(id => id !== idChannel));
                console.log(`Dejando de seguir el canal con ID: ${idChannel}`);
            } else {
                // Seguir el canal
                await auth.followChannel(UserID, idChannel);
                setFollowedCommunities([...followedCommunities, idChannel]);
                console.log(`Siguiendo el canal con ID: ${idChannel}`);
            }
        } catch (error) {
            console.log(error);
        }
    };

    //FUNCION PARA ELIMINAR UN CANAL DE LA LISTA DE CANALES
    const handleDeleteCommunity = async (idChannel) => {
        setCommunities(communities.filter(community => community.key !== idChannel));
    };

    return (
        <>
            <Navbar profilephoto={userImage} />
            <MainContainer>
                {/*CONTENEDOR IZQUIERDO*/}
                <PanelLeft>
                    <Link className="profile" to="/profile">
                        <CardUser username={username} photo={userImage} />
                    </Link>
                    <div className="sidebar">
                        <OpcionSelector tipo='menu-item active' icon={<Icons nombre="home" />} text="Inicio" direccion="/main" />
                        <OpcionSelector icon={<Icons nombre="notifications" />} text="Notificaciones" />
                        <OpcionSelector icon={<Icons nombre="groups" />} text="Mis Comunidades" direccion="/communities" />
                        {useRol == "Admin" && <OpcionSelector icon={<Icons nombre="fingerprint" />} text="Administración" direccion="/admin" />}
                        <OpcionSelector icon={<Icons nombre="settings" />} text="Configuraciones" direccion="/profile" />
                    </div>
                </PanelLeft>
                {/*CONTENEDOR CENTRAL*/}
                <PanelMiddle>
                    {feeds.length === 0 ? (
                        <p className='text-muted' style={{ textAlign: 'center', marginTop: '2rem' }}>No existen Comunidades a las que sigue, empiece a seguir una comunidad para ver las publicaciones.</p>
                    ) : (
                        feeds.map((feed) => (
                            <CardPost
                                key={feed.postKey}
                                idPost={feed.postKey}
                                idChannel={feed.idChannel}
                                publicationDate={feed.publication_Date}
                                imagePost={feed.image}
                                descriptionPost={feed.content}
                                reactions="0"
                            />
                        ))
                    )}
                </PanelMiddle>
                {/*CONTENEDOR DERECHO*/}
                <PanelRight>
                    {communities.length === 0 ? (
                        <p className='text-muted' style={{ textAlign: 'center', marginTop: '2rem' }}>Todo tranquilo por el momento.</p>
                    ) : (
                        communities.map((community) => (
                            <CardChannel key={community.key} idChannel={community.key} nameChannel={community.name} categoryChannel={community.category}>
                                <Button
                                    texto={followedCommunities.includes(community.key) ? "Dejar de Seguir" : "Seguir"}
                                    onClick={() => handleToggleFollow(community.key)}
                                />
                                {!followedCommunities.includes(community.key) && (
                                    <Button
                                        texto="Eliminar"
                                        estilo='btn'
                                        onClick={() => handleDeleteCommunity(community.key)}
                                    />
                                )}
                            </CardChannel>
                        ))
                    )}
                </PanelRight>
            </MainContainer>
        </>
    );
}
