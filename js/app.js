let multiplayerItemTitle = document.querySelector("#multiplayer__item-title");
let multiplayerItemChoise = document.querySelector("#multiplayer__item-choise");
let multiplayerItemCheckbox = document.querySelector("#multiplayer__item-checkbox");
let multiplayerInput = document.querySelector("#multiplayer__input");
let multiplayerButtonPlayer = document.querySelector("#multiplayer__button-player");
let multiplayerButtonHint = document.querySelector("#multiplayer__button-hint");
let multiplayerListPlayer = document.querySelector("#multiplayer__list-player");
let multiplayerPlayersCities = document.querySelector("#multiplayer__players-cities");
let multiplayerComputerCities = document.querySelector("#multiplayer__computer-cities");
let playerCity = document.querySelector("#player__city");
let computerCity = document.querySelector("#computer__city");
let multiplayerListComputer = document.querySelector("#multiplayer__list-computer");
let information = document.querySelector("#information");
let informationText = document.querySelector("#information__text");
let informationHint = document.querySelector("#information__hint");
let soundButton = document.querySelector("#sound__button");
let keyboardRowName = document.querySelector("#keyboard__row-name");
let keyboardInner = document.querySelector("#keyboard__inner");
let keyboardInnerUp = document.querySelector("#keyboard__inner-up");
let content = document.querySelector("#content");
let contentItemPlayer = document.querySelector("#content__item-player");
let contentItemComputer = document.querySelector("#content__item-computer");
let contentTitlePlayer = document.querySelector("#content__title-player");
let contentImgPlayer = document.querySelector("#content__img-player");
let contentInfoPlayerText = document.querySelector("#content__info-player-text");
let contentTitleComputer = document.querySelector("#content__title-computer");
let contentImgComputer = document.querySelector("#content__img-computer");
let contentInfoComputerText = document.querySelector("#content__info-computer-text");
let playerResult = document.querySelector("#player-result");
let popup = document.querySelector("#popup");
let popupButton = document.querySelector("#popup__button");
let popupButtonProceedgame = document.querySelector("#popup__button-proceedgame");
let popupButtonNewgame = document.querySelector("#popup__button-newgame");
let popupHeaderTitle = document.querySelector("#popup__header-title");
let popupMainImage = document.querySelector("#popup__main-image");
let popupImg = document.querySelector("#popup__img");
let popupMainText = document.querySelector("#popup__main-text");
let loadWindow = document.querySelector("#load-window");
let loadPlayer = document.querySelector("#load-player");
let loadComputer = document.querySelector("#load-computer");
let loadPopup = document.querySelector("#load-popup");
let arrayPlayer = [];
let arrayComputer = [];
let arrayKeyboard = [];
let lastCompLetter = null;
let hintCheck = 0;
let playText = false;
let infoCity = false;
let sure = false;
let cuurentCity;
const forCORS = "https://www.256.by/spider/GetContentFromUrl.php";
const CITIES_URL = "https://raw.githubusercontent.com/aZolo77/citiesBase/master/cities.json";
const WIKI = "https://ru.wikipedia.org/wiki/{{City}}";

// Gives sounds 
const getAudio = (flag) => {
    if (soundButton.dataset.soundoff !== "soundOff") {
        let buttonClick = document.createElement("audio");
        if (flag === "click") {
            buttonClick.src = "audio/click.mp3";
            buttonClick.play();
        }
    }
}

// Fetch the cities list
const getCitiesFromWEB = () => {
   fetch(`${CITIES_URL}`)
   .then(response => response.json())
   .then(cities => getCityName(getActualArray(getCities(cities.city))))
   .catch((error) => {
      console.log("Error: ", error);
   });
}

// Fetch the city from wiki
const getCityFromWiki = (currentCity, text, img) => {
   var formdata = new FormData();
   formdata.append("ext_url", `${WIKI.replace("{{City}}", currentCity)}`);
   fetch("https://www.256.by/spider/GetContentFromUrl.php", {
   method: 'POST',
   body: formdata,
   redirect: 'follow'
   })
   .then(response => response.text())
   .then(result => getWikiInfo(result, text, img, currentCity))
   .catch(error => console.log('error', error));
}

window.addEventListener('load', ()=> {
    hidePreloader(loadWindow);
    checkLSCheckboxStatus();
});

setTimeout(()=>{
    window.socketManager.sendMessage({
    type: "stopVoiceRecord"
})}, 6000);

window.panelSpace.continueWithoutPhone = () => {
    document.querySelector('.space_popup-disconnect').style.display = 'none'
    microImg.src = "https://ndc.sqilsoft.by/downloads/srsm/res/icon/microphone.png"
    window.panelSpace.showPopup = true //VERY IMPORTANT
}

window.panelSpace.continueWithPhone = () => {
    window.panelSpace.showPopup = false //VERY IMPORTANT
    window.socketManager.sendMessage({"type": 'stopVoiceRecord'})
    window.socketManager.sendMessage({"type": 'startVoiceRecord'})
    document.querySelector('.space_popup-disconnect').style.display = 'none'
}

if(window != window.top){
	document.querySelector(".wrapper").style.cssText="margin-top: 0px;";
}

