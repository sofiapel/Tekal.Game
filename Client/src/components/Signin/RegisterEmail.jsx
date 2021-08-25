import React, { useState } from 'react';
import axios from 'axios';
import GoogleButton from './GoogleButton';
import FacebookButton from './FacebookButton';
import Cookie from 'universal-cookie'
import '../Styles/registerForm.css';
import Swal from 'sweetalert2'

import getCity from '../geoLocalitation/geoLocalitation'
import { newCookie } from '../controllers/dbFunctions';

//Traducciones
import Translate from "react-translate-component";
import counterpart from "counterpart";
import en from "../../language/eng.js";
import es from "../../language/esp.js"

const RegisterWithEmail = () => {
    const cookiies = new Cookie(); //no borrar - estilo css
    const [passwordcopia, setPasswordcopia] = useState('')
    const [err, setErr] = useState('')

    const [input, setInput] = useState({
        email: "",
        password: "",
        confirmPass: "",
        name: "",
        lastname: "",
        country: "",
        age: "",
        city: "",
        gender: "prefer-not-to-say",
        ethnicity: "",
    })

    const country = getCity()

    //Estos van a estar seteando errores (osea cuando los inputs se rellenen mal estos estados van a tener algo adentro)
    /* const [errorEmail, setErrorEmail] = useState('');
    const [errorConfirmEmail, setErrorConfirmEmail] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [errorConfirmPass, setErrorConfirmPass] = useState(''); */
    const alert = () => {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        })
        Toast.fire({
            icon: 'success',
            title: 'Signed in successfully'
        })
    }

    const SendToBackEnd = async (e) => {
        e.preventDefault()
        const emailReject = /^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i
        if (!emailReject.test(input.email) && input.email.length > 0) {
            return;
        }
        const passwordReject = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/;
        if (!passwordReject.test(input.password) && input.password.length >= 0) {
            return;
        }
        if (input.password !== input.confirmPass) {
            return;
        }
        const user = {
            email: input.email,
            password: input.password,
            test: input.email,
            name: input.name,
            lastname: input.lastname,
            country: country.country,
            age: input.age,
            city: country.city,
            gender: input.gender,
            ethnicity: input.ethnicity,
        }
        console.log(user)
        const response = await axios.post(`${process.env.REACT_APP_API_URL}register`, user) ///Eliseo PONE LA RUTA DE BACK ACA XD
        if (localStorage.getItem('pruebaa')) {
            if (response.data.status) {
                alert()

                window.location.href = './preclose'
            }
            else { setErr('The email was already used') }

        }
        if (!localStorage.getItem('pruebaa')) {
            if (response.data.status) {
                alert()
                user.password = ''
                newCookie([user])
                window.location.href = './'
            }
            else { setErr('The email was already used') }

        }
    }

    const handleInputChange = function (e) {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        })
    }
    var a = cookiies.get('prueba')

    const [language, setLanguage] = useState(localStorage.getItem('idioma'));

    const lang = language;

    counterpart.registerTranslations('en', en);
    counterpart.registerTranslations('es', es);
    counterpart.setLocale(lang); /* counterpart.setLocale(lang+''); */

    return (
        <>
            {err && <h5 style={{ color: 'red' }}>{err}</h5>}
            <div class="row" onChange={handleInputChange}>
                <div class="column" >
                    <p class="dddd">{<Translate content="nombre" component="span" />}*</p>
                    <input class="swal2-inputmh4" name='name' onChange={handleInputChange} />
                    <p class="dddd">{<Translate content="nacimiento" component="span" />}</p>
                    <input class="swal2-inputmh4" type='date' name='age' onChange={handleInputChange} />
                    <p class="dddd">{<Translate content="pais" component="span" />}</p>
                    <input class="swal2-inputmh4" value={country.country ? country.country : 'empty'} name='country' onChange={handleInputChange} />
                    <p class="dddd">{<Translate content="contrasena" component="span" />}</p>
                    <input id='pass' class="swal2-inputmh4" name='password' type='password' onChange={handleInputChange} />
                    <p class="dddd">{<Translate content="genero" component="span" />}</p>
                    <select class="swal2-inputmh4" name='gender' onChange={handleInputChange}>
                        <option value='prefer-not-to-answer'> Prefer not to say</option>
                        <option value='male'>Male</option>
                        <option value='female'>Female</option>
                        <option value='non-binary'>Non binary</option>
                    </select>
                </div>
                <div class="column" >
                    <p class="dddd" >{<Translate content="apellido" component="span" />}</p>
                    <input class="swal2-inputmh4" name='lastname' onChange={handleInputChange} />
                    <p class="dddd">{<Translate content="mail" component="span" />}</p>
                    <input id='email' class="swal2-inputmh4" name='email' onChange={handleInputChange} />
                    <p class="dddd">{<Translate content="ciudad" component="span" />}</p>
                    <input class="swal2-inputmh4" value={country.city ? country.city : 'empty'} name='city' onChange={handleInputChange} />
                    <p className="dddd">{<Translate content="confirmaContrasena" component="span" />}</p>
                    <input id='confpass' class="swal2-inputmh4" name='confirmPass' type='password' onChange={handleInputChange} />
                    <p class="dddd">{<Translate content="etnia" component="span" />}</p>
                    <input class="swal2-inputmh4" name='ethnicity' onChange={handleInputChange} />
                </div>
            </div>
            <button className='buttonRegister' onClick={SendToBackEnd}> {<Translate content="botonRegistro" component="span" />} </button>
            <div className='container_buttons_register_form'>
                    <GoogleButton/>
                    <FacebookButton />
                </div>
        </>
    )
}

export default RegisterWithEmail;