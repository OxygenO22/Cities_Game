let multiplayerItemTitle = document.querySelector("#multiplayer__item-title");
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
let keyboardRowName = document.querySelector("#keyboard__row-name");
let keyboardInner = document.querySelector("#keyboard__inner");
let content = document.querySelector("#content");
let contentItem = document.querySelector("#content__item");
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

window.addEventListener('load', ()=> hidePreloader(loadWindow));

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
        showChooseGamePopup();
    } 
}

// Writes parameters in local storage
const setInLocalStorage = () => {
    localStorage.setItem('Player_result', JSON.stringify(arrayPlayer));
    localStorage.setItem('Computer_result', JSON.stringify(arrayComputer));
    localStorage.setItem('lastCompLetter', JSON.stringify(getHintsLastLetter()));
    if (multiplayerItemCheckbox.checked) {
        localStorage.setItem('checked', JSON.stringify(true));
    } else {
        localStorage.setItem('checked', JSON.stringify(false));
    }
    if (keyboardInner.classList.contains("js-active-keyboard")) {
        localStorage.setItem('keyboard', JSON.stringify(true));
    } else {
        localStorage.setItem('keyboard', JSON.stringify(false));
    }
}

// Clears LocalStorage
const clearLocalStorage = () => {
    localStorage.clear();
    arrayPlayer.length = 0;
    arrayComputer.length = 0;
}

// Shows popup for choosing new game or proceeding game
const showChooseGamePopup = () => {
    showPopup();
    popupHeaderTitle.innerHTML = `Есть незаконченная игра.`;
    popupMainImage.classList.add("js-none");
    popupButtonProceedgame.classList.add("js-active-button");
    popupButtonNewgame.classList.add("js-active-button");
    popupButton.classList.add("js-none");
    popupMainText.innerHTML = `Желаете продолжить игру или начать новую?`;
    popupButtonProceedgame.addEventListener("click", () => {
        multiplayerPlayersCities.innerHTML = arrayPlayer.map(city => 
            `<li class="player__city" id="player__city" title="Нажми, чтобы увидеть информацию">${city}</li>`
            ).join(", ");
        multiplayerComputerCities.innerHTML = arrayComputer.map(city => 
            `<li class="computer__city" id="computer__city" title="Нажми, чтобы увидеть информацию">${city}</li>`
            ).join(", ");
        multiplayerInput.value = `${JSON.parse(localStorage.getItem('lastCompLetter'))}`;
        playerResult.innerHTML = arrayPlayer.length;
        content.classList.add("js-active");
        renderInfoPhoto(getCurrentCity(arrayPlayer[0], citiesOfBelarusInfo), contentInfoPlayerText, contentImgPlayer, arrayPlayer[0]);
        showCityInTitle(arrayPlayer[0], contentTitlePlayer);
        addCityInAttribute(arrayPlayer[0], contentImgPlayer);
        renderInfoPhoto(getCurrentCity(arrayComputer[0], citiesOfBelarusInfo), contentInfoComputerText, contentImgComputer, arrayComputer[0]);
        showCityInTitle(arrayComputer[0], contentTitleComputer);
        addCityInAttribute(arrayComputer[0], contentImgComputer);
        setHintsLastLetter(JSON.parse(localStorage.getItem('lastCompLetter')));
        if (JSON.parse(localStorage.getItem('checked')) === true) {
            multiplayerItemCheckbox.checked = true;
        } else {
            multiplayerItemCheckbox.checked = false;
        }
        if (JSON.parse(localStorage.getItem('keyboard')) === true) {
            keyboardInner.classList.add("js-active-keyboard");
        }
        hidePopup();
    });
    popupButtonNewgame.addEventListener("click", () => {
        clearLocalStorage();
        hidePopup();
        
    });
}