window.socketManager.processedMessages = (data) => {
    if(data.value){
        data.value = data.value.toLowerCase();
    }
    if (localStorage.getItem('markerIndication') && data.type === 'startVoiceRecord') microImg.src = "https://ndc.sqilsoft.by/downloads/srsm/res/icon/microphone_on.png"
    if (localStorage.getItem('markerIndication') && data.type === 'stopVoiceRecord') microImg.src = "https://ndc.sqilsoft.by/downloads/srsm/res/icon/microphone.png"
    if(data.type === 'sttResult' && data.value && data.value !== 'заново' && data.value !== 'подсказка' && !infoCity && data.value !== 'расскажи' && data.value !== 'информация' && !sure){
        if(JSON.parse(localStorage.getItem('markerIndication'))){
            document.getElementsByClassName('multiplayer__item')[1].classList.remove('record');
        }
        multiplayerInput.value = data.value[0].toUpperCase() + data.value.slice(1);
        userClick();
    } else if(data.type === 'ttsPlaybackEnd' && data.eventEmitter ==='app' && !infoCity && !sure) {
            playText = false;    
            multiplayerButtonHint.removeAttribute("disabled");
            multiplayerButtonHint.classList.remove("js-disabled");
            multiplayerButtonHint.classList.add("js-active__button");    
            window.socketManager.sendMessage({
                type:"startVoiceRecord"
            })
    } else if(data.type ==='hint' ){
        playText = false;      

        window.socketManager.sendMessage({
            type:"startVoiceRecord"
        })
    }  else if(data.type === 'sttResult' && data.value === 'заново' && !infoCity && !sure){
        if(JSON.parse(localStorage.getItem('markerIndication'))){
            document.getElementsByClassName('multiplayer__item')[1].classList.remove('record');
        }
        showSurePopup();
    } else if(data.type === 'sttResult' && data.value === 'подсказка' && !infoCity && !sure){
        if(JSON.parse(localStorage.getItem('markerIndication'))){
            document.getElementsByClassName('multiplayer__item')[1].classList.remove('record');
        }
        if(!multiplayerButtonHint.disabled){
            hintSupport();
        } else{
            window.socketManager.sendMessage({
                type:"playTts",
                value:"Подсказка недоступна"
            })
            playText = true;
        }
        
    } else if(data.type === 'sttResult' && (data.value === 'расскажи' ||  data.value === 'информация') && !infoCity && !sure){
        if(JSON.parse(localStorage.getItem('markerIndication'))){
            document.getElementsByClassName('multiplayer__item')[1].classList.remove('record');
        }
        window.socketManager.sendMessage({
            type:"playTts",
            value:"О каком городе?",
            ttsEndEventType: "infoCity"
        })
        playText = true;
    } else if(data.type === 'sttResult' && data.value === null ){
        if(JSON.parse(localStorage.getItem('markerIndication'))){
            document.getElementsByClassName('multiplayer__item')[1].classList.remove('record');
        }
        window.socketManager.sendMessage({
            type:"playTts",
            value:"Повторите"
        })
        playText = true;
    }  else if(data.type === 'infoCity'){
        infoCity = true;
        window.socketManager.sendMessage({
            type:"startVoiceRecord"
        })
        playText = false;
    } else if(data.type === 'playTts' && !sure){
            multiplayerButtonHint.setAttribute("disabled", true);
            multiplayerButtonHint.classList.add("js-disabled");
            multiplayerButtonHint.classList.remove("js-active__button");    
    } else if(data.type === 'sttResult' && data.value !== null && infoCity && !sure){
        if(JSON.parse(localStorage.getItem('markerIndication'))){
            document.getElementsByClassName('multiplayer__item')[1].classList.remove('record');
        }
        if(data.value === document.getElementById('content__title-player').innerText.toLowerCase()){
          	currentCity = 'player'
            showInfoInConsol(document.querySelector("#content__info-player-text").innerText);
            showPopupFromCitiesList(document.getElementById("content__title-player"));
          	
        } else if(data.value === document.getElementById('content__title-computer').innerText.toLowerCase()){
          	currentCity = 'computer'  
          	showInfoInConsol(document.querySelector("#content__info-computer-text").innerText);
            showPopupFromCitiesList(document.getElementById("content__title-computer"));
          
        } else {
            window.socketManager.sendMessage({
                type:"playTts",
                value:"Такого города здесь нет",
                ttsEndEventType: "infoCity"
            })
            playText = true;
        }
    } else if(data.type === 'sttResult' && data.value === null && infoCity && !sure){
        infoCity = true;
        if(JSON.parse(localStorage.getItem('markerIndication'))){
            document.getElementsByClassName('multiplayer__item')[1].classList.remove('record');
        }
        window.socketManager.sendMessage({
            type:"startVoiceRecord"
        })
    } else if(data.type === 'cityReturn' && !sure){
        infoCity = false;
        playText = false
         setTimeout(()=>{
            window.socketManager.sendMessage({
                type:"startVoiceRecord"
            })
            hidePopup();
        }, 1000)
    } else if(data.type === 'startVoiceRecord' ){
        if(JSON.parse(localStorage.getItem('markerIndication'))){
            document.getElementsByClassName('multiplayer__item')[1].classList.add('record');
        }
    } else if(data.type === 'stopVoiceRecord'){
        if(JSON.parse(localStorage.getItem('markerIndication'))){
            document.getElementsByClassName('multiplayer__item')[1].classList.remove('record');
        }
    } else if (data.type === 'resetWords' && sure){
        window.socketManager.sendMessage({
            type:"startVoiceRecord"
        })
    }else if (data.type === 'sttResult' && data.value ==='да' && sure){
        reset();
    }else if (data.type === 'sttResult' && data.value ==='нет' && sure){
        noReset();
    }
}

// Runs a check of local storage when DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    checkSaveGame('Player_result', arrayPlayer);
    checkSaveGame('Computer_result', arrayComputer);
});

// Checks if local storage contains information
const checkSaveGame = (LSKey, arrayCitiesInGame) => {
    if (localStorage.getItem(LSKey) !== null) {
        arrayCitiesInGame.push(...JSON.parse(localStorage.getItem(LSKey)));
        localStorage.setItem(LSKey, JSON.stringify(arrayCitiesInGame));
        continueGame();
    } 
}

// Writes checkbox status in LocalStorage
const writeLSCheckboxStatus = () => {
    if (multiplayerItemCheckbox.checked) {
        localStorage.setItem('checked', JSON.stringify(true));
    } else {
        localStorage.setItem('checked', JSON.stringify(false));
    }
}

// Checks checkbox status in LocalStorage
const checkLSCheckboxStatus = () => {
    if (JSON.parse(localStorage.getItem('checked')) === true) {
        multiplayerItemCheckbox.checked = true;
    } else {
        multiplayerItemCheckbox.checked = false;
    }
}

