import '../styles/StyleLoader.css'
export function Loader() {
    return(
        <div className='loadWindow'>
            <div className="loader">
                <div className="loader-text">Loading...</div>
                <div className="loader-bar"></div>
            </div>
        </div>
    )
}