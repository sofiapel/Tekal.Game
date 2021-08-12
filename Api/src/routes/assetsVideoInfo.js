const { Router } = require('express');
const router = Router()
const { putAssets } = require('../Controllers/dbFunctions')




router.post('/', async (req, res) => {
    let info = req.body; 
    let urls = []
    try{
        for (var i = 0; i < info.length; i++) {
            var object = info[i];
            object.pos= i+1;
            if(urls.includes(object.url)){
                let index = urls.indexOf(object.url)+1
                object.repeated = true;
                object.pos_1st = object.pos - index;
                object.lag = object.pos - object.pos_1st;
            }else{
                urls.push(object.url)
                object.repeated = false;
            }
            console.log(object)
            }
        }   
    catch(error){
        console.log(error);
    }
})


module.exports = router