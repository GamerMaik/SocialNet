import 'react-lazy-load-image-component/src/effects/blur.css'

// eslint-disable-next-line react/prop-types
export function CardPostEdit({imagePost, onClick, children}){
    return(
        <div className="feed">
            <div className="photo" onClick={onClick} style={{cursor:"pointer"}}>
                <img src={imagePost} className='cover'/>
            </div>
            <div className="caption-edit">
                {children}
            </div>
            <br></br>
        </div>
    )
}