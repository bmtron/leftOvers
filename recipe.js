
const HEAD = {
    method: 'GET',
    headers: {
    'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
    'X-RapidAPI-Key': 'bc15ad6fe7msh92d4636d10a6e33p1eb30ajsnb776b028d741'
    }
}
const USERINPUT = [];
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
        $('.add-section').append(`<p>${test}`);
        $('#ingredient-search').val(" ");
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
function getRecipeFromIngredientsById(responseJson, userInput) {
    let recipeId = responseJson[0].id;
    let url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipeId}/information?includeNutrition=true`;
    fetch(url, HEAD)
    .then(response => response.json())
    .then(responseJson => displayRecipeInformation(responseJson, userInput))
    .catch(err => {$('.err').text(`Something is wrong: ${err.message}`)});
}
function displayRecipeInformation(responseJson, userInput) {
    $('.name').text(`${responseJson.title}`);
    $('.servings').text(`Servings: ${responseJson.servings}`);
    $('.cal').text(`Calories per serving: ${responseJson.nutrition.nutrients[0].amount}`);
    $('.prep').text(`Time: ${responseJson.readyInMinutes} minutes`);
    $('.ingredients-title').text('Ingredients:');
    checkForPurchased(responseJson.extendedIngredients, userInput);
    $('.instructions').append(`Cooking Instructions: ${responseJson.instructions}`);
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
		let ingredients = $('.ingredients').val();
		getIngredients(ingredients);
		$('.ingredients').val("");
	});
}
function getIngredients(input) {
	let ingredients = input;
	let arrayInput = ingredients.split(', ');
	let url = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients?number=1&ranking=1&ignorePantry=true&ingredients=';
	let newUrl = url;
	for (let i = 0; i < arrayInput.length; i++) {
		if (i === arrayInput.length - 1) {
		newUrl = newUrl + arrayInput[i];
		}
		else {
		newUrl = newUrl + arrayInput[i] + '%2C';
		}
    }
    let userArray = arrayInput;
    console.log(newUrl);
	fetch(newUrl, HEAD)
	.then(response => response.json())
    .then(responseJson => getRecipeFromIngredientsById(responseJson, userArray))
    .catch(err => {$('.err').text(`Something went wrong: ${err.message}`)});
}

function checkForPurchased(ingredient, userInput) {
    console.log(ingredient);
    const finalPurchased = [];
    let newIngredient;
    for (let i = 0; i < ingredient.length; i++) {
        let splitName = ingredient[i].name.split(" ");
        for(let k = 0; k < splitName.length; k++) {
            for(let j = 0; j < userInput.length; j++) {
                if (userInput[j] === splitName[k] || userInput[j] + 's' === splitName[k]) {
                    finalPurchased.push(ingredient[i].originalString);
                    ingredient.splice(i, 1);
                }
            }
        }
    }
    console.log(finalPurchased);
    
    addPurchasedIngredients(finalPurchased);
    addMissingIngredients(ingredient);
}
function addPurchasedIngredients(hasIng) {
    for (let i = 0; i < hasIng.length; i++) {
        $('.ingredients').append(`<li class="remove">${hasIng[i]}</li>`);
    }
}
function addMissingIngredients(ingredient) {
    for (let i = 0; i < ingredient.length; i++) {
        $('.ingredients').append(`<li class="remove">${ingredient[i].originalString}****</li>`);
    }
}
$(handleAdd);
$(handleIngredientSearch);
$(handleSearch);