import { useRef, useState } from "react";
import {ModalPopUp} from './Modal'
// eslint-disable-next-line react/prop-types
export function Input({tipo, nombre, placeholder, value, onChange, required=true}){
    return(
        <>
            <input
                type={tipo}
                name={nombre}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
            />
        </>
    )
}
// eslint-disable-next-line react/prop-types
export function TextsArea({nombre, placeholder, filas, value, onChange}){
    return(
        <textarea
            name={nombre}
            placeholder={placeholder}
            rows={filas}
            value={value}
            onChange={onChange}
        />
    )
}

// eslint-disable-next-line react/prop-types
export function Selects({ nombre, children, texto, value, onChange }) {
    return (
        <select name={nombre} value={value} onChange={onChange}>
            <option value="0">Seleccione su {texto}</option>
            {children}
        </select>
    );
}

// eslint-disable-next-line react/prop-types
export function ProfileEditPhoto({userPhoto}) {
    const fileInputRef = useRef(null);
    const [profileImage, setProfileImage] = useState(`${userPhoto}`);
    const [errorMessage, setErrorMessage] = useState("");
    const [showModal, setShowModal] = useState(false);

    const handlePhotoClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const validExtensions = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!validExtensions.includes(file.type)) {
                setErrorMessage("Por favor suba un archivo de tipo imagen (jpg, jpeg, png).");
                setShowModal(true);
                return;
            }
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl);
            setErrorMessage("");
        }
    };

    const cerrarPanelModal = () => {
        setShowModal(false);
    };

    return (
        <div className="branding-profile">
            <div className="photo" onClick={handlePhotoClick}>
                <i className="fa-regular fa-pen-to-square"></i>
                <img src={profileImage} alt="Foto de perfil" />
            </div>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/jpeg, image/jpg, image/png"
                onChange={handleFileChange}
            />
            {errorMessage &&
                <ModalPopUp
                    titulo='ERROR AL CARGAR IMAGEN'
                    contenido={errorMessage}
                    estado={showModal}
                    cerrarModal={cerrarPanelModal}
                />
            }
        </div>
    );
}