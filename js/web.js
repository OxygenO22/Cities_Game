 const CITIES_URL = "https://raw.githubusercontent.com/aZolo77/citiesBase/master/cities.json";
 const WIKI = "https://ru.wikipedia.org/wiki/{{City}}";

 // Fetch the cities list
 const getCitiesFromWEB = () => {
    fetch(`${CITIES_URL}`)
    .then(response => response.json())
    .then(cities => getCityName(getActualArray(getCities(cities.city))))
    .catch((error) => {
        console.log("Error: ", error);
     });
 }

 // Fetch the city with his name
 const getCityFromWiki = (currentCity) => {
     console.log(`${WIKI.replace("{{City}}", currentCity)}`);
    fetch(`${WIKI.replace("{{City}}", currentCity)}`)
    .then(response => response.json())
    .then(city => console.log(city))
    .catch((error) => {
        console.log("Error: ", error);
     });
 }

 


 