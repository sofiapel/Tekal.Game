import React, { useEffect, useState, useRef } from 'react';
import VideoPlayer from '../VideoPlayer/VideoPlayer'
import Loading from '../Loading/Loading';
import { useDispatch } from 'react-redux';
import { recVideo, seenVideos } from '../../redux/action';
import style from '../Styles/Game.module.css'
import Cookie from 'universal-cookie'
import axios from 'axios'
import ImagePlayer from '../ImagePLayer/ImagePlayer';

// Simulamos el arry de imagenes
import imagePueba from '../../assets/img/imagesPrueba';


export const Game = () => {

  const dispatch = useDispatch();
  const tope = useRef(0)
  const mode = localStorage.getItem('mode')
  const [infoUser, SetInfoUser] = useState('')
  var emailCokkie;
  const cookies = new Cookie();

  const [videoApi, setVideosApi] = useState() // videos provenientes de la base de datos
  // console.log(videoApi)
  const [videoBlop, setVideoBlop] = useState() // array con las URL convertidas
  // console.log(videoBlop)
  const videoToSeeBlop = useRef() // videos con la URL Blop
  // console.log(videoToSeeBlop.current)

  const [imageApi, setImageApi] = useState() // de prueba guarda las imagenes
  useEffect(() => {
    if (!videoApi) {
      if (mode === 'videos') {
        axios.post('http://localhost:3001/links', {
          email: emailCokkie
        })
          .then(res => {
            setVideosApi(res.data)
          })
      } else {
        setTimeout(() => {
          videoToSeeBlop.current = imagePueba
          setImageApi(imagePueba)
        }, 3000)
      }
    }
    if (videoApi) {
      var arregloPromesas = videoApi[2].map(async (url) => {
        return await fetch(url[0].url)
          .then(function (res) {
            return res.blob()
          })
          .then(function (video) {
            var url = URL.createObjectURL(video)
            return url
          })
      })
      Promise.all(arregloPromesas)
        .then((arregloPromesasResultas) => {
          setVideoBlop(arregloPromesasResultas)
        })
    }

  }, [videoApi])

  /*----------------------------------------*/

  // Si no estas logeado te reedirige a login

  // if (!cookies.get('userInfo')) {
  //   window.location.href = ('/login')
  // }

  //Sacando el email
  if (cookies.get('userInfo')) {
    if (!cookies.get('userInfo').Items) { emailCokkie = cookies.get('userInfo')[0].email }
    else { emailCokkie = cookies.get('userInfo').Items[0].email }
  }

  //Sacando info
  const CheckUserData = async (email) => {
    let SearchEmail = {
      email: email
    }
    let response = await axios.post('http://localhost:3001/info', SearchEmail)
    SetInfoUser(response)
    return response
  }
  if (!infoUser) {
    CheckUserData(emailCokkie);
  }
  if (infoUser) {
    // if (!infoUser.data.Items[0].age || !infoUser.data.Items[0].name) {
    //   window.location.href = ('form')
    // }
  }

  // Selecciona un template al azar

  /* var random = Math.round(Math.random() * 999)
  const template = require(`../../assets/level_templates/template_${random}.json`); */

  /*  const videoObj = videoArr.map(e => Object.create({}, { // en cada posicion hay un objeto
     id: { value: e[0] },
     category: { value: e[1] },
     url: { value: e[2] }
   })) */

  // console.log(videoObj)

  // -------

  /*  const arrVideos = videosURL.map((e, i) => Object.create({}, {
     id: { value: i },
     url: { value: e },
   }))
   
   let videosToSee = [] // array nuevo
   template[2].map(e => {
     videosToSee.push(arrVideos.filter(b => b.id === e[0]))
     videosToSee[videosToSee.length - 1].category = e[1]
   }); */

  // console.log(videosToSee)
  // console.log(template)

  // Elige el video que el usuario va a ver

  function recVideos() {
    if (videoApi) {
      if (tope.current >= videoApi[2].length) {
        return null
      } else {
        viewVideos();
        dispatch(recVideo(videoToSeeBlop.current[tope.current]));
        tope.current++;
      }
    }
  }

  function recImages() {
    if (videoToSeeBlop.current) {
      if (tope.current >= videoToSeeBlop.current.length) {
        return null
      } else {
        viewVideos();
        dispatch(recVideo(videoToSeeBlop.current[tope.current]));
        tope.current++;
      }
    }
  }

  // Guarda los videos que el usuario ve

  function viewVideos() {
    // dispatch(seenVideos(videoApi[2], tope.current)); // original de los videos
    dispatch(seenVideos(videoToSeeBlop.current, tope.current));
    /*  if (mode === 'images') {
       tope.current++;
     } */
  }

  // Cambio de videos y guarda un nuevo array con los blop

  useEffect(() => {
    if (videoBlop) {
      let blop = videoApi[2].map((e, i) => {
        let arr = []
        arr.push({ ...e[0], urlBlop: videoBlop[i] }, e[1])
        return arr
      })
      videoToSeeBlop.current = blop
    }
    recVideos();
    recImages();
  }, [videoBlop, imageApi]);

  return (
    < >
      <div className={style.fondo3}>
        {
          !videoBlop && !videoToSeeBlop.current ? <Loading /> :
            videoBlop && !videoToSeeBlop.current ? <VideoPlayer className={style.video} videoApi={videoApi[2]} target={videoApi[0]} recVideos={recVideos} email={emailCokkie} /> :
              <ImagePlayer recImages={recImages} />
        }
      </div>
    </>
  )
}

export default Game;
