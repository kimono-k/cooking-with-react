import React, { useState, useEffect } from "react";
import RecipeList from "./RecipeList";
import "../css/App.css";
import { v4 as uuidv4 } from "uuid";
import RecipeEdit from "./RecipeEdit";

export const RecipeContext = React.createContext();
const LOCAL_STORAGE_KEY = "cookingWithReact.recipes";

function App() {
  // State for the edit links
  const [selectedRecipeId, setSelectedRecipeId] = useState();

  // State + Load in the recipes which are in the localStorage
  const [recipes, setRecipes] = useState(() => {
    const recipeJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (recipeJSON == null) {
      return sampleRecipes;
    } else {
      return JSON.parse(recipeJSON);
    }
  });

  // Find a recipe from the list to edit
  const selectedRecipe = recipes.find(
    (recipe) => recipe.id === selectedRecipeId
  );
  console.log(selectedRecipe);

  // When the recipes array of objects change then do x
  useEffect(() => {
    console.log("BANANA");
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(recipes));
  }, [recipes]);

  // Object which contain the function references
  const recipeContextValue = {
    handleRecipeAdd,
    handleRecipeDelete,
    handleRecipeSelect,
    handleRecipeChange,
  };

  // Selects the current recipe for edit
  function handleRecipeSelect(id) {
    setSelectedRecipeId(id);
  }

  // Functions
  function handleRecipeAdd() {
    const newRecipe = {
      id: uuidv4(),
      name: "",
      servings: 1,
      cookTime: "",
      instructions: "",
      ingredients: [{ id: uuidv4(), name: "", amount: "" }],
    };

    setSelectedRecipeId(newRecipe.id); // you will see the edit when making a new item
    setRecipes([...recipes, newRecipe]);
  }

  function handleRecipeChange(id, recipe) {
    const newRecipes = [...recipes];
    const index = newRecipes.findIndex((r) => r.id === id);
    newRecipes[index] = recipe;
    setRecipes(newRecipes);
  }

  function handleRecipeDelete(id) {
    if (selectedRecipeId != null && selectedRecipeId === id) {
      setSelectedRecipeId(undefined);
    }
    setRecipes(recipes.filter((recipe) => recipe.id !== id));
  }

  return (
    <RecipeContext.Provider value={recipeContextValue}>
      <RecipeList recipes={recipes} />
      {/* If there is a selected recipe then send the prop, if not stop */}
      {selectedRecipe && <RecipeEdit recipe={selectedRecipe} />}
    </RecipeContext.Provider>
  );
}

// Array of objects with recipes
const sampleRecipes = [
  {
    id: 1,
    name: "Plain Chicken",
    servings: 3,
    cookTime: "1:45",
    instructions:
      " 1. Put salt on chicken\n 2. Put chicken in oven\n 3. Eat chicken\n",
    ingredients: [
      {
        id: 1,
        name: "Chicken",
        amount: "2 Pounds",
      },
      {
        id: 2,
        name: "Salt",
        amount: "1 tbs",
      },
    ],
  },

  {
    id: 2,
    name: "Plain Pork",
    servings: 5,
    cookTime: "0:45",
    instructions:
      " 1. Put paprika on pork\n 2. Put pork in oven\n 3. Eat pork\n",
    ingredients: [
      {
        id: 1,
        name: "Pork",
        amount: "3 Pounds",
      },
      {
        id: 2,
        name: "Salt",
        amount: "2 tbs",
      },
    ],
  },
];

export default App;