// Checks sound button status in LocalStorage
const checkSoundButtonStatus = (condition) => {
    if (condition) {
        soundButton.dataset.soundoff = "soundOff";
        document.querySelector("#sound__off").classList.add("js-active-sound");
        document.querySelector("#sound__on").classList.add("js-unactive-sound");
    } else {
        soundButton.dataset.soundoff = "";
        document.querySelector("#sound__off").classList.remove("js-active-sound");
        document.querySelector("#sound__on").classList.remove("js-unactive-sound");
    }
}

// EventListener for status records checkbox LocalStorage
multiplayerItemCheckbox.addEventListener("click", () => {
    getAudio("click");
    writeLSCheckboxStatus();
});

// Writes keyboard status LocalStorage
const writeLSKeyboardStatus = () => {
    if (keyboardInner.classList.contains("js-active-keyboard")) {
        localStorage.setItem('keyboard', JSON.stringify(true));
        localStorage.setItem('keyboardUp', JSON.stringify(false));
    } else {
        localStorage.setItem('keyboard', JSON.stringify(false));
        localStorage.setItem('keyboardUp', JSON.stringify(true));
    }
    if (keyboardInnerUp.classList.contains("js-active-keyboard")) {
        localStorage.setItem('keyboardUp', JSON.stringify(true));
    } else {
        localStorage.setItem('keyboardUp', JSON.stringify(false));
    }
}

// Writes parameters in local storage
const setInLocalStorage = () => {
    localStorage.setItem('Player_result', JSON.stringify(arrayPlayer));
    localStorage.setItem('Computer_result', JSON.stringify(arrayComputer));
    localStorage.setItem('lastCompLetter', JSON.stringify(getHintsLastLetter()));
}

// Clears LocalStorage
const clearLocalStorage = () => {
    localStorage.removeItem('Player_result');
    localStorage.removeItem('Computer_result');
    localStorage.removeItem('keyboard');
    localStorage.removeItem('keyboardUp');
    localStorage.removeItem('lastCompLetter');
    arrayPlayer.length = 0;
    arrayComputer.length = 0;
}

// Continues game after reloading
const continueGame = () => {
    multiplayerPlayersCities.innerHTML = arrayPlayer.map(city => 
        `<li class="player__city" id="player__city" title="Нажми, чтобы увидеть информацию">${city}</li>`
        ).join(", ");
    multiplayerComputerCities.innerHTML = arrayComputer.map(city => 
        `<li class="computer__city" id="computer__city" title="Нажми, чтобы увидеть информацию">${city}</li>`
        ).join(", ");
    multiplayerInput.value = `${JSON.parse(localStorage.getItem('lastCompLetter'))}`;
    playerResult.innerHTML = arrayPlayer.length;
    content.classList.add("js-active");
    renderInfoPhoto(getCurrentCity(arrayPlayer[0], citiesOfBelarusInfo), arrayPlayer[0], contentInfoPlayerText, contentImgPlayer);
    showCityInTitle(arrayPlayer[0], contentTitlePlayer);
    addCityInAttribute(arrayPlayer[0], contentItemPlayer);
    renderInfoPhoto(getCurrentCity(arrayComputer[0], citiesOfBelarusInfo), arrayComputer[0], contentInfoComputerText, contentImgComputer);
    showCityInTitle(arrayComputer[0], contentTitleComputer);
    addCityInAttribute(arrayComputer[0], contentItemComputer);
    setHintsLastLetter(JSON.parse(localStorage.getItem('lastCompLetter')));
    checkLSCheckboxStatus();
    pushLastLetterInArrKeyboard(JSON.parse(localStorage.getItem('lastCompLetter')));
    if (JSON.parse(localStorage.getItem('keyboard')) === true) {
        keyboardInner.classList.add("js-active-keyboard");
    }
    if (JSON.parse(localStorage.getItem('keyboardUp')) === true) {
        keyboardInnerUp.classList.add("js-active-keyboard");
    }
    checkSoundButtonStatus(JSON.parse(localStorage.getItem('soundOff')) === true);
}

// Show preloader
const showPreloader = () => {
    loadPlayer.classList.remove("js-none");
    loadComputer.classList.remove("js-none");
    loadPopup.classList.remove("js-none");
};

// Hide preloader
const hidePreloader = (parameter) =>  parameter.classList.add("js-none");

// EventListener for player's image preloader
contentImgPlayer.addEventListener("load", () => hidePreloader(loadPlayer));

// EventListener for computer's image preloader
contentImgComputer.addEventListener("load", () => hidePreloader(loadComputer));

// EventListener for popup's image preloader
popupImg.addEventListener("load", () => hidePreloader(loadPopup));

window.panelSpace.renderPanel();
let microImg = document.querySelector('#space_microImg');

function speechPlayerCity(){
    if(JSON.parse(localStorage.getItem('markerIndication'))){
        window.socketManager.sendMessage({
            type: "stopVoiceRecord"
        })
        window.socketManager.sendMessage({
            type: "stopTtsPlayback"
        })
        setTimeout(()=>{
            window.socketManager.sendMessage({
                type: "playTts",
                value: `${document.querySelector('#content__info-player-text').innerText}`
            })
            playText = true;
        }, 500)
       
    }
}

function speechComputerCity(){
    if(JSON.parse(localStorage.getItem('markerIndication'))){
        window.socketManager.sendMessage({
            type: "stopVoiceRecord"
        })
        window.socketManager.sendMessage({
            type: "stopTtsPlayback",
            context: 'info'
        })
        setTimeout(()=>{
            window.socketManager.sendMessage({
                type: "playTts",
                value: `${document.querySelector('#content__info-computer-text').innerText}`
            })
        }, 500)
    }
}

 // EventListener for show/hide the virtual keyboard
 keyboardRowName.addEventListener("click", () => {
    getAudio("click");
    if (keyboardInnerUp.dataset.keyboard === "KeyboardUp") {
    keyboardInnerUp.classList.toggle("js-active-keyboard");
    writeLSKeyboardStatus();
    } else {
    keyboardInner.classList.toggle("js-active-keyboard");
    writeLSKeyboardStatus();
    }    
});

