
const HEAD = {
    method: 'GET',
    headers: {
    'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
    'X-RapidAPI-Key': 'bc15ad6fe7msh92d4636d10a6e33p1eb30ajsnb776b028d741'
    }
}
function handleRandomSearch() {
    $('.find-recipes').click(event => {
        event.preventDefault();
        emptyResults();
        getRandomRecipe();
        $('.results').show();
        scrollToResults();
        $('.protein').val("");
    });
}
function handleIngredientSearch() {
	$('.ingsearch').click(event => {
        event.preventDefault();
        let ingredient = $('.js-user-search').text();
       checkUserInputForNothing(ingredient);
	});
}
function handleAdd() {
    $('.add').click(event => {
        event.preventDefault();
        let userItem = $('#ingredient-search').val();
       checkForBlankAdd(userItem);
    });
}
function handleBackToTop() {
    $('.to-top').click(event => {
        event.preventDefault();
        scrollToTop();
    });
}
function removeSearchItem() {
    $('.add-section').on('click', '.js-ing', event => {
        event.preventDefault();
        event.target.closest('p').remove();
        removeIngredientLabel();
    });
}
function splitSearch(input) {
    let ingredientArray = input.split('X');
    ingredientArray.pop();
    return ingredientArray;
}
function getRandomRecipe() {
    let url = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random?number=1';
    fetch(url, HEAD)
    .then(response => response.json())
    .then(responseJson => getRandomRecipeInformationById(responseJson))
}
function getRandomRecipeInformationById(responseJson) {
    let recipeId = responseJson.recipes[0].id;
    let url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipeId}/information?includeNutrition=true`;
    fetch(url, HEAD)
    .then(response => response.json())
    .then(responseJson => displayRecipeInformation(responseJson))
    .catch(err => {$('.err').text(`Something is wrong: ${err.message}.`)});
}
function getIngredients(input) {
	let newUrl = getUrlFromIngredients(input);
	fetch(newUrl, HEAD)
	.then(response => response.json())
    .then(responseJson => getRecipeFromIngredientsById(responseJson))
    .catch(err => {$('.err').text(`Something went wrong: ${err.message}. Try adding some ingredients before you search!`)});
}
function getUrlFromIngredients(input) {
    let url = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients?number=1&ranking=1&ignorePantry=false&ingredients=';
	let newUrl = url;
	for (let i = 0; i < input.length; i++) {
		if (i === input.length - 1) {
		newUrl = newUrl + input[i];
		}
		else {
		newUrl = newUrl + input[i] + '%2C';
		}
    }
    return newUrl;
}
function getRecipeFromIngredientsById(responseJson) {
    let recipeId = responseJson[0].id;
    let url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipeId}/information?includeNutrition=true`;
    fetch(url, HEAD)
    .then(response => response.json())
    .then(responseJson => displayRecipeInformation(responseJson))
    .catch(err => {$('.err').text(`Something is wrong: ${err.message}`)});
}
function displayRecipeInformation(responseJson) {
    $('.name').text(`${responseJson.title}`);
    $('.servings').text(`Servings: ${responseJson.servings}`);
    $('.cal').text(`Calories per serving: ${responseJson.nutrition.nutrients[0].amount}`);
    $('.prep').text(`Time: ${responseJson.readyInMinutes} minutes`);
    $('.ingredients-title').text(`Ingredients:`);
    addIngredients(responseJson);
    $('.instructions').append(`${responseJson.instructions}`);
    $('.recipe-pic').append(`<img class="remove recipe-image" src="${responseJson.image}" height="300" width="500">`);
}
function emptyResults() {
    $('.name').empty();
    $('.servings').empty();
    $('.cal').empty();
    $('.ingredients-title').empty();
    $('.prep').empty();
    $('.err').empty();
    $('.instructions').empty();
    $('.remove').remove();
}
function removeIngredientLabel() {
    if ($('.js-user-search').text() === undefined || $('.js-user-search').text() === '') {
        $('.add-ingredient').empty();
    }
}
function addIngredients(responseJson) {
    for (let i = 0; i < responseJson.extendedIngredients.length; i++) {
        $('.ingredients').append(`<li class="remove">${responseJson.extendedIngredients[i].originalString}</li>`);
    }
}
function checkForBlankAdd(input) {
    if (input === '') {
        alert('You must choose an ingredient before adding it to your list.');
    }
    else {
        $('.add-section').append(`<p class="js-user-search">${input}<button class="js-ing">X</button></p>`);
        $('.add-ingredient').text('Ingredients:');
        $('#ingredient-search').val("");
    }
}
function checkUserInputForNothing(input) {
    let USERINPUT = splitSearch(input);
    if (USERINPUT === undefined || USERINPUT.length === 0) {
       alert('Error: You must add ingredients before you search for a recipe.');
    }
    else {
        emptyResults();
        getIngredients(USERINPUT);
        $('.results').show();
        scrollToResults();
        USERINPUT = [];
        $('.ingredients').val("");
    }
}
function scrollToResults() {
    var result = document.getElementById("results"); 
    let safariCheck = checkBrowser();
    if (safariCheck === true){
        result.scrollIntoView(false);
    }
    else {
        result.scrollIntoView({behavior: "smooth", block: "end"});
    }
}
function scrollToTop() {
    var main = document.getElementById("main");
    let safariCheck = checkBrowser();
    if (safariCheck === true){
        main.scrollIntoView(true);
    }
    else {
        main.scrollIntoView({behavior: "smooth", block: "start"});
    }
}
function checkBrowser() {
    let navUser = navigator.userAgent;
    let safariCheck;
    console.log(navUser);
    if (navUser.indexOf("iPhone") > -1) {
        safariCheck = true;
    }
    else {
        safariCheck = false;
    }

    return safariCheck;
}
function handleAll() {
    $(removeSearchItem);
    $(handleAdd);
    $(handleIngredientSearch);
    $(handleRandomSearch);
    $(handleBackToTop);
}
$(handleAll);