/*API header required to access information*/
const HEAD = {
    method: 'GET',
    headers: {
    'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
    'X-RapidAPI-Key': 'bc15ad6fe7msh92d4636d10a6e33p1eb30ajsnb776b028d741'
    }
}
/*handles click of 'Find a random recipe' button*/
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
/*handls click of 'Search Ingredients' button*/
function handleIngredientSearch() {
	$('.ingsearch').click(event => {
        event.preventDefault();
        let ingredient = $('.js-user-search').text();
       checkUserInputForNothing(ingredient);
	});
}
/*handles click of 'Add' button*/
function handleAdd() {
    $('.add').click(event => {
        event.preventDefault();
        let userItem = $('#ingredient-search').val();
       checkForBlankAdd(userItem);
    });
}
/*handles the click of 'Back to Top' button*/
function handleBackToTop() {
    $('.to-top').click(event => {
        event.preventDefault();
        scrollToTop();
    });
}
/*removes a user search item when the 'X' is clicked*/
function removeSearchItem() {
    $('.add-section').on('click', '.js-ing', event => {
        event.preventDefault();
        event.target.closest('p').remove();
        removeIngredientLabel();
    });
}
/*splits the user input to separate the input values to be passed as parameters 
    in the checkUserInputForNothing funtion*/
function splitSearch(input) {
    let ingredientArray = input.split('X');
    ingredientArray.pop();
    return ingredientArray;
}
/*uses Spoonacular API to generate a random recipe*/
function getRandomRecipe() {
    let url = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random?number=1';
    fetch(url, HEAD)
    .then(response => response.json())
    .then(responseJson => getRandomRecipeInformationById(responseJson))
}
/*uses Spoonacular API to retrieve a recipes details based on its ID, when the recipe is found randomly*/
function getRandomRecipeInformationById(responseJson) {
    let recipeId = responseJson.recipes[0].id;
    let url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipeId}/information?includeNutrition=true`;
    fetch(url, HEAD)
    .then(response => response.json())
    .then(responseJson => displayRecipeInformation(responseJson))
    .catch(err => {$('.err').text(`Something is wrong: ${err.message}.`)});
}
/*Fetches a recipe based on the ingredients the user searched for after passing
    those ingredients into the getUrlFromIngredients function*/
function getIngredients(input) {
	let newUrl = getUrlFromIngredients(input);
	fetch(newUrl, HEAD)
	.then(response => response.json())
    .then(responseJson => getRecipeFromIngredientsById(responseJson))
    .catch(err => {$('.err').text(`Something went wrong: ${err.message}. Try adding some ingredients before you search!`)});
}
/*Constructs a proper API url to be able to fetch a recipe based on the users listed ingredients*/
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
/*uses Spoonacular API to retrieve a recipes details based on its ID, when the recipe is found by the ingredients it contains*/
function getRecipeFromIngredientsById(responseJson) {
    let recipeId = responseJson[0].id;
    let url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipeId}/information?includeNutrition=true`;
    fetch(url, HEAD)
    .then(response => response.json())
    .then(responseJson => displayRecipeInformation(responseJson))
    .catch(err => {$('.err').text(`Something is wrong: ${err.message}`)});
}
/*Displays the pertinent recipe information to the user in the 'results' section*/
function displayRecipeInformation(responseJson) {
    $('.name').text(`${responseJson.title}`);
    $('.servings').text(`Servings: ${responseJson.servings}`);
    $('.cal').text(`Calories per serving: ${responseJson.nutrition.nutrients[0].amount}`);
    $('.prep').text(`Time: ${responseJson.readyInMinutes} minutes`);
    $('.ingredients-title').text(`Ingredients:`);
    addIngredients(responseJson);
    $('.instructions').append(`${responseJson.instructions}`);
    $('.recipe-pic').append(`<img class="remove recipe-image" src="${responseJson.image}" alt="${responseJson.title}">`);
}
/*Empties the results page to make room for another search*/
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
/*When the field of user's ingredients to be searched gets deleted (completely empty)
    it removes the label 'Ingredients:' in the DOM*/
function removeIngredientLabel() {
    if ($('.js-user-search').text() === undefined || $('.js-user-search').text() === '') {
        $('.add-ingredient').empty();
    }
}
/*Adds the listed ingredients from the returned recipe to the DOM*/
function addIngredients(responseJson) {
    for (let i = 0; i < responseJson.extendedIngredients.length; i++) {
        $('.ingredients').append(`<li class="remove" role="listitem">${responseJson.extendedIngredients[i].originalString}</li>`);
    }
}
/*Checks to make sure the user is adding a valid input to be searched for*/
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
/*Checks to make sure the user actually entered search items.
    If they didn't it sends an alert to the user. If there are 
    search items, it passes the items as an array to the getIngredients function,
    displays the results, resets the array, and clears the input field*/
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
/*Scrolls user to the results of their search*/
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
/*Scrolls user back to top of the page*/
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
/*Checks to see which browser the user is running
    and sets scroll animation accordingly*/
function checkBrowser() {
    let navUser = navigator.userAgent;
    let safariCheck;
    if (navUser.indexOf("iPhone") > -1) {
        safariCheck = true;
    }
    else {
        safariCheck = false;
    }
    return safariCheck;
}
/*This function is the main callback for all other functions*/
function handleAll() {
    $(removeSearchItem);
    $(handleAdd);
    $(handleIngredientSearch);
    $(handleRandomSearch);
    $(handleBackToTop);
}
$(handleAll);