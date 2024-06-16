import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {Icons} from '../shared/Icons'
import 'react-lazy-load-image-component/src/effects/blur.css'
import placeholder from '../../assets/placeholder-image.jpg'
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import {ModalPopUp, CardUser, PanelGeneral, Input, Button} from '../Index'

// eslint-disable-next-line react/prop-types
export function CardPost({ idPost, idChannel, publicationDate, imagePost, descriptionPost}){
    const formatDate = (dateString) => {
        return dateString.split('T')[0];
    };
    const auth = useAuth()

    const idUser = window.localStorage.getItem("IdUser")
    const [communitieData, setCommunitieData] = useState({})
    const [reactionsPost, setReactionsPost] = useState([])
    const [estareReaction, setEstateReaction] = useState(false)

    //ESTADOS DE COMENTARIOS
    //mostrar y oucltar comentarios
    const [showCommments, setShowComments] = useState(false)
    const [showCardCommments, setShowCardComments] = useState(false)
    const [showCommmentID, setCommmentID] = useState('')

    const [contentComent, setcontentComent] = useState('');

    const handleComment = (e) => setcontentComent(e.target.value);
    //almacenar los comentario de un post
    const [commentsByPost, setAllComments] = useState([])
    //Establecer mensajes de POP UP
    const [messageModal, setMessageModal] = useState("");
    const [showModal, setShowModal] = useState(false);

    useEffect(()=>{
        const getDataCommunitie = async() =>{
            //obtener datos de la comunidad por ID
            const responseDataCommunitie = await auth.getDataChannelById(idChannel);
            //console.log(responseDataCommunitie);
            setCommunitieData(responseDataCommunitie);

            //Obtener las reaciones de cada post
            const responseReactions = await auth.getNumberReactionPost(idPost);
            const responseReactionFiltered = responseReactions.filter(reaction=>
                reaction.estate === true
            )
            console.log(responseReactionFiltered);
            setReactionsPost(responseReactionFiltered)
        }
        getDataCommunitie()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth, idChannel, estareReaction])

    const postReaction = async(idPost, idUser) =>{
        if (communitieData.idUser == idUser ) {
            setMessageModal("No puedes reaccionar a tu propia publicacion")
            setShowModal(true)
            //console.log("No puedes reaccionar a tu propia publicacion");
        }else{
            console.log(idPost, idUser);
            try {
                await auth.postReactions(idPost, idUser)
            }catch (error) {
                console.error(error);
            }finally{
                setEstateReaction(!estareReaction)
                //hallar la manera de que el Icono cambie a lleno
            }
        }
    }
    //OBTENER LOS COMENTARIOS DE UN POST
    const getCommnetsPost = async(idPost)=>{
        try {
            const response = await auth.getPostComments(idPost);
            setAllComments(response);
            setShowComments(!showCommments)

        } catch (error) {
            console.error(error);
        }
    }

    //Mostrar formulario de comentarios
    const postComment = (idPost) =>{
        if (commentsByPost.length >= 5) {
            setMessageModal("El post ya tiene un maximo de 5 comentarios")
            setShowModal(true)
        }else{
            setShowCardComments(!showCardCommments)
            setCommmentID(idPost)
            console.log(idPost)
        }
    }

    //AGREGAR UN COMENTARIO A UN POST
    const handlePostComment = async(event)=>{
        event.preventDefault();
        try {
            console.log(showCommmentID, idUser, contentComent);
            await auth.postCommentInPublication(showCommmentID, idUser, contentComent);
        } catch (error) {
            console.error(error);
        }finally{
            setMessageModal("Se a comentado el post")
            setShowModal(true)
            setShowCardComments(!showCardCommments)
            setShowComments(!showCommments)
        }
    }


    const cerrarPanelModal = () => {
        setShowModal(false);
    };

    const categoryImage = {
        "Juegos": "https://res.cloudinary.com/de2l60rkp/image/upload/v1718199636/Icons_communitie_01_qoyvys.jpg",
        "Peliculas": "https://res.cloudinary.com/de2l60rkp/image/upload/v1718199636/Icons_communitie_02_br0kt7.jpg",
        "Noticias": "https://res.cloudinary.com/de2l60rkp/image/upload/v1718199636/Icons_communitie_03_l2yrdt.jpg",
        "Cocina": "https://res.cloudinary.com/de2l60rkp/image/upload/v1718199636/Icons_communitie_04_ygkjun.jpg",
      };
    return(
        <>
            <div className="feed">
                <div className="head" key={idPost}>
                    <div className="user">
                        <div className="profile-photo">
                            <img src={categoryImage[communitieData.category] || 'https://static.wikia.nocookie.net/robloxbedwars/images/3/3e/Lucky_Block.png'} style={{borderRadius:"50%"}}></img>
                        </div>
                        <div className="ingo">
                            <Link to="/community">
                                <h3>{communitieData.name}</h3>
                            </Link>
                            <small>{formatDate(publicationDate)}</small>
                        </div>
                    </div>
                </div>
                <div className="photo">
                    <LazyLoadImage
                        src={imagePost}
                        placeholderSrc={placeholder}
                        width="100%"
                        height="100%"
                        effect="blur"
                        threshold={10}
                    />
                </div>
                <div className="action-buttons">
                    <div className="interactions-buttons" onClick={()=>{postReaction(idPost,idUser)}} style={{cursor:"pointer"}}>
                        <Icons nombre={reactionsPost.estate === true ? "favorite" : "favorite_border"}/>
                        <span><strong>{reactionsPost.length}</strong></span>
                    </div>
                    <div className="bookmark" onClick={()=>{postComment(idPost)}}>
                        <Icons nombre="mode_comment"/>
                    </div>
                </div>
                <div className="caption">
                    <p>{descriptionPost}</p>
                </div>
                <div className="comments text-muted" onClick={()=>{getCommnetsPost(idPost)}}>
                    {showCommments===true ? "Ocultar los comentarios": "Ver los 5 comentarios"}
                </div>
                {showCardCommments && <div className="panel-form" style={{marginTop:"0px"}}>
                    <form onSubmit={handlePostComment}>
                        <PanelGeneral estilo="contentborder">
                            <Input tipo="text" nombre="content" placeholder={"Ingrese su comentario"} onChange={handleComment}/>
                            <Button texto="COMENTAR"/>
                        </PanelGeneral>
                    </form>
                </div>}
                <br></br>
                {showCommments && <div className="comment-card">

                    {commentsByPost.length  === 0 ?(
                        <p className="text-muted" style={{textAlign:"center"}}>No hay comentarios</p>
                    ):(
                        commentsByPost.map((comment)=>(
                            <div className="comment" key={comment.content}>
                                <CardUser
                                    idUser={comment.idUser}
                                    username={`${comment.content}`}
                                    photo={window.localStorage.getItem("image")}
                                />
                            </div>
                        ))
                    )}
                </div>}
            </div>
            <ModalPopUp
                titulo="Mensaje"
                contenido={messageModal}
                estado={showModal}
                cerrarModal={cerrarPanelModal}
            />
        </>
    )
}