// Pushing hint word into array keyboard
const pushHintInArrKeyboard = () => {
    arrayKeyboard.length = 0;
    arrayKeyboard.push(...information.dataset.hintcity.split(""));
}

//Pushing last letter in keyboard array
const pushLastLetterInArrKeyboard = (lastLetter) => {
    arrayKeyboard.length = 0;
    arrayKeyboard.push(lastLetter);
}

//Keyboard logic 
const getKeyboard = (event) => {
    if (event.target.closest("#keyboard__key") && !event.target.closest("#keyboard__key").hasAttribute("data-action")) {
        getAudio("click");
        arrayKeyboard.push(event.target.closest("#keyboard__key").innerHTML.trim());
        multiplayerInput.value = arrayKeyboard.join("")[0].toUpperCase() + arrayKeyboard.join("").slice(1);
    } else if (event.target.closest("#keyboard__key") && event.target.closest("#keyboard__key").hasAttribute("data-action")) {
        getAudio("click");
        if (multiplayerInput.value !== "" && event.target.closest("#keyboard__key").dataset.action === "Backspace") {
            if (arrayKeyboard.length > 1) {
                arrayKeyboard.pop();
                multiplayerInput.value = arrayKeyboard.join("")[0].toUpperCase() + arrayKeyboard.join("").slice(1);
            } else {
                arrayKeyboard.pop();
                multiplayerInput.value = "";
            }
        }
        if (event.target.closest("#keyboard__key").dataset.action === "Clear") {
            arrayKeyboard.length = 0;
            multiplayerInput.value = "";
        }
        if (event.target.closest("#keyboard__key").dataset.action === "Enter") {
            userClick();
        }
        if (event.target.closest("#keyboard__key").dataset.action === "Space") {
            arrayKeyboard.push(" ");
            multiplayerInput.value = arrayKeyboard.join("")[0].toUpperCase() + arrayKeyboard.join("").slice(1);
        }
        if (event.target.closest("#keyboard__key").dataset.action === "Up") {
            keyboardInner.classList.remove("js-active-keyboard");
            keyboardInnerUp.classList.add("js-active-keyboard");
            keyboardInnerUp.dataset.keyboard = "KeyboardUp";
            writeLSKeyboardStatus();
        }
        if (event.target.closest("#keyboard__key").dataset.action === "Down") {
            keyboardInner.classList.add("js-active-keyboard");
            keyboardInnerUp.classList.remove("js-active-keyboard");
            keyboardInnerUp.dataset.keyboard = " ";
            writeLSKeyboardStatus();
        }
    }
}

// EventListener for virtual keyboard input
keyboardInner.addEventListener("click", event => {
    getKeyboard(event);
});

// EventListener for virtual keyboard Up input
keyboardInnerUp.addEventListener("click", event => {
    getKeyboard(event);
});

// EventListener for removing elements from array after virtual keyboard input
multiplayerInput.addEventListener("keyup", event => {
    getAudio("click");
    if (event.code === "Backspace") {
        arrayKeyboard.splice(-1, 1);
    }
});

// Shows popup for confirmation 
const showSurePopup = () => {
    showPopup();
    popupHeaderTitle.innerHTML = `Внимание.`;
    popupMainImage.classList.add("js-none");
    popupButtonProceedgame.classList.add("js-active-button");
    popupButtonProceedgame.innerHTML = `Нет`;
    popupButtonNewgame.classList.add("js-active-button");
    popupButtonNewgame.innerHTML = `Да`;
    popupButton.classList.add("js-none");
    popupMainText.innerHTML = `Начать заново?`;
    popupButtonProceedgame.addEventListener("click", () => {
        getAudio("click");
        hidePopup();
    });
    popupButtonNewgame.addEventListener("click", () => {
        getAudio("click");
        setTimeout( () => {
            location.reload();
            clearLocalStorage();
            hidePopup();
            checkLSCheckboxStatus();
            window.socketManager.sendMessage({
                type: 'playTts',
                value: 'Вы хотите начать заново?',
                ttsEndEventType: 'resetWords'
            })
            sure = true;
        }, 500)
    });
}

const getResult = () => {
   return playerResult.innerHTML = arrayPlayer.length
}

// EventListener for the button to reload the game 
multiplayerItemTitle.addEventListener("click", () => {
    getAudio("click");
    showSurePopup();
});

// EventListener for the game reload button to change its name
multiplayerItemTitle.addEventListener("mouseover", () => {
        document.querySelector("#player-result-text").innerText = "Начать заново";
        document.querySelector("#player-result").classList.add("js-none");
});

// EventListener for the reload button of the game to change its name to the original one
multiplayerItemTitle.addEventListener("mouseout", () => {
        document.querySelector("#player-result-text").innerText = "Счет:";
        document.querySelector("#player-result").classList.remove("js-none");
});

// EventListener for toggle checkbox
multiplayerItemChoise.addEventListener("click", event => {
    if (!event.target.closest("#multiplayer__item-checkbox")) {
        getAudio("click");
        if (multiplayerItemCheckbox.checked) {
            multiplayerItemCheckbox.checked = false;
            localStorage.setItem('checked', JSON.stringify(false));
        } else {
            multiplayerItemCheckbox.checked = true;
            localStorage.setItem('checked', JSON.stringify(true));
        }
    }
});

// EventListener for the player button to make a move
multiplayerButtonPlayer.addEventListener("click", () => {
    getAudio("click");
    userClick();
});

function noReset(){
    sure = false;
    window.socketManager.sendMessage({
        type:"startVoiceRecord"
    })
}

function reset(){
    location.reload();
}

