document.addEventListener('DOMContentLoaded', () => {
    // Getting all the buttons and input fields by their IDs
    const searchButton = document.getElementById('search-button');
    const clearButton = document.getElementById('clear-button');
    const addButton = document.getElementById('add-button');
    const updateButton = document.getElementById('update-button');
    const searchInput = document.getElementById('search-input');
    const recipeContainer = document.getElementById('recipe-container');
    const yourRecipesContainer = document.getElementById('your-recipes-container');

    // When the search button is clicked, run the search function
    searchButton.addEventListener('click', async () => {
        const recipeName = searchInput.value.trim(); // Get the trimmed input value
        if (recipeName) { // Only search if there is a name entered
            // Call the search function
            await searchRecipes(recipeName); 
        }
    });

    // This button clears the input field and any displayed recipes
    clearButton.addEventListener('click', () => {
        // Clear the input field
        searchInput.value = ''; 
        // Clear the displayed public recipes
        recipeContainer.innerHTML = ''; 
        // Clear the displayed local recipes
        yourRecipesContainer.innerHTML = ''; 
    });

    // When the add button is clicked, prompt the user to add a new recipe
    addButton.addEventListener('click', async () => {
         // Prompt for recipe name
        const recipeName = prompt("Enter the name of the new recipe:"); 
        // Prompt for recipe image URL
        const recipeImage = prompt("Enter the image URL for the recipe:"); 
        // Prompt for ingredients
        const recipeIngredients = prompt("Enter ingredients, separated by commas:");
        // Prompt for instructions
        const recipeInstructions = prompt("Enter the instructions:"); 

        // Validate user input
        if (!recipeName || !recipeImage || !recipeIngredients || !recipeInstructions) {
            // Alert if any field is empty
            alert("Please fill in all fields."); 
            // Exit the function if input is invalid
            return; 
        }

        // Create a new recipe object
        const newRecipe = {
            name: recipeName,
            image: recipeImage,
             // Split ingredients into an array
            ingredients: recipeIngredients.split(',').map(ingredient => ingredient.trim()),
            instructions: recipeInstructions
        };
         // Call function to post the new recipe
        await postRecipe(newRecipe); 
    });

    // Update an existing recipe when the update button is clicked
    // Update an existing recipe when the update button is clicked
updateButton.addEventListener('click', async () => {
    // Prompt for the recipe to update
    const recipeName = prompt("Enter the name of the recipe to update:");
    
    // Check if recipe name is provided
    if (!recipeName) {
        alert("Please enter a recipe name.");
        return; // Exit if no name is provided
    }
    
    // Fetch the existing recipe to get current details
    const fetchResponse = await fetch(`http://localhost:3000/recipes`);
    const recipes = await fetchResponse.json();
    const recipeToUpdate = recipes.find(recipe => recipe.name === recipeName);
    
    // Check if the recipe exists
    if (!recipeToUpdate) {
        alert("Recipe not found.");
        return; // Exit if recipe is not found
    }

    // Prompt for updated image URL with the current URL as default
    const updatedImage = prompt("Enter the updated image URL:", recipeToUpdate.image); 
    
    // Prompt for updated ingredients with the current ingredients as default
    const updatedIngredients = prompt("Enter updated ingredients, separated by commas:", recipeToUpdate.ingredients.join(', '));
    
    // Prompt for updated instructions with the current instructions as default
    const updatedInstructions = prompt("Enter updated instructions:", recipeToUpdate.instructions); 

    // Validate user input
    if (!updatedImage || !updatedIngredients || !updatedInstructions) {
        alert("Please fill in all fields.");
        return; // Exit if any field is empty
    }

    // Create an object with the updated recipe info
    const updatedRecipe = {
        image: updatedImage,
        ingredients: updatedIngredients.split(',').map(ingredient => ingredient.trim()), 
        instructions: updatedInstructions
    };

    // Log for debugging
    console.log("Updated Recipe:", updatedRecipe);  
    // Call function to update the recipe
    await patchRecipe(recipeToUpdate.name, updatedRecipe); 
});

    // Function to search for recipes from TheMealDB API and your local database
    const searchRecipes = async (recipeName) => {
        try {
            // Fetch from public API
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${recipeName}`); 
            // Parse JSON response
            const data = await response.json(); 

            if (data.meals) {
                // Display public recipes if found
                displayPublicRecipes(data.meals); 
            } else {
                // Alert if no public recipes are found
                recipeContainer.innerHTML = '<p>No public recipes found.</p>'; 
            }
             // Fetch and display user's local recipes
            await fetchYourRecipes(recipeName);
        } catch (error) {
            // Log error if fetching fails
            console.error("Error fetching recipes:", error); 
        }
    };

    // Function to display recipes fetched from the public API
    const displayPublicRecipes = (meals) => {
        // Clear existing recipes
        recipeContainer.innerHTML = ''; 
        meals.forEach(meal => {
            // Create a new div for each meal
            const recipeDiv = document.createElement('div'); 
            // Add class for styling
            recipeDiv.classList.add('recipe'); 
            recipeDiv.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}"> <!-- Recipe image -->
                <div class="recipe-info">
                    <h2>${meal.strMeal}</h2> <!-- Recipe name -->
                    <p><strong>Ingredients:</strong></p>
                    <ul>
                        ${getIngredients(meal).map(ingredient => `<li>${ingredient}</li>`).join('')} <!-- List of ingredients -->
                    </ul>
                    <p><strong>Instructions:</strong> ${meal.strInstructions}</p> <!-- Instructions -->
                </div>
            `;
            // Add the recipe div to the container
            recipeContainer.appendChild(recipeDiv); 
        });
    };

    // Helper function to get ingredients from the meal object
    const getIngredients = (meal) => {
        // Initialize an array for ingredients
        const ingredients = []; 
        // Loop through potential ingredients
        for (let i = 1; i <= 20; i++) { 
            // Get ingredient by key
            const ingredient = meal[`strIngredient${i}`]; 
            if (ingredient) {
                 // Add ingredient to the array if it exists
                ingredients.push(ingredient);
            }
        }
        return ingredients; // Return the array of ingredients
    };

    // Fetch your own recipes from the local database
    const fetchYourRecipes = async (recipeName) => {
        try {
            // Fetch local recipes
            const response = await fetch(`http://localhost:3000/recipes`); 
            // Parse JSON response

            const yourRecipes = await response.json(); 
            // Filter recipes based on search name
            const filteredRecipes = yourRecipes.filter(recipe =>
                recipe.name.toLowerCase().includes(recipeName.toLowerCase())
            );

            if (filteredRecipes.length > 0) {
                 // Display filtered recipes
                displayYourRecipes(filteredRecipes);
            } else {
                // Alert if no local recipes are found
                yourRecipesContainer.innerHTML = '<p>No local recipes found.</p>'; 
            }
        } catch (error) {
            // Log error if fetching fails
            console.error("Error fetching your recipes:", error); 
        }
    };

    // Function to display local recipes
    const displayYourRecipes = (recipes) => {
         // Clear existing recipes
        yourRecipesContainer.innerHTML = '';
        recipes.forEach(recipe => {
            // Create a new div for each local recipe
            const recipeDiv = document.createElement('div'); 
            // Add class for styling
            recipeDiv.classList.add('your-recipe'); 
            recipeDiv.innerHTML = `
                <img src="${recipe.image}" alt="${recipe.name}"> <!-- Recipe image -->
                <div class="your-recipe-info">
                    <h2>${recipe.name}</h2> <!-- Recipe name -->
                    <p><strong>Ingredients:</strong></p>
                    <ul>
                        ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')} <!-- List of ingredients -->
                    </ul>
                    <p><strong>Instructions:</strong> ${recipe.instructions}</p> <!-- Instructions -->
                    <button class="delete-button" data-id="${recipe.id}">Delete Recipe</button> <!-- Delete button -->
                </div>
            `;

            // Add event listener for delete button
            const deleteButton = recipeDiv.querySelector('.delete-button');
            deleteButton.addEventListener('click', async () => {
                // Call delete function
                await deleteRecipe(recipe.id); 
                // Remove the recipe from the UI after deletion
                recipeDiv.remove(); 
            });
              // Add the recipe div to the container
            yourRecipesContainer.appendChild(recipeDiv); 
        });
    };

    // POST a new recipe to the server
    const postRecipe = async (newRecipe) => {
        try {
            // Log for debugging
            console.log("Posting new recipe:", newRecipe); 
            const response = await fetch('http://localhost:3000/recipes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // Send new recipe data as JSON
                body: JSON.stringify(newRecipe) 
            });
            if (!response.ok) {
                // Throw error if response is not ok
                throw new Error('Network response was not ok ' + response.statusText); 
            }
             // Parse JSON response
            const data = await response.json();
            // Log success
            console.log("New recipe added:", data); 
        } catch (error) {
             // Log error if adding fails
            console.error("Error adding new recipe:", error);
        }
    };

    // PATCH an existing recipe on the server
    const patchRecipe = async (recipeName, updatedRecipe) => {
        try {
            // Fetch recipes to find the ID of the recipe by name
            const fetchResponse = await fetch('http://localhost:3000/recipes');
            const recipes = await fetchResponse.json();
            // Find recipe by name
            const recipeToUpdate = recipes.find(recipe => recipe.name === recipeName); 
            if (!recipeToUpdate) {
                // Alert if recipe is not found
                alert("Recipe not found."); 
                return; // Exit the function if recipe is not found
            }
            const response = await fetch(`http://localhost:3000/recipes/${recipeToUpdate.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                // Send updated recipe data as JSON
                body: JSON.stringify(updatedRecipe) 
            });
            if (!response.ok) {
                // Throw error if response is not ok
                throw new Error('Network response was not ok ' + response.statusText); 
            }
             // Parse JSON response
            const data = await response.json();
            // Log success
            console.log("Recipe updated:", data); 
        } catch (error) {
             // Log error if updating fails
            console.error("Error updating recipe:", error);
        }
    };

    // DELETE a recipe from the server
    const deleteRecipe = async (recipeId) => {
        try {
            const response = await fetch(`http://localhost:3000/recipes/${recipeId}`, {
                method: 'DELETE' // Specify DELETE request

            });
            if (!response.ok) {
                // Throw error if response is not ok
                throw new Error('Network response was not ok ' + response.statusText); 
            }
            // Log success
            console.log("Recipe deleted:", recipeId); 
        } catch (error) {
            // Log error if deleting fails
            console.error("Error deleting recipe:", error); 
        }
    };
});

