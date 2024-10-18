# Recipe Search App
## AUTHOR
Done by: Sheena Mugo  
Done on: 17/10/2024  
GitHub Account: [sheena849](https://github.com/sheena849)

## Project Overview

Welcome to my Recipe Search App! This web application allows users to search for recipes from both **my personal recipe collection** and a **public recipe database** using the **MealDB API**. You can also add new recipes, update existing ones, and explore delicious dishes. I built this project to practice working with **APIs**, handling **GET, POST, PATCH** requests, and enhancing my skills with **JavaScript**, **HTML**, and **CSS**.

## Features

1. Search Functionality: Enter a food name and the app will fetch recipes from both my local recipe collection and the public MealDB API.
2. Display Recipes: View detailed information about each recipe, including ingredients and instructions. The layout makes it easy to follow along while cooking!
3. Add Your Own Recipes: Easily add new recipes to the local collection.
4. Update Recipes: Modify existing recipes with the PATCH feature.
5. Delete Recipes: Remove recipes from your personal collection with the delete button next to each local recipe. This allows you to manage your collection effectively by removing any recipes you no longer want.
6. Clear Search Results: Clear the search results and start over anytime.

## Tech Stack

1. HTML/CSS: Provides the structure and style of the app.
2. JavaScript: Handles interactivity, data fetching, and dynamic content updates.
3. JSON Server: Simulates a backend for storing my personal recipes.
4. MealDB API: Fetches public recipes from the web.

## How to Use

1. **Search Recipes**: Enter the name of a dish and hit the "Search" button. The app will pull up results from both my personal recipe collection and the public MealDB API.
2. Add New Recipes: Enter a recipe name, image URL, ingredients, and instructions, then click "Add Recipe" to store it.
3. Update Recipes: Click "Update Recipe" to modify any existing recipe.
4. Delete Recipes: Use the delete button next to each local recipe to remove it from your collection.
5. Clear Results: Use the "Clear" button to reset the page.

## Future Improvements

I plan to continue expanding the recipe collection and add more features like user login, recipe rating, and possibly a meal planner feature. I'm also interested in improving the overall design and responsiveness for mobile devices.

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/recipe-search-app.git
   ```
   
2. Navigate into the project directory:
   ```bash
   cd recipe-search-app
   ```
   
3. Install JSON Server (if not already installed):
   ```bash
   npm install -g json-server
   ```
   
4. Start the JSON server:
   ```bash
   json-server --watch db.json
   ```

5. Open `index.html` in your browser to see the app in action.

## Credits

This project was built with lots of effort, creativity, and fun! Special thanks to **TheMealDB API** for providing access to the public recipes. I hope this app makes cooking easier and more enjoyable for everyone!

## License
This project is licensed under the MIT License.