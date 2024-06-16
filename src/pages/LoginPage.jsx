import {useNavigate} from 'react-router-dom'
import {Button, Input,PanelForms} from '../components/Index'
import {Captcha} from '../utils/Recaptacha'
import { useAuth } from '../context/AuthContext';
import { useState, useRef } from 'react';
import { Loader } from '../utils/Loader';

export function LoginPage(){
    const auth = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setisLoading] = useState(false);
    const [errormessage, setError] = useState(null);

    const captcha = useRef(null);
    const [usuarioValido, cambiarUsuarioValido] = useState(false);

    const onChange = () => {
        const captchaValue = captcha.current.getValue();
        if (captchaValue) {
            console.log("El usuario no es un robot");
            cambiarUsuarioValido(true);
        } else {
            cambiarUsuarioValido(false);
        }
    };

    const handleLogin = async (event)=>{
        event.preventDefault();
        try {
            setisLoading(true);
            await auth.loginUserByMicroservice(email, password);
            navigate('/main');
        } catch (error) {
            setError("Credenciales incorrectas. Por favor, intenta de nuevo.");
            console.log(error.message)
        }finally{
            setisLoading(false);
        }
    }
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    return(
        <>
            <PanelForms>
                <form onSubmit={handleLogin}>
                    <Input tipo="email" nombre="email_user" placeholder="Correo" value={email} onChange={handleEmailChange}/>
                    <Input tipo="password" nombre="password_user" placeholder="Contraseña" value={password} onChange={handlePasswordChange}/>
                    <Captcha funcion={onChange} referencia={captcha}/>
                    {errormessage && <p style={{ color: 'red' }}>{errormessage}</p>}
                    {usuarioValido && <Button texto="Iniciar Sesión" />}
                    <Button texto="Registrase" type="button" estilo='btn' onClick={()=>{navigate("/register")}}/>
                </form>
            </PanelForms>
            {isLoading && <Loader/>}
        </>
    )
}