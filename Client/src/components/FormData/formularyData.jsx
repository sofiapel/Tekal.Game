import React, { useState } from 'react';
import axios from 'axios';
import Cookie from 'universal-cookie'
import getCity from '../geoLocalitation/geoLocalitation'
import { newCookie } from '../controllers/dbFunctions';
import '../Styles/formularyDataExtra.css';

import Translate from "react-translate-component";
import counterpart from "counterpart";
import en from "../../language/eng.js";
import es from "../../language/esp.js"


const FormData = () => {

    const cookies = new Cookie();
    const [err, setErr] = useState('')

    
    const [countrytext, setcountrytext] = useState('')
    const [citytext, setscitytext] = useState('')

    const country = getCity()
    const [input, setInput] = useState({
        country: "",
        age: "",
        city: "",
        gender: "",
        ethnicity: "",
    })
    let emailCokkie = ''
    if (!cookies.get('userInfo').Items) { emailCokkie = cookies.get('userInfo')[0].email }
    else { emailCokkie = cookies.get('userInfo').Items[0].email }


    const handleInputChange = function (e) {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        })
    }

    const SendToBackEnd = async () => {
        const user = {
            email: emailCokkie,
            country: countrytext,
            age: input.age,
            city: citytext,
            gender: input.gender,
            ethnicity: input.ethnicity,
        }
        console.log(user)
        if (!input.gender.length) {
            setErr('Completa los campos')
        }
        else {var response = await axios.post(`${process.env.REACT_APP_API_URL}addinfo`, user)} ///Eliseo PONE LA RUTA DE BACK ACA XD
        if (response.data === 'campos incompletos') {
            setErr('Completa los campos')
        }
        else {

            if (localStorage.getItem('results')) {
                window.location.href = ('/close')
            } else {
                // cookies.remove('userInfo')
                // window.location.href = ('')
            }
        }
    }

    // Traducciones
    if (!localStorage.getItem('idioma')) {
        localStorage.setItem('idioma', 'es')
    }

    const handleChange = (e) => {
        localStorage.setItem('idioma', `${e.target.value}`)
        setLanguage(localStorage.getItem('idioma'))
    }

    const [language, setLanguage] = useState(localStorage.getItem('idioma'));

    const lang = language;

    counterpart.registerTranslations('en', en);
    counterpart.registerTranslations('es', es);
    counterpart.setLocale(lang); /* counterpart.setLocale(lang+''); */



    return (
        <div className='containerFormExtra'>
            {err && <h5 style={{ color: 'red' }}>{err}</h5>}
            <div className="row" onChange={handleInputChange}>
                <div className="column" >
                    {/* <p className="text_input_extra_data">{<Translate content="nombre" component="span" />}*</p>
                    <input className="swal2-inputmh4" name='name' onChange={handleInputChange} /> */}
                    <p className="text_input_extra_data">{<Translate content="nacimiento" component="span" />}</p>
                    <input className="swal2-inputmh4" type='date' name='age' onChange={handleInputChange} />
                    <p className="text_input_extra_data">{<Translate content="pais" component="span" />}</p>
                    <input className="swal2-inputmh4" value={country.city ? country.country : countrytext} name='city' onChange={(e) => setcountrytext(e.target.value)} />
                    <p className="text_input_extra_data">{<Translate content="genero" component="span" />}</p>
                    <select className="swal2-inputmh4" name='gender' onChange={handleInputChange}>
                        <option value='' hidden selected>{''}</option>
                        <option value='prefer-not-to-answer'> Prefer not to say</option>
                        <option value='male'>Male</option>
                        <option value='female'>Female</option>
                        <option value='non-binary'>Non binary</option>
                    </select>
                </div>
                <div className="column" >
                    {/* <p className="text_input_extra_data" >{<Translate content="apellido" component="span" />}</p>
                    <input className="swal2-inputmh4" name='lastname' onChange={handleInputChange} /> */}
                    <p className="text_input_extra_data">{<Translate content="ciudad" component="span" />}</p>
                    <input className="swal2-inputmh4" value={country.city ? country.city : citytext} name='city' onChange={(e) => setscitytext(e.target.value)} />
                    <p className="text_input_extra_data">{<Translate content="etnia" component="span" />}</p>
                    <input className="swal2-inputmh4" name='ethnicity' onChange={handleInputChange} />
                </div>
            </div>
            <button className='buttonRegisterExtraData' onClick={SendToBackEnd}>{<Translate content="botonRegistro" component="span" />} </button>
        </div>
    )
}

export default FormData;