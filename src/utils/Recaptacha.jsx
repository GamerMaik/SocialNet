import ReCAPTCHA from "react-google-recaptcha";
// eslint-disable-next-line react/prop-types
export function Captcha({funcion, referencia}){

    return(
        <div className='recaptcha' style={{marginTop:"20px", marginBottom:"20px"}}>
            <ReCAPTCHA
                ref={referencia}
                sitekey="6LekENopAAAAADsJsteqfkOQ7u75TepM52BsQFZV"
                onChange={funcion}
            />
        </div>
    )
}