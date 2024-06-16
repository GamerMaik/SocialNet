import { useNavigate } from 'react-router-dom';
import { Button, Input, PanelForms} from '../components/Index';
import { useAuth } from '../context/AuthContext';
import { Loader } from '../utils/Loader';
import { useState } from 'react';

export function RegisterPage() {
    const auth = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setisLoading] = useState(false);

    const handleNameChange = (e) => setName(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

    const registrarse = async (event) => {
        event.preventDefault();

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&.])[A-Za-z\d@$!%*#?&.]{10,}$/;

        if (!passwordRegex.test(password)) {
            setError('La contraseña debe ser alfanumérica, tener al menos un carácter especial y ser de al menos 10 caracteres');
            return;
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        try {
            setisLoading(true)
            console.log(name, email, confirmPassword);
            await auth.registerUserByMicroservice(name, email, confirmPassword);
            navigate("/login");
        } catch (error) {
            if (error.code === 'ERR_BAD_RESPONSE') {
                setError("El usuario ya Existe")
            }else{
                setError("Hubo un error al crear usuario");
            }
        }finally {
            setisLoading(false);
        }
    };

    return(
        <>
            <PanelForms>
                <form onSubmit={registrarse}>
                    <Input tipo="text" nombre="name_user" placeholder="Nombre de Usuario" value={name} onChange={handleNameChange} />
                    <Input tipo="email" nombre="email_user" placeholder="Correo" value={email} onChange={handleEmailChange} />
                    <Input tipo="password" nombre="password_user" placeholder="Contraseña" value={password} onChange={handlePasswordChange} />
                    <Input tipo="password" nombre="confirm_password_user" placeholder="Confirmar Contraseña" value={confirmPassword} onChange={handleConfirmPasswordChange} />
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <Button texto="Crear Cuenta"/>
                    <Button texto="¿Ya tienes una cuenta?" estilo="btn" type="button" onClick={() => { navigate("/login") }} />
                </form>
            </PanelForms>
            {isLoading && <Loader />}
        </>
    );
}
