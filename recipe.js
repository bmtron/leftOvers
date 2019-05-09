
const HEAD = {
    method: 'GET',
    headers: {
    'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
    'X-RapidAPI-Key': 'bc15ad6fe7msh92d4636d10a6e33p1eb30ajsnb776b028d741'
    }
}
let USERINPUT = [];
function handleSearch() {
    $('.find-recipes').click(event => {
        event.preventDefault();
        emptyResults();
        getRandomRecipe();
        $('.protein').val("");
    });
}
function handleAdd() {
    $('.add').click(event => {
        event.preventDefault();
        USERINPUT.push($('#ingredient-search').val());
        let test = $('#ingredient-search').val();
        $('.add-section').append(`<p class="remove">${test}</p>`);
        $('#ingredient-search').val("");
        console.log(USERINPUT);
    });
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
    .catch(err => {$('.err').text(`Something is wrong: ${err.message}`)});

}
function getRecipeFromIngredientsById(responseJson) {
    let recipeId = responseJson[0].id;
    checkForPurchased(responseJson);
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
    $('.ingredients-title').text('Ingredients:');
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
function handleIngredientSearch() {
	$('.ingsearch').click(event => {
		event.preventDefault();
		emptyResults();
        getIngredients(USERINPUT);
        USERINPUT = [];
		$('.ingredients').val("");
	});
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
    let userArray = input;
	fetch(newUrl, HEAD)
	.then(response => response.json())
    .then(responseJson => getRecipeFromIngredientsById(responseJson, userArray))
    .catch(err => {$('.err').text(`Something went wrong: ${err.message}`)});
}

function checkForPurchased(responseJson) {
    console.log(responseJson);
    let unused = responseJson[0].unusedIngredients;
    let used = responseJson[0].usedIngredients;
    let missing = responseJson[0].missedIngredients;
    
    for (let i = 0; i < unused.length; i++) {
        $('.ingredients').append(`<li class="remove">${unused[i].originalString}</li>`);
    }
    for (let i=0; i < used.length; i++) {
        $('.ingredients').append(`<li class="remove">${used[i].originalString}</li>`);
    }
    for (let i = 0; i < missing.length; i++) {
        $('.ingredients').append(`<li class="remove">${missing[i].originalString}****</li>`);
    }
}
$(handleAdd);
$(handleIngredientSearch);
$(handleSearch);