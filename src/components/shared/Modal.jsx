import { Link } from "react-router-dom";
import {Button} from './Button'
import { useState, useEffect } from "react";
import { MagicMotion } from 'react-magic-motion'
import { Input } from "./Inputs";
import { useAuth } from "../../context/AuthContext";
import { LazyLoadImage } from "react-lazy-load-image-component";
import placeholder from '../../assets/placeholder-image.jpg'
// eslint-disable-next-line react/prop-types
export function OpcionSelector({tipo = "menu-item",id, icon, text, direccion="/main"}){
    return(
        <Link className={tipo} id={id} to={direccion}>
            {icon}<h3>{text}</h3>
        </Link>
    )
}
// eslint-disable-next-line react/prop-types
export function Options({tipo = "menu-item", icon, text}){
    return(
        <div className={tipo}>
            {icon}<h3>{`‎ ‎ ${text}`}</h3>
        </div>
    )
}

// eslint-disable-next-line react/prop-types
export function CardChannel({ idChannel, nameChannel, categoryChannel, children, estilo }) {
    const categoryImage = {
        "Juegos": "https://res.cloudinary.com/de2l60rkp/image/upload/v1718199636/Icons_communitie_01_qoyvys.jpg",
        "Peliculas": "https://res.cloudinary.com/de2l60rkp/image/upload/v1718199636/Icons_communitie_02_br0kt7.jpg",
        "Noticias": "https://res.cloudinary.com/de2l60rkp/image/upload/v1718199636/Icons_communitie_03_l2yrdt.jpg",
        "Cocina": "https://res.cloudinary.com/de2l60rkp/image/upload/v1718199636/Icons_communitie_04_ygkjun.jpg",
    };
    return (
        <MagicMotion>
            <div style={estilo} className="channel" key={idChannel}>
                <div className="info">
                    <div className="profile-photo">
                        <img src={categoryImage[categoryChannel] || 'https://static.wikia.nocookie.net/robloxbedwars/images/3/3e/Lucky_Block.png'} alt="Community" style={{borderRadius:"50%"}} />
                    </div>
                    <div>
                        <h5>{nameChannel}</h5>
                        <p className="text-muted">{categoryChannel}</p>
                    </div>
                </div>
                <div className="action">
                    {children}
                </div>
            </div>
        </MagicMotion>
    );
}



// eslint-disable-next-line react/prop-types
export function CardUser({username, photo}){
    return(
        <>
            <div className="profile-photo">
                <img style={{borderRadius:"50%"}} src={photo}></img>
            </div>
            <div className="handle">
                <h4>{username}</h4>
            </div>
        </>
    )
}

// eslint-disable-next-line react/prop-types
export function ModalPopUp({ titulo, contenido, estado, cerrarModal }) {
    const [showModal, setShowModal] = useState(estado);

    useEffect(() => {
        setShowModal(estado);
    }, [estado]);

    return (
        <>
            {showModal &&
                <div className="panel-modal-container">
                    <div className="panel-modal">
                        <div className="header-modal">
                            <h4>{titulo}</h4>
                        </div>
                        <div className="body-modal">
                            <p>
                                {contenido}
                            </p>
                        </div>
                        <div>
                            <Button texto="Cerrar" onClick={cerrarModal} />
                        </div>
                    </div>
                </div>
            }
        </>
    );
}
// eslint-disable-next-line react/prop-types
export function ModalSearch({ estado, cerrarModal, onImageSelect }){

    const auth = useAuth();
    const [showModal, setShowModal] = useState(true);
    const [search, setSearch] = useState('');
    const [resultSearch, setResultSearch] = useState([]);

    const handleSearchChange = (e) => setSearch(e.target.value);

    useEffect(() => {
        setShowModal(estado);
    }, [estado]);

    const SearchImage = async (event) => {
        event.preventDefault();
        const response = await auth.getImageList(search);
        setResultSearch(response.results);
        console.log(response);
    };

    const handleImageDoubleClick = (url) => {
        onImageSelect(url);  // Propagar la URL seleccionada
        cerrarModal();       // Cerrar el modal después de seleccionar la imagen
    };
    return(
        <>
            {showModal &&
                <form onSubmit={SearchImage}>
                <div className="panel-modal-container-search">
                    <div className="panel-modal-search">
                        <div className="header-modal-search">
                            <span className="material-icons-outlined">search</span>
                            <Input tipo={"search"} placeholder={"Buscar Imagen"} nombre={"search"} onChange={handleSearchChange} />
                        </div>
                        <div className="body-modal-search">
                                <div className="images-container-search">
                                    {resultSearch.length > 0 ? (
                                        resultSearch.map((image) => (
                                            <div key={image.id}>
                                                 <LazyLoadImage
                                                    src={image.urls.small}
                                                    placeholderSrc={placeholder}
                                                    width="250px"
                                                    height="100px"
                                                    effect="blur"
                                                    threshold={10}
                                                    style={{width:"250px", height:"150px", gap:"20px"}}
                                                    onDoubleClick={() => handleImageDoubleClick(image.urls.full)}
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <p>No se encontraron imágenes</p>
                                    )}
                                </div>
                        </div>
                        <div>
                            <Button texto={"BUSCAR"} />
                            <Button texto="Cerrar" onClick={cerrarModal} />
                        </div>
                    </div>
                </div>
            </form>
            }
        </>
    )
}