function userClick(){
    checkCitiesArray();
    if (multiplayerButtonPlayer.dataset.information == "Hint") {
        multiplayerInput.value = information.dataset.hintcity;
        pushHintInArrKeyboard();
        hideInfo();
    }
}

// Shows temporary content while information load
const showTemporaryInfo = () => {
    contentInfoPlayerText.innerHTML = `Подождите немного, загружается информация о городе.`;
    contentInfoComputerText.innerHTML = `Подождите немного, загружается информация о городе.`;
    contentTitlePlayer.setAttribute("src", `./img/first.jpg`);
    contentImgComputer.setAttribute("src", `./img/first.jpg`);
}

// Checks which array of cities is selected 
const checkCitiesArray = () => {
    if (multiplayerItemCheckbox.checked) {
        getCityName(getActualArray(getCitiesOfBelarus(citiesOfBelarusInfo)));
    } else {
        getCityName(getActualArray(getCities(cities)));
    }
    if (arrayPlayer.length !== 0) {
    getComputerTurn();
    }
}

// Shows important information 
const showInfo = () => {
    information.classList.add("js-active__information");
    information.dataset.information = "Info";
}

// Hides important information
const hideInfo = () => {
    information.classList.remove("js-active__info-hint");
    information.classList.remove("js-active__information");
    multiplayerButtonPlayer.classList.remove("js-active__information");
    multiplayerButtonPlayer.classList.remove("js-active__info-hint");
    informationText.innerHTML = "Отличной игры!";
    informationHint.innerHTML = "";
    multiplayerButtonPlayer.dataset.information = "";
    information.dataset.information = "";
}

// Returns cities wich was already played
const getPlayedCities = () => {
    let newArr = [];
    let citiesPlayedArray = newArr.concat(arrayPlayer, arrayComputer);
    return citiesPlayedArray;
}

// Returns actualArray after deleting cities which was named from arrayCities
const getActualArray = (arrayCities) => {
    let actualArray = arrayCities.filter(city => !getPlayedCities().includes(city));
    return actualArray;
}

// Returns cities names from world cities database 
const getCities = (cities) => {
    let arrayWorldCities = cities.map(city => {
      if (city.name.includes(")")) {
        return city.name.split("(").slice(0, 1).join().trim();
      } else {
        return city.name;
      }
    });
    return arrayWorldCities;
};

// Returns cities names from Belarussian cities database
const getCitiesOfBelarus = (citiesOfBelarusInfo) => {
    let arrayCitiesOfBelarus = [];
    let arrayItems = citiesOfBelarusInfo[0].regions.map(item => item.cities);
    for (item of arrayItems) {
        arrayCitiesOfBelarus.push(...(item.map(cityBel => cityBel.name)));
    }
    return arrayCitiesOfBelarus;
}

// Returns array of current city 
const getCurrentCity = (cityInPlay, citiesOfBelarusInfo) => {
    let arrayCurrentCityOfBelarus = [];
    let arrayItems = citiesOfBelarusInfo[0].regions.map(item => item.cities);
    for (item of arrayItems) {
        arrayCurrentCityOfBelarus.push(...(item.filter(cityBel => cityBel.name === cityInPlay)));
    }
    return arrayCurrentCityOfBelarus;
} 

// Rendering information according array cities of Belarus information
const getBelarusInfo = (arrayCurrentCityOfBelarus, text, img) => {
    let info = arrayCurrentCityOfBelarus.map(item => item.info);
    let photo = arrayCurrentCityOfBelarus.map(item => item.photo);
    if (info.join() == ""){
        text.innerHTML = `Нет информации :(`;
        if(popup.className.includes('js-active')){
            window.socketManager.sendMessage({
                type:"playTts",
                value:"Нет информации :(",
                ttsEndEventType: "cityReturn"
            })
            playText = true;
        }
    } else {
        text.innerHTML = `${info.join()}`;
        if(popup.className.includes('js-active')){
            window.socketManager.sendMessage({
                type:"playTts",
                value:`${info.join()}`,
                ttsEndEventType: "cityReturn"
            })
            playText = true;
        }
    }
    if (photo.join() == ""){
        img.setAttribute("src", `./img/first.jpg`);
    } else {
        img.setAttribute("src", `${photo.join()}`);
    }
}

// Rendering information according wiki information
const getWikiInfo = (result, text, img, currentCity) => {
    let temporaryElement = document.createElement("div");
    temporaryElement.innerHTML = result;
    text.prepend(temporaryElement);
    let wikiInfo = document.querySelector(".mw-parser-output");
    let wikiImg = document.querySelector(".infobox-image img");
    if (wikiInfo !== null ){
        let wikiInfoChildren = wikiInfo.children;
        text.innerHTML = "";
        temporaryElement.remove();
        for (item of wikiInfoChildren) {
            if (!item.hasAttribute("class") && !item.hasAttribute("data-mw-deduplicate")) {
                let editsectionForRemove = item.querySelectorAll(".mw-editsection");
                for (itemEditsectionForRemove of editsectionForRemove) {
                    itemEditsectionForRemove.remove();
                }
                let referenceForRemove = item.querySelectorAll(".reference");
                for (itemReferenceForRemove of referenceForRemove) {
                    itemReferenceForRemove.remove();
                }
                let headlineForRemove = item.querySelectorAll(".mw-headline");
                for (itemHeadlineForRemove of headlineForRemove) {
                    if(["См. также", "Ссылки", "Примечания"].includes(itemHeadlineForRemove.innerText)) {
                        itemHeadlineForRemove.remove();
                    }
                }
                let nowrapForRemove = item.querySelectorAll(".nowrap");
                for (itemNowrapForRemove of nowrapForRemove) {
                    itemNowrapForRemove.remove();
                }
                let ipaForRemove = item.querySelectorAll(".IPA");
                for (itemIpaForRemove of ipaForRemove) {
                    itemIpaForRemove.remove();
                }
                let noprintForRemove = item.querySelectorAll(".noprint");
                for (itemNoprintForRemove of noprintForRemove) {
                    itemNoprintForRemove.remove();
                }
                let aForChange = item.querySelectorAll("a");
                for (itemAForChange of aForChange) {
                    itemAForChange.style.cssText = "text-decoration: none; cursor: default; pointer-events: none;";
                }
                text.append(item);
            } 
        }
    } else {
        text.innerHTML = "Нет информации";
    }
    if (wikiImg !== null ){
        img.setAttribute("src", wikiImg.getAttribute("src"));
    } else {
        img.setAttribute("src", `./img/first.jpg`);
    }


    if(currentCity === 'player'){
        if(popup.className.includes('js-active')){
            window.socketManager.sendMessage({
                type:"playTts",
                value:`${document.getElementById('content__info-player-text').innerText}`,
                ttsEndEventType: "cityReturn"
            })
            playText = true;
        }
    } else if(currentCity === 'computer'){
        if(popup.className.includes('js-active')){
            window.socketManager.sendMessage({
                type:"playTts",
                value:`${document.getElementById('content__info-computer-text').innerText}`,
                ttsEndEventType: "cityReturn"
            })
            playText = true;
        }
    }
}

