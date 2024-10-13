
// used ai to hard code formatting, could not import library
function formatText(text) {
    return text
        .normalize("NFKD") // decompose Unicode characters
        .replace(/[\u0300-\u036f]/g, "") // remove accents and diacritics
        .replace(/[^\x00-\x7F]/g, "") // remove non-ASCII characters
        .replace(/\s+/g, ' ') // replace multiple whitespace characters with a single space
        .trim() // trim leading and trailing whitespace
        .replace(/\n\t\*/g, '• ') // replace newline + tab + asterisk with bullet points
        .replace(/\n\n/g, ' ') // replace double newlines with a single space
        .replace(/\n\*/g, '• ') // replace newline + asterisk with bullet points
        .replace(/\n/g, '<br>'); // replace newline characters with HTML line breaks
}


function addIngredient() {
    const ingredientInput = document.getElementById("ingredientInput");
    const ingredientList = document.getElementById("ingredientList");
    const newIngredient = document.createElement("li");

    newIngredient.textContent = ingredientInput.value;
    ingredientList.appendChild(newIngredient);
    ingredientInput.value = "";
}


function addRestriction() {
    const RestrictionInput = document.getElementById("restrictionsInput");
    const restrictionsList = document.getElementById("restrictionsList");
    const newRestriction = document.createElement("li");

    newRestriction.textContent = RestrictionInput.value;
    restrictionsList.appendChild(newRestriction);
    RestrictionInput.value = "";
}

function generateRecipes() {
    const ingredientList = document.getElementById("ingredientList");
    const ingredients = [];
    for (let i = 0; i < ingredientList.children.length; i++) {
        ingredients.push(ingredientList.children[i].textContent);
    }


    const restrictionsList = document.getElementById("restrictionsList");
    const restrictions = [];
    for (let i = 0; i < restrictionsList.children.length; i++) {
        restrictions.push(restrictionsList.children[i].textContent);
    }

    const isVegetarian = document.getElementById("vegetarian").checked;
    const isVegan = document.getElementById("vegan").checked;
    const isGlutenFree = document.getElementById("glutenFree").checked;
    const isLactoseIntolerant = document.getElementById("lactoseIntolerant").checked;

    //const java script data object that stores the data the user inputted on front end
    const data = {
        ingredients,
        restrictions,
        isVegetarian,
        isVegan,
        isGlutenFree,
        isLactoseIntolerant
    };

    fetch('http://127.0.0.1:5000/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            // Display the output from the AI model
            const recipeList = document.getElementById("recipeList");
            recipeList.innerHTML = `
          <h3>You searched for some recipes with: </h3>
          <p>Ingredients: ${ingredients.join(", ")}</p>
          <p>Dietary Restrictions: ${restrictions.join(", ")}</p>
          <p>Vegetarian: ${isVegetarian}</p>
          <p>Vegan: ${isVegan}</p>
          <p>Gluten-Free: ${isGlutenFree}</p>
          <p>Lactose Intolerant: ${isLactoseIntolerant}</p>
          <h3>Here are some recipes for you:</h3>
          <p>${formatText(data.output)}</p>
        `;
        })
        .catch(error => console.error('Error:', error));
}


