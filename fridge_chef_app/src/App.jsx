import React, { useState, useEffect, useCallback, useRef } from 'react';

// Assume Tailwind CSS is available in the environment.
// For icons, we can use simple inline SVGs or common emojis.

// --- Recipe Data ---
// This is a LIST OF DICTIONARIES.
// Each dictionary represents a single recipe with structured key-value pairs.
const recipes = [
    {
        id: 'pasta_aglio_e_olio',
        name: "Pasta Aglio e Olio",
        cuisine: "Italian",
        ingredients: [ // This is a LIST of ingredient names for the recipe
            { name: "pasta", category: "Grains/Staples" },
            { name: "garlic", category: "Vegetables" },
            { name: "olive oil", category: "Spices/Condiments" },
            { name: "red pepper flakes", category: "Spices/Condiments" }
        ],
        prep_steps: [ // This is a LIST of strings, each representing a step
            "Boil a large pot of salted water.",
            "While water boils, finely mince the garlic cloves.",
            "In a large pan, heat olive oil over medium-low heat.",
            "Add minced garlic and red pepper flakes to the pan. Cook gently until fragrant, making sure not to burn the garlic (about 1-2 minutes).",
            "Cook pasta according to package directions until al dente.",
            "Before draining, reserve about 1/2 cup of the starchy pasta water.",
            "Drain the pasta and immediately add it to the pan with the garlic and oil.",
            "Toss well to combine, adding a splash of reserved pasta water if needed to create a light, emulsified sauce.",
            "Serve hot, garnished with fresh parsley if desired."
        ]
    },
    {
        id: 'chicken_stir_fry',
        name: "Chicken Stir-Fry",
        cuisine: "Asian",
        ingredients: [
            { name: "chicken breast", category: "Poultry" },
            { name: "broccoli", category: "Vegetables" },
            { name: "carrot", category: "Vegetables" },
            { name: "soy sauce", category: "Spices/Condiments" },
            { name: "rice", category: "Grains/Staples" }
        ],
        prep_steps: [
            "Cook rice according to package directions.",
            "Cut chicken breast into bite-sized pieces.",
            "Chop broccoli florets and thinly slice the carrot.",
            "Heat a tablespoon of oil in a wok or large skillet over medium-high heat.",
            "Add chicken pieces and stir-fry until cooked through and lightly browned (about 5-7 minutes). Remove chicken from pan.",
            "Add broccoli and carrot to the hot pan, stir-fry for 3-5 minutes until tender-crisp.",
            "Return chicken to the pan. Pour in soy sauce.",
            "Toss everything together until well combined and heated through.",
            "Serve hot over the cooked rice."
        ]
    },
    {
        id: 'fruit_salad',
        name: "Refreshing Fruit Salad",
        cuisine: "Healthy",
        ingredients: [
            { name: "apple", category: "Fruits" },
            { name: "banana", category: "Fruits" },
            { name: "orange", category: "Fruits" },
            { name: "grape", category: "Fruits" }
        ],
        prep_steps: [
            "Wash all fruits thoroughly under cold running water.",
            "Peel the orange and carefully slice into small segments or chunks.",
            "Peel the banana and slice it into rounds.",
            "Core the apple and cut it into bite-sized cubes.",
            "If using, remove grapes from their stems. You can leave them whole or slice them in half.",
            "Combine all the prepared fruits in a large mixing bowl.",
            "Gently toss the fruits together to distribute evenly.",
            "Serve chilled for a refreshing treat."
        ]
    },
    {
        id: 'cheese_omelette',
        name: "Simple Cheese Omelette",
        cuisine: "American",
        ingredients: [
            { name: "eggs", category: "Dairy" },
            { name: "milk", category: "Dairy" },
            { name: "cheese", category: "Dairy" }
        ],
        prep_steps: [
            "Crack 2-3 eggs into a medium bowl.",
            "Add a splash of milk (about 1 tablespoon per egg) and whisk well until yolks and whites are fully combined and slightly frothy.",
            "Grate your preferred cheese (e.g., cheddar, Swiss) – about 1/4 cup.",
            "Heat a non-stick pan (about 8-inch) over medium heat. Add a knob of butter or a teaspoon of oil.",
            "Once butter is melted and pan is hot, pour in the egg mixture.",
            "As the edges of the omelette set, gently push the cooked egg towards the center with a spatula, tilting the pan to allow uncooked egg to flow underneath.",
            "When the omelette is mostly set but still slightly moist on top, sprinkle the grated cheese over one half.",
            "Carefully fold the omelette in half using your spatula.",
            "Cook for another minute or until the cheese is melted to your liking and the omelette is cooked through.",
            "Slide onto a plate and serve hot."
        ]
    }
];

