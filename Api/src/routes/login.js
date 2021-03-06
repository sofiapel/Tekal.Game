const { Router, response } = require('express');
const axios = require('axios').default;
const router = Router();
const bcrypt = require('bcrypt');
const {getallUsers,getUser,newUser,queryAllInfoUser}= require ('../Controllers/dbFunctions.js')



router.get('/', async (req, res) => {
res.json(await getallUsers())
})

router.post('/', async (req, res) => {
    const user =async ()=>{if(req.body.email.length>0){return await queryAllInfoUser(req.body.email)}
else{return {}}}
    const runUser= await user()
    console.log(runUser)
    if (!runUser.Items.length){
        return res.json({ error: 'Email no register', status:'400' })
    }
    else {const validPassword = await bcrypt.compare(req.body.password, runUser.Items[0].password);
    if (!validPassword) return res.json({ error: 'error', status:'400' })
    else{
        res.json(runUser.Items)
    }}
})

module.exports = router;

// recibir la ruta
// recibir el payload
// comprobar el payload
// responder