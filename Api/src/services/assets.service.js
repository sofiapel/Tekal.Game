const { updateView, updateAnnotationsCorrect, putAssets, queryAllInfoUser } = require("../Controllers/dbFunctions");
const { endpointNoMemento, endpoint } = require("./endpoint.service");

async function loadEndpoints(array){
    let email = array[0];
    let urls = [];
    const userInfo = await queryAllInfoUser(email);
    const age = userInfo.Items[0].age;
    const country = userInfo.Items[0].country;
    for (let i = 2; i < array.length; i++) {
        var object = info[i];
        object.age = age;
        object.mood = object.mood;
        object.country = country;
        object.pos = i - 2;
        let pkAssetsTarget = object.type === "image"? endpointNoMemento(object.url) : endpoint(object.url);
        object.url = pkAssetsTarget;
        if (array[i].category === "target"){
            updateView(pkAssetsTarget);
        }
        if (array[i].category === "target_repeat" && array[i].answer == 1){
            updateAnnotationsCorrect(pkAssetsTarget);
        }
        if (urls.includes(pkAssetsTarget)) {
            let index = urls.indexOf(pkAssetsTarget) + 1;
            object.repeated = true;
            object.pos_1st = object.pos - index;
            object.lag = object.pos - object.pos_1st;
        } else {
            urls.push(pkAssetsTarget);
            object.repeated = false;
        }
        await putAssets(email, object);
    }
}

module.exports = { loadEndpoints }