// This is a DICTIONARY OF LISTS.
// Keys are categories, values are lists of ingredients in that category.
const predefinedIngredients = {
    "Fruits": ["apple", "banana", "orange", "grape", "strawberry", "blueberry", "mango", "pear"],
    "Vegetables": ["broccoli", "carrot", "onion", "garlic", "bell pepper", "spinach", "potato", "tomato", "zucchini"],
    "Dairy": ["milk", "cheese", "eggs", "yogurt", "butter"],
    "Poultry": ["chicken breast", "chicken thigh", "turkey ground"],
    "Meat": ["ground beef", "pork chop", "steak"],
    "Seafood": ["salmon fillet", "shrimp", "cod"],
    "Grains/Staples": ["rice", "pasta", "bread", "quinoa", "tortillas", "oats"],
    "Spices/Condiments": ["salt", "pepper", "olive oil", "soy sauce", "red pepper flakes", "vinegar", "mustard", "ketchup"]
};

// --- Main App Component ---
const App = () => {
    // State to manage the current screen/step of the game
    const [currentScreen, setCurrentScreen] = useState('start');

    // This is a LIST of strings (selected ingredient names).
    const [selectedIngredients, setSelectedIngredients] = useState([]);

    // This is a string for the selected cuisine.
    const [selectedCuisine, setSelectedCuisine] = useState('');

    // This is a DICTIONARY (object) storing details of the suggested meal.
    const [suggestedMeal, setSuggestedMeal] = useState(null);

    // Numeric states for cooking progress.
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [cookingProgress, setCookingProgress] = useState(0);

    // This is a DICTIONARY OF LISTS, similar to predefinedIngredients, but for user-added items.
    const [customIngredients, setCustomIngredients] = useState(() => {
        const initialCustom = {};
        Object.keys(predefinedIngredients).forEach(category => {
            initialCustom[category] = [];
        });
        return initialCustom;
    });

    // This is a DICTIONARY to hold current input values for each category's add field.
    const [newIngredientInput, setNewIngredientInput] = useState({});

    // AI Chatbot States
    // This is a LIST OF DICTIONARIES, where each dictionary is a chat message.
    const [chatHistory, setChatHistory] = useState([]);
    // This is a string for the current user input.
    const [userMessage, setUserMessage] = useState('');
    // Boolean state for loading indicators.
    const [isAILoading, setIsAILoading] = useState(false);
    const chatContainerRef = useRef(null);

    // Scroll to bottom of chat history when new messages arrive
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]); // Dependency on chatHistory (a list)

    // Function to handle ingredient selection/deselection
    const toggleIngredient = (ingredientName) => {
        setSelectedIngredients(prev =>
            prev.includes(ingredientName)
                ? prev.filter(item => item !== ingredientName)
                : [...prev, ingredientName]
        );
    };

    // Function to add a custom ingredient
    const addCustomIngredient = (category) => {
        const input = newIngredientInput[category];
        if (input && input.trim() !== '') {
            const newIngredient = input.trim().toLowerCase();
            const isPredefined = predefinedIngredients[category].includes(newIngredient);
            const isCustom = customIngredients[category].includes(newIngredient); // Accessing customIngredients (dictionary of lists)

            if (!isPredefined && !isCustom) {
                setCustomIngredients(prev => ({ // Updating customIngredients (dictionary of lists)
                    ...prev,
                    [category]: [...prev[category], newIngredient] // Appending to a list within the dictionary
                }));
                toggleIngredient(newIngredient); // Updates selectedIngredients (a list)
            } else if (isPredefined && !selectedIngredients.includes(newIngredient)) {
                toggleIngredient(newIngredient); // Updates selectedIngredients (a list)
            } else if (isCustom && !selectedIngredients.includes(newIngredient)) {
                toggleIngredient(newIngredient); // Updates selectedIngredients (a list)
            }
            setNewIngredientInput(prev => ({ ...prev, [category]: '' })); // Updates newIngredientInput (a dictionary)
        }
    };

    // Function to handle AI chat message sending
    const sendAIMessage = async () => {
        if (userMessage.trim() === '') return;

        const newUserMessage = { role: "user", parts: [{ text: userMessage }] }; // Creates a DICTIONARY for a new message
        setChatHistory(prev => [...prev, newUserMessage]); // Adds to chatHistory (list of dictionaries)
        setIsAILoading(true);
        setUserMessage('');

        try {
            let chatHistoryForApi = [...chatHistory, newUserMessage]; // Uses chatHistory (list of dictionaries)
            const payload = { contents: chatHistoryForApi }; // Payload includes chat history

            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                setChatHistory(prev => [...prev, { role: "model", parts: [{ text: text }] }]); // Adds to chatHistory (list of dictionaries)
            } else {
                setChatHistory(prev => [...prev, { role: "model", parts: [{ text: "Sorry, I couldn't generate a response." }] }]);
            }
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            setChatHistory(prev => [...prev, { role: "model", parts: [{ text: "Error: Could not connect to the AI. Please try again later." }] }]);
        } finally {
            setIsAILoading(false);
        }
    };

    // Function to generate a recipe using AI
    const generateRecipeWithAI = async () => {
        setIsAILoading(true);
        setSuggestedMeal(null);

        const prompt = `Generate a simple recipe in JSON format based on these ingredients: ${selectedIngredients.join(', ')}. ` + // Uses selectedIngredients (a list)
                       (selectedCuisine ? `The cuisine preference is ${selectedCuisine}. ` : '') + // Uses selectedCuisine (a string)
                       `The recipe should include a 'name' (string), 'ingredients' (array of strings for ingredients, clearly stating if it's "you have" or "you need" in parentheses), and 'prep_steps' (array of strings). Try to keep the ingredients to a reasonable number (5-8 total, including needed ones) and the steps concise (5-8 steps). Example ingredient format: "pasta (you have)", "chicken breast (you need)".`;

        try {
            const payload = {
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: { // This SCHEMA explicitly defines the expected DICTIONARY structure for AI output
                        type: "OBJECT",
                        properties: {
                            name: { type: "STRING" },
                            ingredients: {
                                type: "ARRAY", // Expected to be a LIST of strings
                                items: { type: "STRING" }
                            },
                            prep_steps: {
                                type: "ARRAY", // Expected to be a LIST of strings
                                items: { type: "STRING" }
                            }
                        },
                        required: ["name", "ingredients", "prep_steps"]
                    }
                }
            };
            const apiKey = "";

            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const jsonText = result.candidates[0].content.parts[0].text;
                const parsedRecipe = JSON.parse(jsonText); // Parses AI's JSON (DICTIONARY) response

                const aiRecipeIngredients = parsedRecipe.ingredients; // This is a LIST from the AI response
                const commonIngredients = []; // This will be a LIST
                const missingIngredients = []; // This will be a LIST

                aiRecipeIngredients.forEach(aiIng => {
                    if (aiIng.toLowerCase().includes('(you have)')) {
                        commonIngredients.push(aiIng.replace(/\s*\(you have\)/i, ''));
                    } else if (aiIng.toLowerCase().includes('(you need)')) {
                        missingIngredients.push(aiIng.replace(/\s*\(you need\)/i, ''));
                    } else {
                        missingIngredients.push(aiIng);
                    }
                });

                const totalRecipeIngredients = commonIngredients.length + missingIngredients.length;
                const matchPercentage = totalRecipeIngredients > 0 ? (commonIngredients.length / totalRecipeIngredients) * 100 : 0;

                setSuggestedMeal({ // suggestedMeal is set to a DICTIONARY
                    ...parsedRecipe,
                    commonIngredients, // Storing these as LISTS within the suggestedMeal DICTIONARY
                    missingIngredients,
                    matchPercentage,
                    isAIGenerated: true
                });

                setCurrentScreen('meal-suggest');

            } else {
                setSuggestedMeal(null);
                setCurrentScreen('meal-suggest');
            }
        } catch (error) {
            console.error("Error generating recipe with AI:", error);
            setSuggestedMeal(null);
            setCurrentScreen('meal-suggest');
        } finally {
            setIsAILoading(false);
        }
    };


    // Function to find a meal based on selected ingredients and cuisine
    const findMeal = useCallback(() => {
        const filteredByCuisine = selectedCuisine
            ? recipes.filter(recipe => recipe.cuisine === selectedCuisine) // Filtering the 'recipes' LIST OF DICTIONARIES
            : recipes;

        let bestMatch = null;
        let highestMatchPercentage = 0;

        filteredByCuisine.forEach(recipe => { // Iterating through the LIST OF DICTIONARIES
            const recipeIngredientsNames = recipe.ingredients.map(ing => ing.name); // Accessing 'ingredients' (LIST) within a recipe DICTIONARY
            const commonIngredients = recipeIngredientsNames.filter(ingredientName =>
                selectedIngredients.includes(ingredientName) // Checking against selectedIngredients (a LIST)
            );
            const missingIngredients = recipeIngredientsNames.filter(ingredientName =>
                !selectedIngredients.includes(ingredientName)
            );

            const matchPercentage = (commonIngredients.length / recipeIngredientsNames.length) * 100;

            const MIN_MATCH_PERCENTAGE = 30;

            if (matchPercentage >= MIN_MATCH_PERCENTAGE && matchPercentage > highestMatchPercentage) {
                highestMatchPercentage = matchPercentage;
                bestMatch = { // Creating a DICTIONARY for the best match
                    ...recipe,
                    commonIngredients,
                    missingIngredients,
                    matchPercentage,
                    isAIGenerated: false
                };
            }
        });

        setSuggestedMeal(bestMatch); // suggestedMeal state (DICTIONARY) is updated
        setCurrentScreen('meal-suggest');
    }, [selectedIngredients, selectedCuisine]);

    // Handle starting the cooking process
    const startCooking = () => {
        if (suggestedMeal) { // Accessing suggestedMeal (a DICTIONARY)
            setCurrentStepIndex(0);
            setCookingProgress(0);
            setCurrentScreen('cooking');
        }
    };

    // Handle moving to the next cooking step
    const nextCookingStep = () => {
        if (!suggestedMeal) return;

        const totalSteps = suggestedMeal.prep_steps.length; // Accesses prep_steps (a LIST) from suggestedMeal (DICTIONARY)
        const nextIndex = currentStepIndex + 1;

        if (nextIndex < totalSteps) {
            setCurrentStepIndex(nextIndex);
            setCookingProgress(((nextIndex) / totalSteps) * 100);
        } else {
            setCookingProgress(100);
            setCurrentScreen('completed');
        }
    };

    // --- UI Rendering based on currentScreen state ---

    // Start Screen
    if (currentScreen === 'start') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-300 to-blue-500 p-4 font-inter text-gray-800">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-lg w-full transform transition-all duration-300 scale-100 hover:scale-105">
                    <h1 className="text-5xl font-extrabold text-green-700 mb-6 drop-shadow-lg">
                        Fridge Chef! 🍳
                    </h1>
                    <p className="text-lg mb-8 text-gray-700">
                        Turn your fridge ingredients into delicious meals. Let's cook!
                    </p>
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={() => setCurrentScreen('fridge-select')}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300"
                        >
                            Start Cooking Adventure!
                        </button>
                        <button
                            onClick={() => setCurrentScreen('ai-assistant')}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-purple-300"
                        >
                            Talk to AI Assistant 🤖
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Fridge Selection Screen
    if (currentScreen === 'fridge-select') {
        return (
            <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-yellow-200 to-orange-400 p-4 font-inter text-gray-800">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-3xl w-full my-8">
                    <h2 className="text-4xl font-bold text-orange-700 mb-6 text-center">
                        What's in Your Fridge? 🍎🥕🧀
                    </h2>
                    <p className="text-md text-gray-700 mb-8 text-center">
                        Select the ingredients you currently have or add new ones.
                    </p>

                    {/* Display Selected Ingredients with Delete Function */}
                    {selectedIngredients.length > 0 && ( // Checks length of selectedIngredients (LIST)
                        <div className="bg-blue-50 p-4 rounded-xl shadow-inner mb-6 border border-blue-200">
                            <h3 className="text-xl font-semibold text-blue-800 mb-3 border-b-2 border-blue-300 pb-2">
                                Your Selected Ingredients:
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {selectedIngredients.map(ingredient => ( // Iterates through selectedIngredients (LIST)
                                    <span
                                        key={ingredient}
                                        className="inline-flex items-center bg-blue-200 text-blue-800 text-sm font-medium px-3 py-1 rounded-full shadow-sm"
                                    >
                                        {ingredient}
                                        <button
                                            onClick={() => toggleIngredient(ingredient)} // Removes from selectedIngredients (LIST)
                                            className="ml-2 text-blue-600 hover:text-blue-900 focus:outline-none"
                                            aria-label={`Remove ${ingredient}`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}


                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {Object.entries(predefinedIngredients).map(([category, ingredients]) => ( // Iterates through predefinedIngredients (DICTIONARY)
                            <div key={category} className="bg-gray-50 p-4 rounded-xl shadow-inner border border-gray-200">
                                <h3 className="text-xl font-semibold text-gray-800 mb-3 border-b-2 border-orange-300 pb-2 flex items-center">
                                    {category === "Fruits" && <span className="mr-2 text-2xl">🍓</span>}
                                    {category === "Vegetables" && <span className="mr-2 text-2xl">🥦</span>}
                                    {category === "Dairy" && <span className="mr-2 text-2xl">🥛</span>}
                                    {category === "Poultry" && <span className="mr-2 text-2xl">🍗</span>}
                                    {category === "Meat" && <span className="mr-2 text-2xl">🥩</span>}
                                    {category === "Seafood" && <span className="mr-2 text-2xl">🐟</span>}
                                    {category === "Grains/Staples" && <span className="mr-2 text-2xl">🍚</span>}
                                    {category === "Spices/Condiments" && <span className="mr-2 text-2xl">🧂</span>}
                                    {category}
                                </h3>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {/* Predefined ingredients */}
                                    {ingredients.map(ingredient => ( // Iterates through the LIST of ingredients for a category
                                        <button
                                            key={ingredient}
                                            onClick={() => toggleIngredient(ingredient)}
                                            className={`py-2 px-4 rounded-full text-sm font-medium transition-colors duration-200 ease-in-out
                                                        ${selectedIngredients.includes(ingredient) // Checks against selectedIngredients (LIST)
                                                            ? 'bg-orange-500 text-white shadow-md'
                                                            : 'bg-gray-200 text-gray-700 hover:bg-orange-200 hover:text-orange-800'
                                                        }`}
                                        >
                                            {ingredient}
                                        </button>
                                    ))}
                                    {/* Custom ingredients for this category */}
                                    {customIngredients[category] && customIngredients[category].map(ingredient => ( // Accesses customIngredients (DICTIONARY OF LISTS)
                                        <button
                                            key={ingredient}
                                            onClick={() => toggleIngredient(ingredient)}
                                            className={`py-2 px-4 rounded-full text-sm font-medium transition-colors duration-200 ease-in-out border border-dashed border-gray-400
                                                        ${selectedIngredients.includes(ingredient)
                                                            ? 'bg-purple-500 text-white shadow-md'
                                                            : 'bg-gray-300 text-gray-800 hover:bg-purple-200 hover:text-purple-800'
                                                        }`}
                                        >
                                            {ingredient} (Custom)
                                        </button>
                                    ))}
                                </div>
                                {/* Add new ingredient input and button */}
                                <div className="flex gap-2 mt-4">
                                    <input
                                        type="text"
                                        placeholder={`Add new ${category.toLowerCase()}...`}
                                        value={newIngredientInput[category] || ''} // Accesses newIngredientInput (DICTIONARY)
                                        onChange={(e) => setNewIngredientInput(prev => ({ ...prev, [category]: e.target.value }))}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                addCustomIngredient(category);
                                            }
                                        }}
                                        className="flex-grow p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-700"
                                    />
                                    <button
                                        onClick={() => addCustomIngredient(category)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center flex justify-between items-center mt-8">
                        <button
                            onClick={() => setCurrentScreen('start')}
                            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-gray-300"
                        >
                            Back
                        </button>
                        <button
                            onClick={() => setCurrentScreen('cuisine-select')}
                            disabled={selectedIngredients.length === 0} // Checks length of selectedIngredients (LIST)
                            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-transform duration-200 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300
                                        ${selectedIngredients.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                        >
                            Next: Choose Cuisine {selectedIngredients.length > 0 ? `(${selectedIngredients.length} selected)` : ''}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Cuisine Selection Screen
    if (currentScreen === 'cuisine-select') {
        const cuisines = [...new Set(recipes.map(r => r.cuisine))]; // Uses 'recipes' (LIST OF DICTIONARIES) to extract unique cuisines.

        return (
            <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-purple-300 to-pink-500 p-4 font-inter text-gray-800">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-xl w-full my-8 text-center">
                    <h2 className="text-4xl font-bold text-pink-700 mb-6">
                        What's Your Craving? 🍜🌮
                    </h2>
                    <p className="text-md text-gray-700 mb-8">
                        Choose a cuisine to narrow down your meal options.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        {cuisines.map(cuisine => ( // Iterates through 'cuisines' (a LIST)
                            <button
                                key={cuisine}
                                onClick={() => setSelectedCuisine(cuisine)} // Updates selectedCuisine (a STRING)
                                className={`py-3 px-6 rounded-full text-lg font-semibold shadow-md transform transition-transform duration-200 ease-in-out
                                            ${selectedCuisine === cuisine // Compares with selectedCuisine (a STRING)
                                                ? 'bg-pink-600 text-white shadow-xl'
                                                : 'bg-gray-200 text-gray-700 hover:bg-pink-100 hover:text-pink-800'
                                            }`}
                            >
                                {cuisine}
                            </button>
                        ))}
                        <button
                            onClick={() => setSelectedCuisine('')}
                            className={`py-3 px-6 rounded-full text-lg font-semibold shadow-md transform transition-transform duration-200 ease-in-out
                                        ${selectedCuisine === ''
                                            ? 'bg-gray-600 text-white shadow-xl'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-800'
                                        }`}
                        >
                            Any Cuisine
                        </button>
                    </div>

                    <div className="text-center flex justify-between items-center mt-8">
                        <button
                            onClick={() => setCurrentScreen('fridge-select')}
                            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-gray-300"
                        >
                            Back
                        </button>
                        <button
                            onClick={findMeal}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-300"
                        >
                            Find My Meal! ✨
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Meal Suggestion Screen
    if (currentScreen === 'meal-suggest') {
        return (
            <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-teal-300 to-cyan-500 p-4 font-inter text-gray-800">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full my-8 text-center">
                    <h2 className="text-4xl font-bold text-teal-700 mb-6">
                        Your Meal Plan! 🍽️
                    </h2>
                    {isAILoading ? (
                        <div className="flex flex-col items-center justify-center py-10">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-500 mb-4"></div>
                            <p className="text-xl text-teal-700 font-semibold">Generating your custom recipe...</p>
                        </div>
                    ) : (
                        <>
                            {suggestedMeal ? ( // Checks if suggestedMeal (DICTIONARY) is not null
                                <>
                                    <h3 className="text-3xl font-semibold text-cyan-800 mb-4">
                                        {suggestedMeal.name} {/* Accessing 'name' from suggestedMeal (DICTIONARY) */}
                                        {suggestedMeal.isAIGenerated && <span className="text-sm text-purple-600 ml-2">(AI Generated)</span>}
                                    </h3>
                                    <p className="text-lg text-gray-700 mb-2">
                                        <span className="font-bold">Cuisine:</span> {suggestedMeal.cuisine}
                                    </p>
                                    <p className="text-xl text-green-700 font-bold mb-6">
                                        {suggestedMeal.matchPercentage.toFixed(0)}% of ingredients available!
                                    </p>

                                    <div className="mb-8 flex flex-col items-center">
                                        {suggestedMeal.commonIngredients.length > 0 && ( // Checks length of commonIngredients (LIST)
                                            <div className="w-full max-w-sm mb-4">
                                                <h4 className="text-2xl font-bold text-gray-800 mb-2">
                                                    Ingredients You Have:
                                                </h4>
                                                <ul className="list-disc list-inside text-left text-gray-700 text-lg">
                                                    {suggestedMeal.commonIngredients.map((ing, index) => ( // Iterates through commonIngredients (LIST)
                                                        <li key={index}>{ing}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {suggestedMeal.missingIngredients.length > 0 && (
                                            <div className="w-full max-w-sm">
                                                <h4 className="text-2xl font-bold text-red-600 mb-2">
                                                    Ingredients You Need:
                                                </h4>
                                                <ul className="list-disc list-inside text-left text-red-700 text-lg">
                                                    {suggestedMeal.missingIngredients.map((ing, index) => ( // Iterates through missingIngredients (LIST)
                                                        <li key={index}>{ing}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {suggestedMeal.prep_steps && suggestedMeal.prep_steps.length > 0 && (
                                            <div className="w-full max-w-sm mt-4">
                                                <h4 className="text-2xl font-bold text-gray-800 mb-2">
                                                    Instructions Summary:
                                                </h4>
                                                <ul className="list-decimal list-inside text-left text-gray-700 text-lg">
                                                    {suggestedMeal.prep_steps.slice(0, 3).map((step, index) => ( // Accesses prep_steps (LIST)
                                                        <li key={index}>{step.substring(0, 50)}...</li>
                                                    ))}
                                                    {suggestedMeal.prep_steps.length > 3 && <li>... (More steps in cooking mode)</li>}
                                                </ul>
                                            </div>
                                        )}
                                    </div>

                                    {suggestedMeal.missingIngredients.length === 0 ? (
                                        <p className="text-lg text-green-700 font-semibold mb-6">
                                            You have everything! Time to cook!
                                        </p>
                                    ) : (
                                        <p className="text-lg text-orange-700 font-semibold mb-6">
                                            Gather the missing ingredients, then you're ready to cook!
                                        </p>
                                    )}

                                    <div className="text-center flex justify-between items-center mt-8">
                                        <button
                                            onClick={() => setCurrentScreen('cuisine-select')}
                                            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-gray-300"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={startCooking}
                                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-300"
                                        >
                                            Start Cooking! 🧑‍🍳
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-2xl text-red-600 font-semibold mb-6">
                                        No predefined meal found with your current ingredients. 😔
                                    </p>
                                    <p className="text-lg text-gray-700 mb-8">
                                        Let our AI Chef create a custom recipe for you!
                                    </p>
                                    <button
                                        onClick={generateRecipeWithAI}
                                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-purple-300 mr-4"
                                    >
                                        Generate Recipe with AI! ✨
                                    </button>
                                    <button
                                        onClick={() => setCurrentScreen('fridge-select')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300"
                                    >
                                        Adjust Fridge/Cuisine
                                    </button>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        );
    }

    // Cooking Practice Screen
    if (currentScreen === 'cooking') {
        const totalSteps = suggestedMeal.prep_steps.length; // Accesses prep_steps (LIST) from suggestedMeal (DICTIONARY)
        const currentStep = suggestedMeal.prep_steps[currentStepIndex]; // Accesses an element from the LIST

        return (
            <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-lime-300 to-green-600 p-4 font-inter text-gray-800">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full my-8">
                    <h2 className="text-4xl font-bold text-green-800 mb-6 text-center">
                        Let's Cook: {suggestedMeal.name}! 🧑‍🍳
                    </h2>

                    <div className="mb-8">
                        <p className="text-lg text-gray-700 text-center mb-2">
                            Step {currentStepIndex + 1} of {totalSteps}
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                            <div
                                className="bg-green-500 h-4 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${cookingProgress}%` }}
                            ></div>
                        </div>
                        <div className="relative bg-gray-100 p-6 rounded-xl shadow-inner border border-gray-200 text-center">
                            <p className="text-2xl font-semibold text-gray-900 leading-relaxed">
                                {currentStep}
                            </p>
                            <div className="mt-6 flex justify-center items-center">
                                {currentStepIndex % 3 === 0 && <span className="text-5xl animate-bounce">🔪</span>}
                                {currentStepIndex % 3 === 1 && <span className="text-5xl animate-spin">🍳</span>}
                                {currentStepIndex % 3 === 2 && <span className="text-5xl animate-pulse">🍲</span>}
                            </div>
                        </div>
                    </div>

                    <div className="text-center flex justify-between items-center mt-8">
                        <button
                            onClick={() => setCurrentScreen('meal-suggest')}
                            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-gray-300"
                        >
                            Back to Meal Plan
                        </button>
                        <button
                            onClick={nextCookingStep}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus://ring-blue-300"
                        >
                            Complete Step! 💪
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Completed Screen
    if (currentScreen === 'completed') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-400 to-red-600 p-4 font-inter text-gray-800">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-lg w-full transform transition-all duration-300 scale-100 hover:scale-105">
                    <h2 className="text-5xl font-extrabold text-red-700 mb-6 drop-shadow-lg">
                        Meal Cooked! 🎉
                    </h2>
                    <p className="text-2xl font-semibold text-gray-800 mb-4">
                        You successfully cooked {suggestedMeal.name}!
                    </p>
                    <p className="text-lg text-gray-700 mb-8">
                        Time to enjoy your delicious creation. Great job, Chef!
                    </p>
                    <button
                        onClick={() => setCurrentScreen('start')}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-300"
                    >
                        Start New Game
                    </button>
                </div>
            </div>
        );
    }

    // AI Assistant Screen
    if (currentScreen === 'ai-assistant') {
        return (
            <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-purple-200 to-blue-400 p-4 font-inter text-gray-800">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full my-8 flex flex-col h-[80vh]">
                    <h2 className="text-4xl font-bold text-purple-700 mb-6 text-center">
                        AI Assistant 🤖
                    </h2>
                    <p className="text-md text-gray-700 mb-6 text-center">
                        Ask me about ingredients, recipes, or even where to buy groceries!
                    </p>

                    {/* Chat History Display */}
                    <div ref={chatContainerRef} className="flex-grow overflow-y-auto border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50 shadow-inner flex flex-col gap-3">
                        {chatHistory.length === 0 && ( // Checks length of chatHistory (LIST)
                            <p className="text-center text-gray-500 italic">Say hello to your AI chef assistant!</p>
                        )}
                        {chatHistory.map((msg, index) => ( // Iterates through chatHistory (LIST OF DICTIONARIES)
                            <div
                                key={index}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`} // Accesses 'role' from message DICTIONARY
                            >
                                <div
                                    className={`p-3 rounded-lg max-w-[75%] shadow-md ${
                                        msg.role === 'user'
                                            ? 'bg-blue-500 text-white rounded-br-none'
                                            : 'bg-gray-200 text-gray-800 rounded-bl-none'
                                    }`}
                                >
                                    {msg.parts.map((part, pIdx) => ( // Accesses 'parts' (LIST) from message DICTIONARY
                                        <p key={pIdx}>{part.text}</p>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {isAILoading && (
                            <div className="flex justify-start">
                                <div className="p-3 rounded-lg bg-gray-200 text-gray-800 rounded-bl-none animate-pulse">
                                    Thinking...
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Chat Input */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={userMessage}
                            onChange={(e) => setUserMessage(e.target.value)} // Updates userMessage (STRING)
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && !isAILoading) {
                                    sendAIMessage();
                                }
                            }}
                            placeholder="Type your message..."
                            className="flex-grow p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-700"
                            disabled={isAILoading}
                        />
                        <button
                            onClick={sendAIMessage}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-purple-300"
                            disabled={isAILoading}
                        >
                            Send
                        </button>
                    </div>

                    <div className="text-center mt-6">
                        <button
                            onClick={() => setCurrentScreen('start')}
                            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-gray-300"
                        >
                            Back to Main Menu
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null; // Should not reach here
};

export default App;

