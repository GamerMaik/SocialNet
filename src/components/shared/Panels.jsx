// eslint-disable-next-line react/prop-types
export function PanelForms({children, estado = true, estilo='panel'}) {
    return (
        <>
            <section className="main-wrapper">
                {estado && <div className="branding">
                    <h1 className="logo">SocialNet</h1>
                    <h2 className="slogan"> Más que una red social, una experiencia de aprendizaje y descubrimiento</h2>
                </div>}
                <div>
                    <div className={estilo}>
                        {children}
                    </div>
                </div>
            </section>
        </>
    );
}

// eslint-disable-next-line react/prop-types
export function PanelLeft({children}){
    return(
        <div className="left">
            {children}
        </div>
    )
}
// eslint-disable-next-line react/prop-types
export function PanelRight({children, texto="COMUNIDADES SUGERIDAS"}) {
    return(
        <div className="right">
            <div className="message">
                <div className="channels-panel">
                <h4 style={{textAlign:"center", background:"white", padding:"19px"}}>{texto}</h4>
                   {children}
                </div>
            </div>
        </div>
    )
}
// eslint-disable-next-line react/prop-types
export function PanelMiddle({children}){
    return(
        <div className="middle">
            <div className="feeds">
                {children}
            </div>
        </div>
    )
}

// eslint-disable-next-line react/prop-types
export function PanelProfile({children}){
    return(
        <>
            <main>
                <div className="container-profile">
                    {children}
                </div>
            </main>
        </>
    )
}

// eslint-disable-next-line react/prop-types
export function PanelGeneral({children , estilo="content"}){
    return(
        <>
            <div className="panel-container">
                <div className={estilo}>
                    {children}
                </div>
            </div>
        </>
    )
}