// Rendering information about current city according to the chosen source of information 
const renderInfoPhoto = (arrayCurrentCityOfBelarus, information, text, img) => {
    if (multiplayerItemCheckbox.checked) {
        getBelarusInfo(arrayCurrentCityOfBelarus, text, img);
    } else {
        getCityFromWiki(information, text, img);
    }
}

// Show information about city in consol
const showInfoInConsol = (contentInfoText) => {
        console.log(contentInfoText.innerText);
}

// Show computer answer
const getComputerTurn = () => {
    let lastComputerAnswer = arrayComputer.slice(0,1).join();
    showCityInTitle(lastComputerAnswer, contentTitleComputer);
    addCityInAttribute(lastComputerAnswer, contentItemComputer);
    renderInfoPhoto(getCurrentCity(lastComputerAnswer, citiesOfBelarusInfo), lastComputerAnswer, contentInfoComputerText, contentImgComputer);
    getPlayedCities();

    setTimeout(() => {
        let actualArray;
        if (multiplayerItemCheckbox.checked) {
            actualArray = getActualArray(getCitiesOfBelarus(citiesOfBelarusInfo));
        } else {
            actualArray = getActualArray(getCities(cities));
        }
             
    }, 1000);
}

// Shows hint
const showHint = (currentGameArray) => {
    information.classList.add("js-active__info-hint");
    multiplayerButtonPlayer.classList.add("js-active__info-hint");
    informationText.innerHTML = `Попробуй этот город: `;
    informationHint.innerHTML = `${currentGameArray}`;
    information.dataset.hintcity = currentGameArray;
    showInfo();
    // EventListener to add hints to input
    information.addEventListener("click", () => {
        if (information.dataset.information == "Hint") {
            getAudio("click");
            multiplayerInput.value = information.dataset.hintcity;
            pushHintInArrKeyboard();
            hideInfo();
        }
    });

    window.socketManager.sendMessage({
        type: "stopVoiceRecord"
    })
    window.socketManager.sendMessage({
        type:"playTts",
        value:`Попробуй этот: ${currentGameArray}`,
        ttsEndEventType: 'hint'
    })
    playText = true;
}

// EventListener for information button
information.addEventListener("click", () => {
    if (information.dataset.information == "Info") {
        getAudio("click");
        hideInfo();
    }
});

// EventListener for sound button
soundButton.addEventListener("click", () => {
    getAudio("click");
    checkSoundButtonStatus(soundButton.dataset.soundoff !== "soundOff");
    if (soundButton.dataset.soundoff === "soundOff") {
        localStorage.setItem('soundOff', JSON.stringify(true));
    } else {
        localStorage.setItem('soundOff', JSON.stringify(false));
    }
});

// EventListener for Hint button
multiplayerButtonHint.addEventListener("click", () => {
    getAudio("click");
    hintSupport();
    information.dataset.information = "Hint";
    multiplayerButtonPlayer.dataset.information = "Hint";
});

function hintSupport(){
    if (multiplayerItemCheckbox.checked) {
        showHint(getHint(getActualArray(getCitiesOfBelarus(citiesOfBelarusInfo))));
    } else {
        showHint(getHint(getActualArray(getCities(cities))));
    }
}

// Getts random city name from array on last letter opponent's city
const getRandCityNameOnLastLet = (actualArray, lastLetter) => {
    let randomNumber = Math.floor( Math.random() * 100 * getArrayCitiesFilter(actualArray, lastLetter).length / 100);
    let randomCityName = getArrayCitiesFilter(actualArray, lastLetter)[randomNumber];
    return randomCityName;
}

// Getts random city name from actual array
const getRandCityName = (actualArray) => {
    let randomNumber = Math.floor( Math.random() * 100 * actualArray.length / 100);
    let randomCityName = actualArray[randomNumber];
    return randomCityName;
}

// Return hint
const getHint = (actualArray) => {
    if (arrayPlayer.length === 0 && arrayComputer.length === 0) {
        if (multiplayerItemCheckbox.checked) {
           return getRandCityName(getCitiesOfBelarus(citiesOfBelarusInfo));
        } else {
            return getRandCityName(getCities(cities));
        }
    } else {
        if (getArrayCitiesFilter(actualArray, getHintsLastLetter()).length !== 0) {
            let wordForHint = getRandCityNameOnLastLet(actualArray, getHintsLastLetter());
            return wordForHint;
        } else {
            showGameOverPopup(`Больше нет городов на такую букву. Игра окончена`, arrayPlayer.length);
            return  informationText.innerHTML = `Больше нет городов на такую букву. Игра окончена.`;
        }
    }
}

// Set the lastComputerLetter
const setHintsLastLetter = (lastComputerLetter) => {
    lastCompLetter = lastComputerLetter;
}

// Get the lastComputerLetter
const getHintsLastLetter = () => {
    return lastCompLetter;
}

