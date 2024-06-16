
import { MainContainer, Navbar, PanelRight, Icons, PanelGeneral, Options, PanelMiddle, CardUser} from "../components/Index";


export function AdminPage(){

    return(
        <>
            <Navbar/>
            <MainContainer>
                <PanelRight texto="OPCIONES DE ADMINISTRACIÓN">
                    <PanelGeneral>
                       <div className="card-community" onClick={()=>{alert("usuarios")}}>
                         <Options icon={<Icons nombre="manage_accounts" />} text="Usuarios" />
                       </div>
                       <div className="card-community">
                         <Options icon={<Icons nombre="manage_accounts" />} text="Comentarios" />
                       </div>
                    </PanelGeneral>
                </PanelRight>
                <PanelMiddle>
                    <>
                        <PanelGeneral>
                            <p>USUARIOS</p>
                        </PanelGeneral>
                        <br></br>
                        <>
                            <PanelGeneral>
                                <div className="card-community">
                                    <CardUser
                                        username="ID USER: 19  |  Nombre: Miguel Angel"
                                    />
                                </div>
                            </PanelGeneral>
                            <br></br>
                        </>
                    </>
                </PanelMiddle>
            </MainContainer>
        </>
    )
}