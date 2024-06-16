import { useEffect, useState } from 'react';
import { MainContainer, Navbar, PanelRight, CardChannel, Button, PanelMiddle, PanelGeneral, Input, TextsArea, Selects, Icons, CardPostEdit, ModalSearch, CardPost} from "../components/Index";
import { useAuth } from '../context/AuthContext';
import { Loader } from '../utils/Loader';

export function CommunityPage() {

    const auth = useAuth();
    const [activeEdit, setActiveEdit] = useState(false);
    const [activeCreate, setActiveCreate] = useState(false);
    const [activeDelete, setActiveDelete] = useState(false);
    const [activePost, setActivePost] = useState(false);

    const [channelSelected, setChannelSelected] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    // ESTADOS PARA CREAR UN CANAL
    const [imageNewPost, setImageNewPost] = useState('https://res.cloudinary.com/de2l60rkp/image/upload/v1718203587/placeholder-image_lnnlug.jpg');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [visibility, setVisibility] = useState('Publico');
    const [feeds, setFeeds] = useState([]);
    // ESTADO PARA ALMACENAR LA INFO DE LOS CANALES QUE TIENE EL USUARIO
    const [myChannels, setMyChannels] = useState([]);
    const UserID = window.localStorage.getItem("IdUser");
    const [channelData, setChannelData] = useState({
        key: '',
        name: '',
        description: '',
        visibility: '',
        state: true,
        category: '',
    });
    //EVENTOS PARA MANEJEAR LOS INPUTS
    const handleNameChange = (e) => setName(e.target.value);
    const handleDescriptionChange = (e) => setDescription(e.target.value);
    const handleCategoryChange = (e) => setCategory(e.target.value);
    const handleVisibilityChange = (e) => setVisibility(e.target.value);
    const handleContentPost = (e) => setContent(e.target.value);

    //REUPERA LOS CANALES QUE PERTENCEN AL USUARIO LOGUEADO
    const recuperarComunidades = async() => {
        const responseMyCommunities = await auth.getCreateChannelsByIduser(UserID);
            if (responseMyCommunities && responseMyCommunities.length > 0) {
                const filteredCommunities = responseMyCommunities.filter(community =>
                    community.estate === true
                );
                setMyChannels(filteredCommunities)
            }
    }
    useEffect(() => {
        const dataChannels = async () => {
            try {
                setIsLoading(true);
                recuperarComunidades()

            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };
        dataChannels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [UserID, auth]);

    // Cambiar el estado del botón de editar
    const toggleEditMode = () => {
        setActiveEdit(!activeEdit);
        setActiveCreate(false);
        setActiveDelete(false)
    };

    // Cambiar el estado del botón de crear
    const toggleCreateMode = () => {
        setActiveCreate(!activeCreate);
        setActiveEdit(false);
        setActiveDelete(false)
    };
    //Cambiar el estado del botón eliminar
    const toggleDeleteMode = () =>{
        setActiveDelete(!activeDelete)
        setActiveEdit(false);
        setActiveCreate(false);
    }
    //Cambiar el estado del boton NuevoPost
    const toggleChangePost = () => {
        setActivePost(!activePost);
        setActiveCreate(false);
        setActiveEdit(false);
        setActiveDelete(false);

        window.scroll({
            top: 0,
            behavior: 'smooth'
        })
    };

    const handleEditChannel = async (event) => {
        event.preventDefault();
        try {
            setIsLoading(true);
            await auth.UpdateChannelbyiD(channelData.key, channelData.name, channelData.description, UserID, channelData.visibility, channelData.state, channelData.category);
            recuperarComunidades()
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
            setActiveEdit(false);
        }
    };

    const handleCreateChannel = async (event) => {
        event.preventDefault();
        try {
            setIsLoading(true);
            await auth.createNewChannel(UserID, name, description, visibility, category);
            recuperarComunidades()
        } catch (error) {
            console.log("Interfaz", error);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
            setActiveCreate(false);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setChannelData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    //Cargar los datos del canales
    const loadDataChannel = async (idChannel, name, description, visibility, state, category) => {
        setChannelSelected(true)
        setChannelData({
            key: idChannel,
            name: name,
            description: description,
            visibility: visibility,
            state: state,
            category: category
        });
        setActivePost(false);
        setActiveCreate(false);
        setActiveEdit(false);
        setActiveDelete(false);

        try {
            setIsLoading(true)
            const responsePostByIdChannel = await auth.getPostChannelById(idChannel);
            const filterPost = responsePostByIdChannel.filter(post=>
                post.estate === true
            )
            console.log(idChannel, name);
            setFeeds(filterPost)
            console.log(responsePostByIdChannel);
        } catch (error) {
            console.error(error);
        }finally{
            setIsLoading(false)
        }
    };
    //Funcion para eliminar un canal
    const handleDeleteChannel = async (event) => {
        event.preventDefault();
        try {
            setIsLoading(true)
            await auth.UpdateChannelbyiD(channelData.key, channelData.name, channelData.description, UserID, channelData.visibility, false, channelData.category);
            recuperarComunidades()
        } catch (error) {
            console.log(error);
        }finally{
            setIsLoading(false)
        }
    };
    //Funcion para crear un Post
    const handleCreatePost = async (event) => {
        event.preventDefault();
        try {
            setIsLoading(true);
            await auth.postPublicationInComminity(channelData.key, content, imageNewPost);
            recuperarComunidades();

        } catch (error) {
            console.log("Interfaz", error);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
            setActivePost(false);
        }
    };
    const openSearchImage = async ()=>{
        setError("Sus datos fueron actualizados correctamente")
        setShowModal(true);
    }
    const cerrarPanelModal = () => {
        setShowModal(false);
    };
    const handleImageSelect = (url) => {
        setImageNewPost(url);  // Actualizar la imagen seleccionada
    };
    return (
        <>
            <Navbar profilephoto={window.localStorage.getItem("image")} />
            <MainContainer>
                <PanelRight texto='TUS COMUNIDADES'>
                    {
                        myChannels.length === 0 ? (
                            <p className='text-muted' style={{ textAlign: 'center', marginTop: '2rem', fontWeight:"bold"}}>EMPIEZA A CREAR TU PRIMERA COMUNIDAD AHORA</p>
                        ) : (
                            myChannels.map((channels) => (
                                <div className="card-community" onClick={() => { loadDataChannel(channels.key, channels.name, channels.description, channels.visibility, channels.estate, channels.category) }} key={channels.key}>
                                    <CardChannel idChannel={channels.key} nameChannel={channels.name} categoryChannel={channels.category}></CardChannel>
                                </div>
                            ))
                        )
                    }
                </PanelRight>
                <PanelMiddle>
                    <>
                        <PanelGeneral>
                            <p>{channelData.name}</p>
                        </PanelGeneral>
                        <br/>
                        {activePost && <form onSubmit={handleCreatePost}>
                            <CardPostEdit
                                imagePost={imageNewPost}
                                reactions="5"
                                onClick={()=>{openSearchImage()}}
                            >
                            <TextsArea  placeholder="Descripcion" nombre={"content"} value={content} onChange={handleContentPost}/>
                            <Button texto="PUBLICAR EL POST"/>
                            </CardPostEdit>
                        </form>}

                        {feeds.length === 0?(
                              <p className='text-muted' style={{ textAlign: 'center', marginTop: '2rem' }}>No Existen publicaciones en este momento intentelo más tarde</p>
                        ):(
                            feeds.map((feed)=>(
                                <CardPost
                                    key={feed.postKey}
                                    idPost={feed.postKey}
                                    idChannel={feed.idChannel}
                                    publicationDate={feed.publication_Date}
                                    imagePost={feed.image}
                                    descriptionPost={feed.content}
                                />
                            ))
                        )}
                    </>
                </PanelMiddle>
                <PanelRight texto='OPCIONES DE ADMINISTRACION'>
                    <Button texto={activeCreate ? "CANCELAR" : "CREAR CANAL"} estilo='btn' type="button" onClick={toggleCreateMode}></Button>
                    {channelSelected && <>
                        <Button texto={activePost ? "CANCELAR" : "NUEVA PUBLICACION"} estilo='btn btn-primary' type="button" onClick={toggleChangePost}></Button>
                        <Button texto={activeEdit ? "CANCELAR" : "EDITAR CANAL"} estilo='btn btn-edit' type="button" onClick={toggleEditMode}></Button>
                        <Button texto={activeDelete ? "CANCELAR" : "ELIMINAR CANAL"} estilo='btn btn-danger' type="button" onClick={toggleDeleteMode}></Button>
                    </>}

                    {activeDelete && (
                        <div className="panel-form">
                            <PanelGeneral>
                                <form onSubmit={handleDeleteChannel}>
                                    <h5><Icons nombre={"warning"}/> -- AVISO -- <Icons nombre={"warning"}/></h5>
                                    <h5 style={{color:"black"}}>Una vez que se borre el canal con el nombre de:</h5>
                                    <div className='name-channel'>{channelData.name}</div>
                                    <h5 style={{color:"black"}}>no podra se recuperado nuevamente</h5>
                                    <Button texto="CONFIRMAR ELIMINACIÓN" estilo="btn btn-danger"/>
                                </form>
                            </PanelGeneral>
                        </div>
                    )}

                    {activeEdit && (
                        <div className="panel-form">
                            <PanelGeneral>
                                <form onSubmit={handleEditChannel}>
                                    <Input tipo="text" placeholder="Ingrese Nombre del canal" nombre="name" value={channelData.name} onChange={handleInputChange}/>
                                    <TextsArea placeholder="Ingrese la descripcion" filas={3} nombre="description" value={channelData.description} onChange={handleInputChange} />
                                    <Selects nombre="category" texto="categoria" value={channelData.category} onChange={handleInputChange} >
                                        <option value="Juegos">Juegos</option>
                                        <option value="Peliculas">Peliculas</option>
                                        <option value="Noticias">Noticias</option>
                                        <option value="Cocina">Cocina</option>
                                    </Selects>
                                    <Selects nombre="visibility" texto="tipo de visibilidad" value={channelData.visibility} onChange={handleInputChange} >
                                        <option value="Publico">Publico</option>
                                        <option value="Privado">Privado</option>
                                    </Selects>
                                    <Button texto="CONFIRMAR EDICIÓN" estilo="btn btn-edit" />
                                </form>
                            </PanelGeneral>
                        </div>
                    )}

                    {activeCreate && (
                        <div className="panel-form">
                            <PanelGeneral>
                                <form onSubmit={handleCreateChannel}>
                                    <Input tipo="text" placeholder="Ingrese Nombre del canal" nombre="name" value={name} onChange={handleNameChange} />
                                    <TextsArea placeholder="Ingrese la descripcion" filas={3} nombre="description" value={description} onChange={handleDescriptionChange} />
                                    <Selects nombre="category" texto="categoria" value={category} onChange={handleCategoryChange} >
                                        <option value="Juegos">Juegos</option>
                                        <option value="Peliculas">Peliculas</option>
                                        <option value="Noticias">Noticias</option>
                                        <option value="Cocina">Cocina</option>
                                    </Selects>
                                    <Selects nombre="visibility" texto="tipo de visibilidad" value={visibility} onChange={handleVisibilityChange} >
                                        <option value="Publico">Publico</option>
                                        <option value="Privado">Privado</option>
                                    </Selects>
                                    <Button texto="CONFIRMAR CREACIÓN" estilo="btn" />
                                </form>
                            </PanelGeneral>
                        </div>
                    )}
                </PanelRight>
            </MainContainer>
            {error && <ModalSearch
                    contenido={error}
                    estado={showModal}
                    cerrarModal={cerrarPanelModal}
                    onImageSelect={handleImageSelect}
                />}
            {isLoading && <Loader />}
        </>
    );
}