// Player button to make a move
const makeMove = () => {
    arrayKeyboard.length = 0;
    if (multiplayerButtonPlayer.dataset.information != "Info") {
        checkCitiesArray();
    } else {
        checkCitiesArray();
        information.classList.remove("js-active__information");
        informationText.innerHTML = "Отличной игры!";
        informationHint.innerHTML = "";
        multiplayerButtonPlayer.innerHTML = "Город игрока";
        multiplayerButtonPlayer.classList.remove("js-active__information");
        multiplayerButtonPlayer.dataset.information = "";
        showPreloader();
        setInLocalStorage();
    }
    //getCitiesFromWEB();
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

 // EventListener for show/hide the virtual keyboard
 keyboardRowName.addEventListener("click", () => {
    keyboardInner.classList.toggle("js-active-keyboard");
    multiplayerInput.setAttribute("datepicker", true);    
});

// EventListener for virtual keyboard input
keyboardInner.addEventListener("click", event => {
    if (event.target.closest("#keyboard__key") && !event.target.closest("#keyboard__key").hasAttribute("data-action")) {
        arrayKeyboard.push(event.target.closest("#keyboard__key").innerHTML.trim());
        multiplayerInput.value = arrayKeyboard.join("")[0].toUpperCase() + arrayKeyboard.join("").slice(1);
    } else if (event.target.closest("#keyboard__key") && event.target.closest("#keyboard__key").hasAttribute("data-action")) {
        if (multiplayerInput.value !== "" && event.target.closest("#keyboard__key").dataset.action === "Backspace") {
            if (arrayKeyboard.length > 1) {
                arrayKeyboard.pop();
                multiplayerInput.value = arrayKeyboard.join("")[0].toUpperCase() + arrayKeyboard.join("").slice(1);
            } else {
                arrayKeyboard.pop();
                multiplayerInput.value = "";
            }
        }
        if (event.target.closest("#keyboard__key").dataset.action === "Enter") {
            makeMove();
        }
    }  
});

// EventListener for removing elements from array after virtual keyboard input
multiplayerInput.addEventListener("keyup", event => {
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
    popupButtonProceedgame.innerHTML = `Да`;
    popupButtonNewgame.classList.add("js-active-button");
    popupButtonNewgame.innerHTML = `Нет`;
    popupButton.classList.add("js-none");
    popupMainText.innerHTML = `Вы уверены, что хотите начать заново?`;
    popupButtonProceedgame.addEventListener("click", () => {
        location.reload();
        clearLocalStorage();
        hidePopup();
    });
    popupButtonNewgame.addEventListener("click", () => {
        hidePopup();
        
    });
}


// EventListener for the button to reload the game 
multiplayerItemTitle.addEventListener("click", () => {
    showSurePopup();
});

// EventListener for the game reload button to change its name
multiplayerItemTitle.addEventListener("mouseover", () => multiplayerItemTitle.innerHTML = "Начать заново");

// EventListener for the reload button of the game to change its name to the original one
multiplayerItemTitle.addEventListener("mouseout", () => multiplayerItemTitle.innerHTML = "Игра в города");

// EventListener for the player button to make a move
multiplayerButtonPlayer.addEventListener("click", () => {
    makeMove();
});

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
    multiplayerButtonPlayer.innerHTML = "Хорошо";
    multiplayerButtonPlayer.classList.add("js-active__information");
    multiplayerButtonPlayer.dataset.information = "Info";
}

// Returning actualArray after deleting cities which was named from arrayCities
const getActualArray = (arrayCities) => {
    let afterGameArray = [];
    let newArr = afterGameArray.concat(arrayPlayer, arrayComputer);
    let actualArray = arrayCities.filter(city => !newArr.includes(city));
    return actualArray;
}

// Returning cities names from world cities database 
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

// Returning cities names from Belarussian cities database
const getCitiesOfBelarus = (citiesOfBelarusInfo) => {
    let arrayCitiesOfBelarus = [];
    let arrayItems = citiesOfBelarusInfo[0].regions.map(item => item.cities);
    for (item of arrayItems) {
        arrayCitiesOfBelarus.push(...(item.map(cityBel => cityBel.name)));
    }
    return arrayCitiesOfBelarus;
}

// Returning array of current city 
const getCurrentCity = (cityInPlay, citiesOfBelarusInfo) => {
    let arrayCurrentCityOfBelarus = [];
    let arrayItems = citiesOfBelarusInfo[0].regions.map(item => item.cities);
    for (item of arrayItems) {
        arrayCurrentCityOfBelarus.push(...(item.filter(cityBel => cityBel.name === cityInPlay)));
    }
    return arrayCurrentCityOfBelarus;
} 

// Rendering information about current city
const renderInfoPhoto = (arrayCurrentCityOfBelarus, text, img, city) => {
    let info = arrayCurrentCityOfBelarus.map(item => item.info);
    let photo = arrayCurrentCityOfBelarus.map(item => item.photo);
    if (info.join() == ""){
        text.innerHTML = `Нет информации :(`;


        text.innerHTML = `<a href="https://ru.wikipedia.org/wiki/${city}" target="_blank" title="Нажми, чтобы узнать о данном городе">${city} - ссылка на информацию о городе</a>`;


    } else {
        text.innerHTML = `${info.join()}`;
    }
    if (photo.join() == ""){
        img.setAttribute("src", `./img/first.jpg`);
    } else {
        img.setAttribute("src", `${photo.join()}`);
    }
}

// Show information about city in consol
const showInfoInConsol = (arrayCurrentCityOfBelarus) => {
    let info = arrayCurrentCityOfBelarus.map(item => item.info);
    if (info.join() == ""){
        console.log(`Нет информации :(`);
    } else {
        console.log(`${info.join()}`);
    }
}

// Show computer answer
const getComputerTurn = () => {
    let lastComputerAnswer = arrayComputer.slice(0,1).join();
    showCityInTitle(lastComputerAnswer, contentTitleComputer);
    addCityInAttribute(lastComputerAnswer, contentImgComputer);
    renderInfoPhoto(getCurrentCity(lastComputerAnswer, citiesOfBelarusInfo), contentInfoComputerText, contentImgComputer, lastComputerAnswer);
}

// Shows hint
const showHint = (currentGameArray) => {
    information.classList.add("js-active__information");
    informationText.innerHTML = `Попробуй этот: `;
    informationHint.innerHTML = `${currentGameArray}`;
    showInfo();
    // EventListener to add hints to input
    informationHint.addEventListener("click", event => multiplayerInput.value = event.target.closest("#information__hint").innerHTML);
}

// EventListener for Hint button
multiplayerButtonHint.addEventListener("click", () => {
    if (multiplayerItemCheckbox.checked) {
        showHint(getHint(getActualArray(getCitiesOfBelarus(citiesOfBelarusInfo))));
    } else {
        showHint(getHint(getActualArray(getCities(cities))));
    }
});

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
            showGameOverPopup(`Больше нет городов на такую букву... Ты проиграл!`, arrayPlayer.length);
            return  informationText.innerHTML = `Больше нет городов на такую букву... Ты проиграл!`;
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
}

