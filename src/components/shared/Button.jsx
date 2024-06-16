// eslint-disable-next-line react/prop-types
export function Button({ texto, estilo = 'btn btn-primary', type="submit", onClick }) {
    return (
        <>
            <button className={estilo} type={type} onClick={onClick}>
                {texto}
            </button>
        </>
    );
}