// Show the name of the city in title
const showCityInTitle = (city, title) => title.innerHTML = city;

// Adding the name of the city in data attribute
const addCityInAttribute = (city, item) => item.dataset.city = `${city}`;

// Show popup
const showPopup = () => {
    popup.classList.add("js-active");
    document.body.style.overflow = "hidden";
}

// Hide popup
const hidePopup = () => {
    popup.classList.remove("js-active");
    document.body.style.overflow = "";
    popupMainImage.classList.remove("js-none");
    popupButtonProceedgame.classList.remove("js-active-button");
    popupButtonNewgame.classList.remove("js-active-button");
    popupButton.classList.remove("js-none");
    popupMainText.innerHTML = `Подождите немного, загружается информация о городе.`;
    popupMainText.style.cssText = "text-align: center;";
    infoCity = false;
    noReset();
}

// Shows game over popup
const showGameOverPopup = (title, result) => {
    showPopup();
    popup.dataset.gameover = "GameOver";
    popupMainImage.classList.add("js-none");
    popupMainText.innerHTML = `Результат: ${result} ходов`;
    popupButton.classList.add("js-active__information");
    popupButtonProceedgame.classList.remove("js-active-button");
    popupButtonNewgame.classList.remove("js-active-button");
    popupButton.classList.remove("js-none");
    popupHeaderTitle.innerHTML = `${title}`;
    window.socketManager.sendMessage({
        type: 'playTts',
        value: `${title}`
    });
    popupButton.innerHTML = "Начать заново";
    popupButton.addEventListener("click", () => {
        getAudio("click");
        clearLocalStorage();
        location.reload();
    });
}

// EventListener for popup close
popup.addEventListener("click", event => {
    if (!event.target.closest("#popup__inner") || event.target.closest("#popup__button")) {
        if (popup.dataset.gameover === "GameOver") {
            popup.addEventListener("click", () => {
                getAudio("click");
                location.reload();
            });
            popup.dataset.gameover === "";
        } else {
            getAudio("click");
            hidePopup();
            infoCity = false;
        window.socketManager.sendMessage({
            type:"stopTtsPlayback"
        });
        }
    }
});

// Shows popup menu with parameter when click on cities list
const showPopupFromCitiesList = (id) => {
    if (id) {
        showPopup();
        renderInfoPhoto(getCurrentCity(id.innerHTML, citiesOfBelarusInfo), id.innerHTML, popupMainText, popupImg);
        showCityInTitle(id.innerHTML, popupHeaderTitle);
        popupMainText.style.cssText = "text-align: left;";
    }
}

// Renders popup menu with parameter when click on title and when click on photo
const renderPopupContentItem = (city, img, text) => {
    popupHeaderTitle.innerHTML = `${city}`;
    popupImg.setAttribute("src", img.getAttribute("src"));
    popupMainText.innerHTML = "";
    popupMainText.append(text.cloneNode(true));
    popupMainText.style.cssText = "text-align: left;";
}

// Shows popup menu with parameter when click on title and when click on photo
const showPopupContentItem = (idTitle, idImg, contentItem, contentImg, contentInfoText) => {
    showPopup();
    if (idTitle) {
        showInfoInConsol(contentInfoText);
        renderPopupContentItem(contentItem, contentImg, contentInfoText);
    }
    if (idImg) {
        renderPopupContentItem(contentItem, contentImg, contentInfoText);
    }
}

// EventListener for show information in console about player city
contentItemPlayer.addEventListener("click", event => {
    if (!event.target.closest("#content__info-player")) {
        getAudio("click");
        showPopupContentItem(event.target.closest("#content__title-player"), event.target.closest("#content__img-player"), contentItemPlayer.dataset.city, contentImgPlayer, contentInfoPlayerText);
    }
});

// EventListener for show information in console about computer city
contentItemComputer.addEventListener("click", event => {
    if (!event.target.closest("#content__info-computer")) {
        getAudio("click");
        showPopupContentItem(event.target.closest("#content__title-computer"), event.target.closest("#content__img-computer"), contentItemComputer.dataset.city, contentImgComputer, contentInfoComputerText);
    }
});

// EventListener for popup close area cursor pointer
popup.addEventListener("mouseover", event => !event.target.closest("#popup__inner") ? popup.classList.add("js-cursor-pointer") : popup.classList.remove("js-cursor-pointer"));

// EventListener for information about player's cities
multiplayerPlayersCities.addEventListener("click", event => {
    getAudio("click");
    showPopupFromCitiesList(event.target.closest("#player__city"))
});

// EventListener for information about computer's cities
multiplayerComputerCities.addEventListener("click", event => {
    getAudio("click");
    showPopupFromCitiesList(event.target.closest("#computer__city"))
});

// Checking input and actualArray
const checkMultiplayerInputValue = (multiplayerInputValue, actualArray) => {
    if (actualArray.join(", ").toUpperCase().split(", ").includes(multiplayerInputValue.toUpperCase())) {
        multiplayerInputValue = actualArray[actualArray.join(", ").toUpperCase().split(", ").indexOf(multiplayerInputValue.toUpperCase())];
        if (multiplayerInputValue !== "") { 
            arrayPlayer.unshift(multiplayerInputValue);
            multiplayerPlayersCities.innerHTML = arrayPlayer.map(city => 
                `<li class="player__city" id="player__city" title="Нажми, чтобы увидеть информацию">${city}</li>`
                ).join(", ");
            playerResult.innerHTML = arrayPlayer.length;
            content.classList.add("js-active");
            getComputerAnswer(multiplayerInputValue, actualArray);
            showCityInTitle(multiplayerInputValue, contentTitlePlayer);
            addCityInAttribute(multiplayerInputValue, contentItemPlayer);
            renderInfoPhoto(getCurrentCity(multiplayerInputValue, citiesOfBelarusInfo), multiplayerInputValue, contentInfoPlayerText, contentImgPlayer);
            hideInfo();
            setInLocalStorage();
            showPreloader();
            showTemporaryInfo();
        } else {
            informationText.innerHTML = "Введите город, чтобы начать игру!";
            showInfo();
        }
    } else {
        if (getPlayedCities().join(", ").toUpperCase().split(", ").includes(multiplayerInputValue.toUpperCase())) {
            informationText.innerHTML = "Такой город уже был";
            showInfo();
        } else {
            informationText.innerHTML = "Такого города нет";
            showInfo();
            if(!infoCity){
                window.socketManager.sendMessage({
                    type: 'playTts',
                    value: 'Такого города нет'
                })
                playText = true;
            }
        }
    }
}

