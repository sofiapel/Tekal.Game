const { putUserGameItems } = require("../Controllers/dbFunctions");
const { endpointNoMemento, endpoint } = require("./endpoint.service");

async function loadGameInfo(array){
    let answers = [];
    let presentations = [];
    let emotion = array[2].mood;
    let email = array[0];
    let score = array[1];
    let date = array[3].date
    //console.log(date)
    for (let i = 2; i < array.length; i++) {
        var object = array[i];
        let category = array[i].category
        object.pos= i+1;
        answers.push(object.answer);
        let pkAssetsTarget = object.type === "image"? endpointNoMemento(object.url) : endpoint(object.url);
        presentations.push({ id:pkAssetsTarget, category: category });
    }
    console.log(presentations)
    let data = {
        email: email,
        score: score,
        answer: answers,
        presentation: presentations,
        emotion: emotion,
        date: date,
        type: array[2].type,
        longTerm: array[2].longTerm
    }
    let games = await putUserGameItems(data);
    return games;
}

module.exports = { loadGameInfo }