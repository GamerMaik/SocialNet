// eslint-disable-next-line react/prop-types
export function MainContainer({children}) {
    return(
        <main>
            <div className="container">
                {children}
            </div>
        </main>
    )
}