// Make checking for exceptions
const makeCheckExceptions = (letter, word) => {
    return letter === "ь" || letter === "ъ" || letter === "й" || letter === "ы" || word === "Островец" || word === "Ивенец" || word ===  "Наровля" || word === "Каменец" || word === "Лунинец";
}

// Get player's word from input 
const getCityName = (actualArray) => {
    let multiplayerInputValue = document.querySelector("#multiplayer__input").value;
    if (multiplayerInputValue === "") {
        informationText.innerHTML = `Введите название города!`;
        showInfo();
    } else if (arrayComputer.length !== 0) {
        let lastComputerAnswer = arrayComputer.slice(0,1).join();
        let lastComputerAnswerWord = lastComputerAnswer[lastComputerAnswer.length - 1];
        if (makeCheckExceptions(lastComputerAnswerWord, lastComputerAnswer)) {
            lastComputerAnswerWord = lastComputerAnswer[lastComputerAnswer.length - 2].toUpperCase(); 
            checkMultiplayerInputValue(multiplayerInputValue, actualArray); 
        } else if (multiplayerInputValue[0].toLowerCase() === lastComputerAnswerWord) {
            checkMultiplayerInputValue(multiplayerInputValue, actualArray);
        } else  {
            if(!infoCity){
                informationText.innerHTML = `Твой город должен начинаться с: "${lastComputerAnswerWord.toUpperCase()}"`;
                pushLastLetterInArrKeyboard(lastComputerAnswerWord);
                window.socketManager.sendMessage({
                    type: 'playTts',
                    value: `Твой город должен начинаться с: ${lastComputerAnswerWord.toUpperCase()}`
                })
                playText = true;
                showInfo();
                document.querySelector("#multiplayer__input").value = lastComputerAnswerWord.toUpperCase();
            }
        }
    } else {
        checkMultiplayerInputValue(multiplayerInputValue, actualArray); 
    } 
};

// Finds all cities beginning with the last letter of the opponent's city
const getArrayCitiesFilter = (actualArray, lastLetter) => {
    let arrayCitiesFilter = actualArray.filter(paramFilter => {
        if (paramFilter[0] === lastLetter) {
            return true;
        }
    });
    return arrayCitiesFilter;
}


// Get computer answer
const getComputerAnswer = (multiplayerInputValue, actualArray) => {
    let lastLetter = multiplayerInputValue[multiplayerInputValue.length - 1];
    if (makeCheckExceptions(lastLetter, multiplayerInputValue)) {
        lastLetter = multiplayerInputValue[multiplayerInputValue.length - 2].toUpperCase();
        informationText.innerHTML = `Твой город: "${multiplayerInputValue}", и он заканчивается на: "${multiplayerInputValue[multiplayerInputValue.length - 1]}", это исключение, поэтому мой город будет начинаться с: "${multiplayerInputValue[multiplayerInputValue.length - 2].toUpperCase()}"`;
        showInfo();
    } else {
        lastLetter = multiplayerInputValue[multiplayerInputValue.length - 1].toUpperCase();
    } 
    
    if (getArrayCitiesFilter(actualArray, lastLetter).length !== 0) {
        let computerWord = getRandCityNameOnLastLet(actualArray, lastLetter);
        let lastComputerLetter = computerWord[computerWord.length - 1];
        multiplayerInput.value = lastComputerLetter.toUpperCase();
        setHintsLastLetter(lastComputerLetter.toUpperCase());
        pushLastLetterInArrKeyboard(lastComputerLetter);
        arrayComputer.unshift(computerWord);
        multiplayerComputerCities.innerHTML = arrayComputer.map(city => 
            `<li class="computer__city" id="computer__city" title="Нажми, чтобы увидеть информацию">${city}</li>`
            ).join(", ");

        if(!makeCheckExceptions(lastComputerLetter, computerWord)){
            window.socketManager.sendMessage({
                type: 'playTts',
                value: `Твой город: ${arrayPlayer[0]}, а Тэсла сказала ${computerWord}, теперь твой город должен начинаться с ${lastComputerLetter}"`
            })
            playText = true;
        }
        
        if (makeCheckExceptions(lastComputerLetter, computerWord)) {
            lastComputerLetter = computerWord[computerWord.length - 2].toUpperCase();
            setHintsLastLetter(lastComputerLetter);
            pushLastLetterInArrKeyboard(lastComputerLetter);
            informationText.innerHTML = `Город компьютера: "${computerWord}", и он заканчивается на: "${computerWord[computerWord.length - 1]}", это исключение, поэтому название твоего города начинается с: "${computerWord[computerWord.length - 2].toUpperCase()}"`;
            window.socketManager.sendMessage({
                type: 'playTts',
                value: `Твой город: ${arrayPlayer[0]}, а Тэсла сказала ${computerWord}, и он заканчивается на: "${computerWord[computerWord.length - 1]}", это исключение, поэтому название твоего города начинается с: "${computerWord[computerWord.length - 2].toUpperCase()}"`
            })
            playText = true;
            showInfo();
            document.querySelector("#multiplayer__input").value = lastComputerLetter.toUpperCase();
        }
    } else {
        showGameOverPopup(`Больше нет городов на букву: ${lastLetter}. Игра окончена`, arrayPlayer.length);
        informationText.innerHTML = `Больше нет городов на букву: ${lastLetter}. Игра окончена`;
        showInfo();
    }
};