// Shows popup menu with parameter
const showPopupOnClick = (id) => {
    if (id) {
        showPopup();
        renderInfoPhoto(getCurrentCity(id.innerHTML, citiesOfBelarusInfo), popupMainText, popupImg, id.innerHTML);
        showCityInTitle(id.innerHTML, popupHeaderTitle);
    }
}

// Shows popup menu with parameter on photo
const showPopupOnPhoto = (city) => {
    showPopup();
    renderInfoPhoto(getCurrentCity(city, citiesOfBelarusInfo), popupMainText, popupImg, city);
    showCityInTitle(city, popupHeaderTitle);
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
    popupButton.innerHTML = "Начать заново";
    popupButton.addEventListener("click", () => {
        clearLocalStorage();
        location.reload();
    });
}

// EventListener for popup close
popup.addEventListener("click", event => {
    if (!event.target.closest("#popup__inner") || event.target.closest("#popup__button")) {
        if (popup.dataset.gameover === "GameOver") {
            popup.addEventListener("click", () => location.reload());
            popup.dataset.gameover === "";
        } else {
            hidePopup();
        }
    }
});

// EventListener for popup close area cursor pointer
popup.addEventListener("mouseover", event => !event.target.closest("#popup__inner") ? popup.classList.add("js-cursor-pointer") : popup.classList.remove("js-cursor-pointer"));

// EventListener for information about player's cities
multiplayerPlayersCities.addEventListener("click", event => showPopupOnClick(event.target.closest("#player__city")));

// EventListener for information about computer's cities
multiplayerComputerCities.addEventListener("click", event => showPopupOnClick(event.target.closest("#computer__city")));

// EventListener for show information in console about player city from title
contentTitlePlayer.addEventListener("click", event => {
    showInfoInConsol(getCurrentCity(event.target.closest("#content__title-player").innerHTML, citiesOfBelarusInfo));
    showPopupOnClick(event.target.closest("#content__title-player"));
});

