
const HEAD = {
    method: 'GET',
    headers: {
    'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
    'X-RapidAPI-Key': 'bc15ad6fe7msh92d4636d10a6e33p1eb30ajsnb776b028d741'
    }
}

function handleSearch() {
    $('.find-recipes').click(event => {
        event.preventDefault();
        let protein = $('.protein').val();
        getRandomRecipe(protein);
        $('.protein').val("");
    });
}
function getRandomRecipe(input) {
    let url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/search?query=${input}&number=50`;
        fetch(url, HEAD)
        .then(response => response.json())
        .then(responseJson => getRecipeInformationById(responseJson));
}
function getRecipeInformationById(responseJson) {
    let rand = generateRandomNumber();
    let recipeId = responseJson.results[rand].id;
    let url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipeId}/information?includeNutrition=true`;
    fetch(url, HEAD)
    .then(response => response.json())
    .then(responseJson => displayRecipeInformation(responseJson));

}
function displayRecipeInformation(responseJson) {
    $('.name').text(`${responseJson.title}`);
    $('.servings').text(`Servings: ${responseJson.servings}`);
    $('.cal').text(`Calories per serving: ${responseJson.nutrition.nutrients[0].amount}`);
    $('.prep').text(`Time: ${responseJson.readyInMinutes} minutes`);
    for (let i = 0; i < responseJson.extendedIngredients.length; i++) {
        $('.ingredients').append(`<li>${responseJson.extendedIngredients[i].originalString}</li>`);
    }
    $('.instructions').text(`Cooking Instructions: ${responseJson.instructions}`);
}
function generateRandomNumber() {
    let rand = Math.floor(Math.random() * 50);
    return rand;
}
$(handleSearch);