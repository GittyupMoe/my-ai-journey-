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

            const apiKey = "AIzaSyD47yG25fuAamSwtSYb3ujM6Gz_L-nMu-8";
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
            const apiKey = "AIzaSyD47yG25fuAamSwtSYb3ujM6Gz_L-nMu-8";

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
                setCurrentScreen('meal-suggest'); // Still go to meal-suggest, but show no recipe
            }
        } catch (error) {
            console.error("Error generating recipe with AI:", error);
            setSuggestedMeal(null);
            setCurrentScreen('meal-suggest'); // Still go to meal-suggest, but show error
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

            const MIN_MATCH_PERCENTAGE = 30; // Define a minimum match percentage to suggest a recipe

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

    // Reset the game to the start
    const resetGame = () => {
        setSelectedIngredients([]);
        setSelectedCuisine('');
        setSuggestedMeal(null);
        setCurrentStepIndex(0);
        setCookingProgress(0);
        setChatHistory([]);
        setUserMessage('');
        setIsAILoading(false);
        setCurrentScreen('start');
    };

    // --- UI Rendering based on currentScreen state ---

    // Start Screen
    if (currentScreen === 'start') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-300 to-blue-500 p-4 font-sans text-gray-800">
                <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl text-center max-w-lg w-full transform transition-all duration-300 scale-100 hover:scale-105">
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
            <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-yellow-200 to-orange-400 p-4 font-sans text-gray-800">
                <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl max-w-4xl w-full my-8">
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
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-300 to-pink-500 p-4 font-sans text-gray-800">
                <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl max-w-xl w-full my-8 text-center">
                    <h2 className="text-4xl font-bold text-pink-700 mb-6">
                        What's Your Craving? 🍜🌮
                    </h2>
                    <p className="text-md text-gray-700 mb-8">
                        Choose a cuisine, or let the AI chef decide for you!
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        {cuisines.map(cuisine => ( // Iterates through 'cuisines' (a LIST)
                            <button
                                key={cuisine}
                                onClick={() => setSelectedCuisine(cuisine)} // Updates selectedCuisine (a STRING)
                                className={`py-3 px-6 rounded-full text-lg font-semibold shadow-md transform transition-transform duration-200 ease-in-out
                                            ${selectedCuisine === cuisine
                                                ? 'bg-pink-600 text-white shadow-lg scale-105'
                                                : 'bg-purple-200 text-purple-800 hover:bg-pink-300 hover:text-pink-900'
                                            }`}
                            >
                                {cuisine}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
                        <button
                            onClick={() => setCurrentScreen('fridge-select')}
                            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-gray-300"
                        >
                            Back to Ingredients
                        </button>
                        <button
                            onClick={findMeal}
                            disabled={isAILoading}
                            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-transform duration-200 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300
                                        ${isAILoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                        >
                            Find Meal (Predefined)
                        </button>
                        <button
                            onClick={generateRecipeWithAI}
                            disabled={isAILoading}
                            className={`bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-transform duration-200 active:scale-95 focus:outline-none focus:ring-4 focus:ring-teal-300
                                        ${isAILoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                        >
                            {isAILoading ? 'Generating...' : 'Generate with AI 🧠'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Meal Suggestion Screen
    if (currentScreen === 'meal-suggest') {
        return (
            <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-green-200 to-teal-400 p-4 font-sans text-gray-800">
                <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl max-w-2xl w-full my-8 text-center">
                    <h2 className="text-4xl font-bold text-teal-700 mb-6">
                        Your Suggested Meal! 🎉
                    </h2>
                    {suggestedMeal ? ( // Checks if suggestedMeal (DICTIONARY) is not null
                        <>
                            <h3 className="text-3xl font-semibold text-gray-800 mb-4">{suggestedMeal.name}</h3>
                            {suggestedMeal.isAIGenerated && ( // Checks a boolean flag in the suggestedMeal DICTIONARY
                                <p className="text-sm text-gray-600 mb-4 italic">
                                    (AI-Generated Recipe)
                                </p>
                            )}

                            {suggestedMeal.matchPercentage !== undefined && ( // Checks for presence of 'matchPercentage' in suggestedMeal DICTIONARY
                                <div className="mb-6">
                                    <p className="text-lg text-gray-700 mb-2">
                                        Ingredient Match: <span className="font-bold text-teal-600">{suggestedMeal.matchPercentage.toFixed(0)}%</span>
                                    </p>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-teal-500 h-2.5 rounded-full"
                                            style={{ width: `${suggestedMeal.matchPercentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}

                            <div className="text-left mb-6">
                                <h4 className="text-2xl font-semibold text-gray-800 mb-3 border-b-2 border-teal-300 pb-2">Ingredients:</h4>
                                <ul className="list-disc list-inside text-gray-700">
                                    {suggestedMeal.isAIGenerated ? (
                                        // For AI generated, ingredients are already formatted with (you have/need)
                                        suggestedMeal.ingredients.map((ing, index) => ( // Iterates through 'ingredients' (LIST) in suggestedMeal DICTIONARY
                                            <li key={index} className={`${ing.toLowerCase().includes('(you have)') ? 'text-green-700' : 'text-red-700'}`}>
                                                {ing}
                                            </li>
                                        ))
                                    ) : (
                                        // For predefined, show common and missing separately
                                        <>
                                            {suggestedMeal.commonIngredients && suggestedMeal.commonIngredients.length > 0 && (
                                                <li className="font-medium">You Have:</li>
                                            )}
                                            {suggestedMeal.commonIngredients && suggestedMeal.commonIngredients.map((ing, index) => ( // Iterates through 'commonIngredients' (LIST)
                                                <li key={`common-${index}`} className="ml-4 text-green-700">
                                                    ✅ {ing}
                                                </li>
                                            ))}
                                            {suggestedMeal.missingIngredients && suggestedMeal.missingIngredients.length > 0 && (
                                                <li className="font-medium mt-2">You Might Need:</li>
                                            )}
                                            {suggestedMeal.missingIngredients && suggestedMeal.missingIngredients.map((ing, index) => ( // Iterates through 'missingIngredients' (LIST)
                                                <li key={`missing-${index}`} className="ml-4 text-red-700">
                                                    ❌ {ing}
                                                </li>
                                            ))}
                                        </>
                                    )}
                                </ul>
                            </div>

                            <div className="text-left mb-8">
                                <h4 className="text-2xl font-semibold text-gray-800 mb-3 border-b-2 border-teal-300 pb-2">Preparation Steps:</h4>
                                <ol className="list-decimal list-inside text-gray-700">
                                    {suggestedMeal.prep_steps.map((step, index) => ( // Iterates through 'prep_steps' (LIST) in suggestedMeal DICTIONARY
                                        <li key={index} className="mb-2">{step}</li>
                                    ))}
                                </ol>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <button
                                    onClick={() => setCurrentScreen('cuisine-select')}
                                    className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-gray-300"
                                >
                                    Choose Another Meal
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
                        <div className="text-center">
                            <p className="text-xl text-gray-700 mb-6">
                                Oops! We couldn't find a suitable recipe with your selected ingredients and cuisine.
                            </p>
                            <p className="text-lg text-gray-600 mb-8">
                                Try selecting more ingredients, different ones, or exploring the AI Assistant for more creative ideas!
                            </p>
                            <button
                                onClick={() => setCurrentScreen('fridge-select')}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300"
                            >
                                Back to Ingredients
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Cooking Screen
    if (currentScreen === 'cooking') {
        if (!suggestedMeal || !suggestedMeal.prep_steps || suggestedMeal.prep_steps.length === 0) { // Safety check for suggestedMeal (DICTIONARY) and its 'prep_steps' (LIST)
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-200 to-red-400 p-4 font-sans text-gray-800">
                    <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
                        <h2 className="text-3xl font-bold text-red-700 mb-4">Error: No Recipe Found!</h2>
                        <p className="mb-6">Please go back and select a meal first.</p>
                        <button
                            onClick={() => setCurrentScreen('start')}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full shadow-lg"
                        >
                            Back to Start
                        </button>
                    </div>
                </div>
            );
        }

        const currentStep = suggestedMeal.prep_steps[currentStepIndex]; // Accessing an element from 'prep_steps' (LIST)

        return (
            <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-yellow-100 to-red-300 p-4 font-sans text-gray-800">
                <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl max-w-xl w-full my-8">
                    <h2 className="text-4xl font-bold text-red-700 mb-6 text-center">
                        Cooking: {suggestedMeal.name} 🍽️
                    </h2>
                    <div className="mb-6">
                        <p className="text-lg text-gray-700 mb-2">
                            Step {currentStepIndex + 1} of {suggestedMeal.prep_steps.length}
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                            <div
                                className="bg-red-500 h-4 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${cookingProgress}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="bg-yellow-50 p-6 rounded-xl shadow-inner border border-yellow-200 mb-8 text-center text-xl text-gray-800">
                        <p>{currentStep}</p>
                    </div>

                    <div className="flex justify-between items-center mt-8">
                        <button
                            onClick={() => setCurrentScreen('meal-suggest')}
                            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-gray-300"
                        >
                            Back to Meal Details
                        </button>
                        <button
                            onClick={nextCookingStep}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-300"
                        >
                            {currentStepIndex === suggestedMeal.prep_steps.length - 1 ? 'Finish Cooking!' : 'Next Step →'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Completed Screen
    if (currentScreen === 'completed') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-lime-300 to-green-600 p-4 font-sans text-gray-800">
                <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl text-center max-w-lg w-full">
                    <h2 className="text-5xl font-extrabold text-green-800 mb-6 drop-shadow-lg">
                        Meal Cooked! 😋
                    </h2>
                    <p className="text-2xl text-gray-700 mb-8">
                        You successfully cooked {suggestedMeal?.name || "your meal"}! Enjoy!
                    </p>
                    <button
                        onClick={resetGame}
                        className="bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-300"
                    >
                        Start A New Adventure! ✨
                    </button>
                </div>
            </div>
        );
    }

    // AI Assistant Screen
    if (currentScreen === 'ai-assistant') {
        return (
            <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-300 to-indigo-500 p-4 font-sans text-gray-800">
                <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl max-w-2xl w-full my-8 flex flex-col h-[80vh]">
                    <h2 className="text-4xl font-bold text-indigo-700 mb-6 text-center">
                        AI Chef Assistant 🤖
                    </h2>
                    <p className="text-md text-gray-700 mb-4 text-center">
                        Chat with your AI chef for cooking tips, ingredient substitutions, or recipe ideas!
                    </p>

                    <div ref={chatContainerRef} className="flex-grow bg-gray-100 p-4 rounded-lg overflow-y-auto mb-4 border border-gray-300 shadow-inner flex flex-col gap-3">
                        {chatHistory.length === 0 && ( // Checks length of chatHistory (LIST)
                            <p className="text-gray-500 italic text-center">Start chatting with your AI Chef!</p>
                        )}
                        {chatHistory.map((message, index) => ( // Iterates through chatHistory (LIST OF DICTIONARIES)
                            <div
                                key={index}
                                className={`p-3 rounded-lg max-w-[80%] break-words ${message.role === 'user' ? 'bg-blue-200 self-end text-blue-900 rounded-br-none' : 'bg-gray-300 self-start text-gray-800 rounded-bl-none'}`}
                            >
                                {message.parts.map((part, partIndex) => (
                                    <span key={partIndex}>{part.text}</span> // Accesses 'parts' (LIST) within a message DICTIONARY
                                ))}
                            </div>
                        ))}
                        {isAILoading && ( // Checks a boolean flag
                            <div className="self-start bg-gray-200 p-3 rounded-lg max-w-[80%] animate-pulse">
                                <span className="text-gray-600">AI is thinking...</span>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={userMessage} // Accesses userMessage (a STRING)
                            onChange={(e) => setUserMessage(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && !isAILoading) {
                                    sendAIMessage();
                                }
                            }}
                            placeholder="Type your message to the AI chef..."
                            className="flex-grow p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-700"
                            disabled={isAILoading}
                        />
                        <button
                            onClick={sendAIMessage}
                            disabled={isAILoading || userMessage.trim() === ''} // Checks boolean flag and STRING length
                            className={`bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg shadow-md transition-colors duration-200
                                        ${isAILoading || userMessage.trim() === '' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isAILoading ? 'Sending...' : 'Send'}
                        </button>
                    </div>

                    <button
                        onClick={() => setCurrentScreen('start')}
                        className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-gray-300 mt-6 self-center"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    // Fallback for unexpected screen state
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 font-sans text-gray-800">
            <div className="bg-white p-8 rounded-lg shadow-xl text-center">
                <h2 className="text-3xl font-bold text-red-500 mb-4">Something went wrong!</h2>
                <p className="mb-6">Unknown screen state: {currentScreen}</p>
                <button
                    onClick={resetGame}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-md"
                >
                    Reset App
                </button>
            </div>
        </div>
    );
};

export default App;
