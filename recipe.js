const APP_ID = '62e6e175';
const APP_KEY = 'd220cce5983aadd4d089a2cac3227e74';

function test() {
    $('button').click(event => {
        let insert = $('.input').val();
    fetch(`https://api.edamam.com/search?q=${insert}&app_id=62e6e175&app_key=d220cce5983aadd4d089a2cac3227e74`)
    .then(response => response.json())
    .then(responseJson => printTest(responseJson));
    });
}
function printTest(responseJson) {
    console.log(responseJson);
    let rand = Math.floor(Math.random() * 10);
    $('.testp').text(`Here: ${responseJson.hits[rand].recipe.calories}`);
}
$(test);