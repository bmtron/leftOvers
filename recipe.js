
const HEAD = {
    method: 'GET',
    headers: {
    'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
    'X-RapidAPI-Key': 'bc15ad6fe7msh92d4636d10a6e33p1eb30ajsnb776b028d741'
    }
}
let USERINPUT = [];
let ingredientCheck = [];
function handleSearch() {
    $('.find-recipes').click(event => {
        event.preventDefault();
        emptyResults();
        getRandomRecipe();
        $('.protein').val("");
    });
}
function handleIngredientSearch() {
	$('.ingsearch').click(event => {
        event.preventDefault();
        let test = $('.js-user-search').text();
        USERINPUT = splitSearch(test);
        emptyResults();
        console.log(USERINPUT);
        getIngredients(USERINPUT);
        USERINPUT = [];
		$('.ingredients').val("");
	});
}
function handleAdd() {
    $('.add').click(event => {
        event.preventDefault();
        let userItem = $('#ingredient-search').val();
       checkForBlankAdd(userItem);
    });
}
function removeSearchItem() {
    $('.add-section').on('click', '.js-ing', event => {
        event.preventDefault();
        event.target.closest('p').remove();
    });
}
function splitSearch(input) {
    let test = input.split('X');
    test.pop();
    return test;
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
	fetch(newUrl, HEAD)
	.then(response => response.json())
    .then(responseJson => getRecipeFromIngredientsById(responseJson))
    .catch(err => {$('.err').text(`Something went wrong: ${err.message}. Try adding some ingredients before you search!`)});
}
function getRecipeFromIngredientsById(responseJson) {
    console.log(responseJson);
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
    $('.results').append(`<img class="remove" src="${responseJson.image}" height="100" width="100">`);
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
        $('.add-section').append(`<p class="remove js-user-search">${input}<button class="remove js-ing">X</button></p>`);
        $('#ingredient-search').val("");
    }
}
function handleAll() {
    $(removeSearchItem);
    $(handleAdd);
    $(handleIngredientSearch);
    $(handleSearch);
}
$(handleAll);