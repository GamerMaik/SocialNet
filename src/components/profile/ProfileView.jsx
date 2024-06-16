import { useEffect, useState } from 'react';
import { Button, Input, Selects, TextsArea, CardChannel, PanelRight, ProfileEditPhoto, DataProfileItem, ProfileInformation} from '../Index';
import { useAuth } from '../../context/AuthContext';
import { Loader } from '../../utils/Loader';
import { ModalPopUp } from '../shared/Modal'

const formatDateToISOString = (dateString) => {
    return new Date(dateString).toISOString();
};

export function ProfileView() {
    const auth = useAuth();
    const [activeEdit, setActiveEdit] = useState(false);

    const [isLoading, setisLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [communities, setCommunities] = useState([]);
    const [countries, setCountries] = useState([]);
    const [profileData, setProfileData] = useState({
        name_user: '',
        name_profile: '',
        day_birth_profile: '',
        gender_profile: '',
        id_country: '',
        description_profile: '',
        phone_profile: '',
        email_user: '',
        id_image:0
    });

    const UserID = window.localStorage.getItem("IdUser");
    const ImageProfile = window.localStorage.getItem('image');

    const toggleEditMode = () => {
        setActiveEdit(!activeEdit);
    };

    const cerrarPanelModal = () => {
        setShowModal(false);
    };

    const handleEditProfile = async (event) => {
        event.preventDefault();
        const formattedDate = formatDateToISOString(profileData.day_birth_profile);
        try {
            setisLoading(true);
            await auth.updateUser(UserID, profileData.name_user, profileData.name_profile, 1, profileData.description_profile, '', formattedDate);
            await auth.updateContactInfoUser(UserID, parseInt(profileData.phone_profile) , profileData.gender_profile, parseInt(profileData.id_country));
            // Vuelve a cargar los datos del usuario para reflejar los cambios
            const responseDataUserArray = await auth.getUserProfileById(UserID);
            console.log(responseDataUserArray);
            if (responseDataUserArray && responseDataUserArray.length > 0) {
                const responseDataUser = responseDataUserArray[0];
                if (responseDataUser.profile && responseDataUser.profile.length > 0) {
                    const userData = responseDataUser.profile[0];
                    setProfileData({
                        name_user: responseDataUser.name_user,
                        name_profile: userData.name_profile,
                        day_birth_profile: formatDate(userData.day_birth_profile),
                        gender_profile: userData.gender_profile,
                        id_country: userData.id_country,
                        description_profile: userData.description_profile,
                        phone_profile: userData.phone_profile,
                        email_user: responseDataUser.email_user,
                        id_image: userData.id_image
                    });
                } else {
                    console.log("No se encontró el perfil del usuario o el perfil está vacío");
                }
            } else {
                console.log("No se encontró el usuario");
            }
        } catch (error) {
            console.error(error);
            setError("No se pudieron actualizar los datos")
            setShowModal(true);
            return
        }finally{
            window.localStorage.setItem("nameUser", profileData.name_user)
            setisLoading(false);
            setError("Sus datos fueron actualizados correctamente")
            setShowModal(true);
        }
        setActiveEdit(false);  // Opcional, para salir del modo de edición después de actualizar los datos
    };

    const handleUnfollow = async (idChannel) => {
        try {
            setCommunities(communities.filter(community => community.key !== idChannel));
            await auth.unfollowChannel(UserID, idChannel);
            console.log(`Dejando de seguir el canal con ID: ${idChannel}`);
        } catch (error) {
            console.error("No se pudo seguir el canal", error);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setProfileData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleDateChange = (event) => {
        const { value } = event.target;
        const today = new Date();
        const birthDate = new Date(value);
        var age = today.getFullYear() - birthDate.getFullYear();
        const month = today.getMonth() - birthDate.getMonth();

        if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 18) {
            setProfileData(prevState => ({
                ...prevState,
                day_birth_profile: '2000-01-01'
            }));
            alert('La edad debe ser mayor a 18 años.');
        } else {
            setProfileData(prevState => ({
                ...prevState,
                day_birth_profile: value
            }));
        }
    };

    const formatDate = (dateString) => {
        return dateString.split('T')[0];
    };

    useEffect(() => {
        const getDataUser = async () => {
            try {
                setisLoading(true);
                const responseCommunities = await auth.getCommunitiesfollowedByIdUser(UserID);
                if (responseCommunities != undefined) {
                    setCommunities(responseCommunities.data);
                }
                //const responseAvatarsList = await auth.getlistAvatars();
                //console.log("DATOS DE COMUNIDADES", responseCommunities.data);

                const responseDataUserArray = await auth.getUserProfileById(UserID);
                //console.log(responseDataUserArray);
                if (responseDataUserArray && responseDataUserArray.length > 0) {
                    const responseDataUser = responseDataUserArray[0];
                    if (responseDataUser.profile && responseDataUser.profile.length > 0) {
                        const userData = responseDataUser.profile[0];
                        setProfileData({
                            name_user: responseDataUser.name_user,
                            name_profile: userData.name_profile,
                            day_birth_profile: formatDate(userData.day_birth_profile),
                            gender_profile: userData.gender_profile,
                            id_country: userData.id_country,
                            description_profile: userData.description_profile,
                            phone_profile: userData.phone_profile,
                            email_user: responseDataUser.email_user
                        });
                    } else {
                        console.log("No se encontró el perfil del usuario o el perfil está vacío");
                    }
                } else {
                    console.log("No se encontró el usuario");
                }

                const responseCountries = await auth.getCountries();
                setCountries(responseCountries);
            } catch (error) {
                console.error(error);
            }finally{
                setisLoading(false);
            }
        };
        getDataUser();
    }, [auth, UserID]);

    return (
        <>
            <div className='container-body'>
                <span className='main-bg'></span>
                <form onSubmit={handleEditProfile}>
                    <div className='container-profile'>
                        <section className="userProfile card">
                            <ProfileEditPhoto userPhoto={ImageProfile} onChange={handleInputChange} />
                        </section>

                        <section className='follow_communities card'>
                            <PanelRight texto='COMUNIDADES QUE SIGUES'>
                                {communities.length === 0 ? (
                                    <p className='text-muted' style={{ textAlign: 'center', marginTop: '2rem' }}>Sigue a una comunidad para ver tus comunidades</p>
                                ) : (
                                    communities.map((community) => (
                                        <CardChannel key={community.key} idChannel={community.key} nameChannel={community.name} categoryChannel={community.category}>
                                            <Button texto="Dejar de Seguir" onClick={() => { handleUnfollow(community.key) }}></Button>
                                        </CardChannel>
                                    ))
                                )}
                            </PanelRight>
                        </section>

                        <section className='userDetails card'>
                            {!activeEdit ? (
                                <div className="userName">
                                    <h1 className="name">{profileData.name_profile}</h1>
                                    <p>{profileData.name_user}</p>
                                    <p className="text-muted" style={{ fontSize: "15px" }}>{profileData.description_profile}</p>
                                </div>
                            ) : (
                                <div className="userName">
                                    <Input tipo="text" nombre="name_profile" placeholder="Nombre de Perfil" value={profileData.name_profile} onChange={handleInputChange} />
                                    <Input tipo="text" nombre="name_user" placeholder="Nombre de Perfil" value={profileData.name_user} onChange={handleInputChange} />
                                    <TextsArea nombre="description_profile" filas={3} placeholder="Descripcion" value={profileData.description_profile} onChange={handleInputChange} />
                                </div>
                            )}
                        </section>

                        <section className='informatio-profile card'>
                            <ProfileInformation titulo="Informacion de Contacto">
                                {!activeEdit ? (
                                    <>
                                        <p className="heading">Informacion de Contacto</p>
                                        <DataProfileItem nombre="Celular" dato={profileData.phone_profile} />
                                        <DataProfileItem nombre="Pais" dato={countries.find(country => country.id_country === profileData.id_country)?.name_country || 'N/A'} />
                                        <DataProfileItem nombre="Correo" dato={profileData.email_user} />
                                        <br />
                                        <p className="heading">Informacion Basica</p>
                                        <DataProfileItem nombre="Fecha de Nacimiento" dato={profileData.day_birth_profile} />
                                        <DataProfileItem nombre="Genero" dato={ profileData.gender_profile === "M" ? "Masculino" : profileData.gender_profile === "F" ? "Femenino" : "Prefiero no decirlo"}/>
                                    </>
                                ) : (
                                    <>
                                        <Input tipo="text" nombre="phone_profile" placeholder="Celular o Telefono" value={profileData.phone_profile} onChange={handleInputChange} />
                                        <Selects nombre="id_country" texto="Pais" value={profileData.id_country} onChange={handleInputChange}>
                                            {countries.map((country) => (
                                                <option key={country.id_country} value={country.id_country}>{country.name_country}</option>
                                            ))}
                                        </Selects>
                                        <Input tipo="date" value={profileData.day_birth_profile} onChange={handleDateChange} />
                                        <Selects nombre="gender_profile" texto="Genero" value={profileData.gender_profile} onChange={handleInputChange}>
                                            <option value="M">Masculino</option>
                                            <option value="F">Femenino</option>
                                            <option value="O">Prefiero no decirlo</option>
                                        </Selects>
                                        <Button texto="Actualizar datos" />
                                    </>
                                )}
                                <Button texto={activeEdit ? "Cancelar" : "Editar Datos"} estilo='btn' type="button" onClick={toggleEditMode} />
                            </ProfileInformation>
                        </section>
                    </div>
                </form>
                {error &&
                <ModalPopUp
                    titulo='MENSAJE'
                    contenido={error}
                    estado={showModal}
                    cerrarModal={cerrarPanelModal}
                />
                }
            </div>
            {isLoading && <Loader/>}
        </>
    );
}
