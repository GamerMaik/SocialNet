// eslint-disable-next-line react/prop-types
export function DataProfileItem({nombre, dato}){
    return(
        <li className="address">
            <h1 className="label">{nombre}:</h1>
            <span className="info">{dato}</span>
        </li>
    )
}