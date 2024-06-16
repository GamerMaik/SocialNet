import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {Button, Input} from '../Index'

// eslint-disable-next-line react/prop-types
export function Navbar({profilephoto}) {
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    function logout() {
        auth.logout();
        navigate("/login");
    }

    return (
        <nav>
            <div className="container">
                <Link to="/main"><h2 className="log">SOCIALNET</h2></Link>
                {location.pathname !== "/profile"  && location.pathname !== "/communities" && location.pathname !== "/admin"  && (
                    <div className="search-bar">
                        <span className="material-icons-outlined">search</span>
                        <Input tipo="search" name="search-bar" placeholder="Buscar Comunidades"/>
                    </div>
                )}
                <div className="create">
                   <Button texto="Cerrar Sesion" onClick={logout}/>
                        {location.pathname !== "/profile" && (
                             <div className="profile-photo">
                                <Link to="/profile">
                                    <img src={profilephoto} className='profile-photo'></img>
                                </Link>
                             </div>
                        )}
                 </div>
            </div>
        </nav>
    );
}