// EventListener for show information in console about computer city from title
contentTitleComputer.addEventListener("click", event => {
    showInfoInConsol(getCurrentCity(event.target.closest("#content__title-computer").innerHTML, citiesOfBelarusInfo));
    showPopupOnClick(event.target.closest("#content__title-computer"));
});

// EventListener for show information in console about computer city from title
contentImgPlayer.addEventListener("click", () =>  showPopupOnPhoto(contentImgPlayer.dataset.city));

// EventListener for show information in console about computer city from title
contentImgComputer.addEventListener("click", () => showPopupOnPhoto(contentImgComputer.dataset.city));

// Checking input and actualArray
const checkmultiplayerInputValue = (multiplayerInputValue, actualArray) => {
    if (actualArray.includes(multiplayerInputValue)) {
        if (multiplayerInputValue !== "") { 
            arrayPlayer.unshift(multiplayerInputValue);
            multiplayerPlayersCities.innerHTML = arrayPlayer.map(city => 
                `<li class="player__city" id="player__city" title="Нажми, чтобы увидеть информацию">${city}</li>`
                ).join(", ");
            playerResult.innerHTML = arrayPlayer.length;
            content.classList.add("js-active");
            getComputerAnswer(multiplayerInputValue, actualArray);
            showCityInTitle(multiplayerInputValue, contentTitlePlayer);
            addCityInAttribute(multiplayerInputValue, contentImgPlayer);
            renderInfoPhoto(getCurrentCity(multiplayerInputValue, citiesOfBelarusInfo), contentInfoPlayerText, contentImgPlayer, multiplayerInputValue);
        } else {
            information.classList.add("js-active__information");
            informationText.innerHTML = "Введите город, чтобы начать игру!";
            showInfo();
        }
    } else {
        information.classList.add("js-active__information");
        informationText.innerHTML = "Такого города нет :(";
        showInfo();
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
        information.classList.add("js-active__information");
        showInfo();
    } else if (arrayComputer.length !== 0) {
        let lastComputerAnswer = arrayComputer.slice(0,1).join();
        let lastComputerAnswerWord = lastComputerAnswer[lastComputerAnswer.length - 1];
        if (makeCheckExceptions(lastComputerAnswerWord, lastComputerAnswer)) {
            lastComputerAnswerWord = lastComputerAnswer[lastComputerAnswer.length - 2].toUpperCase(); 
            checkmultiplayerInputValue(multiplayerInputValue, actualArray); 
        } else if (multiplayerInputValue[0].toLowerCase() === lastComputerAnswerWord) {
            checkmultiplayerInputValue(multiplayerInputValue, actualArray);
        } else  {
            information.classList.add("js-active__information");
            showInfo();
            informationText.innerHTML = `Твой город должен начинаться с: "${lastComputerAnswerWord.toUpperCase()}"`;
            document.querySelector("#multiplayer__input").value = lastComputerAnswerWord.toUpperCase();
        }
    } else {
        checkmultiplayerInputValue(multiplayerInputValue, actualArray); 
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
        information.classList.add("js-active__information");
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
        arrayComputer.unshift(computerWord);
        multiplayerComputerCities.innerHTML = arrayComputer.map(city => 
            `<li class="computer__city" id="computer__city" title="Нажми, чтобы увидеть информацию">${city}</li>`
            ).join(", ");
        
        if (makeCheckExceptions(lastComputerLetter, computerWord)) {
            lastComputerLetter = computerWord[computerWord.length - 2].toUpperCase();
            setHintsLastLetter(lastComputerLetter);
            information.classList.add("js-active__information");
            informationText.innerHTML = `Город компьютера: "${computerWord}", и он заканчивается на: "${computerWord[computerWord.length - 1]}", это исключение, поэтому название твоего города начинается с: "${computerWord[computerWord.length - 2].toUpperCase()}"`;
            showInfo();
            document.querySelector("#multiplayer__input").value = lastComputerLetter.toUpperCase();
        }
    } else {
        information.classList.add("js-active__information");
        showGameOverPopup(`Больше нет городов на букву: ${lastLetter}, поэтому я проиграл`, arrayPlayer.length);
        informationText.innerHTML = `Больше нет городов на букву: ${lastLetter}, поэтому я проиграл`;
        showInfo();
    }
};