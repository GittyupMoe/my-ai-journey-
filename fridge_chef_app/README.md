# 🍳 Fridge Chef App

A React-based web application that helps users create delicious meals from ingredients they already have in their fridge. The app combines predefined recipes with AI-generated suggestions to provide personalized cooking recommendations.

## 📋 Table of Contents
- [About](#about)
- [Features](#features)
- [How It Works](#how-it-works)
- [AI-Generated Logic](#ai-generated-logic)
- [Core Functions](#core-functions)
- [Installation](#installation)
- [Usage](#usage)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)

## 🎯 About

Fridge Chef is an interactive cooking assistant that solves the common problem of "What can I cook with what I have?" The app features:

- **Ingredient Selection**: Choose from predefined categories or add custom ingredients
- **Cuisine Preferences**: Filter recipes by cuisine type (Italian, Asian, American, Healthy)
- **Smart Recipe Matching**: Find recipes based on available ingredients with percentage matching
- **AI Recipe Generation**: Create custom recipes using Google's Gemini AI
- **Interactive Cooking Guide**: Step-by-step cooking instructions with progress tracking
- **AI Chat Assistant**: Get cooking tips and recipe advice

## ✨ Features

### 🥕 Ingredient Management
- **Predefined Categories**: Fruits, Vegetables, Dairy, Poultry, Meat, Seafood, Grains/Staples, Spices/Condiments
- **Custom Ingredients**: Add your own ingredients to any category
- **Visual Selection**: Interactive buttons with visual feedback
- **Bulk Management**: Select/deselect multiple ingredients easily

### 🍽️ Recipe Matching System
- **Percentage-Based Matching**: Calculates ingredient compatibility (minimum 30% match)
- **Cuisine Filtering**: Filter recipes by preferred cuisine
- **Missing Ingredients**: Shows what you need to buy
- **Best Match Algorithm**: Always suggests the highest compatibility recipe

### 🤖 AI Integration
- **Gemini AI API**: Powered by Google's Gemini 2.0 Flash model
- **Custom Recipe Generation**: Create recipes from any ingredient combination
- **Structured Output**: AI generates recipes in consistent JSON format
- **Chat Assistant**: Interactive AI chef for cooking advice

### 👨‍🍳 Cooking Experience
- **Step-by-Step Instructions**: Guided cooking process
- **Progress Tracking**: Visual progress bar
- **Interactive Navigation**: Move through cooking steps
- **Completion Celebration**: Success screen with reset option

## 🔧 How It Works

### 1. Ingredient Selection Process
```javascript
// Users select ingredients from predefined categories
const predefinedIngredients = {
    "Fruits": ["apple", "banana", "orange", "grape", ...],
    "Vegetables": ["broccoli", "carrot", "onion", "garlic", ...],
    // ... more categories
};

// Custom ingredients can be added to any category
const addCustomIngredient = (category) => {
    // Validates input and adds to custom ingredients list
    // Automatically selects the new ingredient
};
```

### 2. Recipe Matching Algorithm
```javascript
const findMeal = useCallback(() => {
    // Filter recipes by cuisine preference
    const filteredByCuisine = selectedCuisine
        ? recipes.filter(recipe => recipe.cuisine === selectedCuisine)
        : recipes;

    // Calculate match percentage for each recipe
    filteredByCuisine.forEach(recipe => {
        const recipeIngredientsNames = recipe.ingredients.map(ing => ing.name);
        const commonIngredients = recipeIngredientsNames.filter(ingredientName =>
            selectedIngredients.includes(ingredientName)
        );
        
        const matchPercentage = (commonIngredients.length / recipeIngredientsNames.length) * 100;
        
        // Only suggest recipes with 30%+ match
        if (matchPercentage >= 30 && matchPercentage > highestMatchPercentage) {
            bestMatch = { ...recipe, commonIngredients, missingIngredients, matchPercentage };
        }
    });
}, [selectedIngredients, selectedCuisine]);
```

### 3. AI Recipe Generation
```javascript
const generateRecipeWithAI = async () => {
    // Create prompt with selected ingredients and cuisine preference
    const prompt = `Generate a simple recipe in JSON format based on these ingredients: ${selectedIngredients.join(', ')}. 
                   The cuisine preference is ${selectedCuisine}. 
                   Include 'name', 'ingredients' (with "you have"/"you need" labels), and 'prep_steps'.`;

    // Call Gemini AI API with structured schema
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        name: { type: "STRING" },
                        ingredients: { type: "ARRAY", items: { type: "STRING" } },
                        prep_steps: { type: "ARRAY", items: { type: "STRING" } }
                    }
                }
            }
        })
    });
};
```

## 🧠 AI-Generated Logic

### Core AI Features

#### 1. **Structured Recipe Generation**
- **Input**: Selected ingredients + cuisine preference
- **Output**: Complete recipe with name, ingredients, and step-by-step instructions
- **Format**: JSON with specific schema validation
- **Quality Control**: 5-8 ingredients, 5-8 steps for manageability

#### 2. **Ingredient Classification**
- **"You Have"**: Ingredients already selected by user
- **"You Need"**: Additional ingredients required for the recipe
- **Smart Parsing**: AI response parsing to separate available vs. needed ingredients

#### 3. **Chat Assistant**
- **Context-Aware**: Remembers conversation history
- **Cooking Expertise**: Provides cooking tips, substitutions, and advice
- **Real-time Interaction**: Immediate responses with loading states

### AI Integration Architecture

```javascript
// Chat Message Handling
const sendAIMessage = async () => {
    // Maintain conversation context
    let chatHistoryForApi = [...chatHistory, newUserMessage];
    
    // Call Gemini API with conversation history
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: chatHistoryForApi })
    });
    
    // Handle response and update chat
    const result = await response.json();
    setChatHistory(prev => [...prev, { role: "model", parts: [{ text: result.text }] }]);
};
```

## 🔍 Core Functions

### Recipe Matching (`findMeal`)
- **Purpose**: Find the best recipe match based on available ingredients
- **Algorithm**: Percentage-based matching with 30% minimum threshold
- **Features**: Cuisine filtering, ingredient comparison, best match selection

### AI Recipe Generation (`generateRecipeWithAI`)
- **Purpose**: Create custom recipes using AI
- **Integration**: Google Gemini 2.0 Flash API
- **Output**: Structured JSON recipe with ingredients and steps

### Ingredient Management (`toggleIngredient`, `addCustomIngredient`)
- **Purpose**: Handle ingredient selection and custom additions
- **Features**: Duplicate prevention, category organization, state management

### Cooking Process (`startCooking`, `nextCookingStep`)
- **Purpose**: Guide users through recipe preparation
- **Features**: Progress tracking, step navigation, completion handling

## 🚀 Installation

### Prerequisites
- Node.js (version 16 or higher)
- npm (comes with Node.js)

### Setup Steps

1. **Clone or navigate to the project directory**
   ```bash
   cd fridge_chef_app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up AI API Key (Optional)**
   - Get a Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Add the API key to the `apiKey` variable in `src/App.jsx`
   - Note: The app works without AI features if no API key is provided

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:5173/`
   - The app should now be running!

## 📱 Usage

### Getting Started
1. **Launch the app** and click "Start Cooking Adventure!"
2. **Select ingredients** from your fridge using the interactive categories
3. **Add custom ingredients** if needed using the input fields
4. **Choose a cuisine** preference or leave it open for all options
5. **Find a meal** using either predefined recipes or AI generation
6. **Follow the cooking steps** with the interactive guide
7. **Celebrate your success** when the meal is complete!

### AI Features
- **Recipe Generation**: Click "Generate with AI 🧠" to create custom recipes
- **Chat Assistant**: Click "Talk to AI Assistant 🤖" for cooking advice
- **Tips**: Ask the AI about substitutions, cooking techniques, or recipe variations

### Navigation
- **Back buttons**: Navigate to previous screens
- **Reset**: Use "Start A New Adventure!" to begin fresh
- **Progress tracking**: Visual indicators show your cooking progress

## 🛠️ Technology Stack

### Frontend
- **React 19.1.0**: Modern React with hooks and functional components
- **Vite 6.3.5**: Fast build tool and development server
- **Tailwind CSS 3.4.17**: Utility-first CSS framework
- **PostCSS**: CSS processing

### AI Integration
- **Google Gemini 2.0 Flash**: Advanced AI model for recipe generation
- **Fetch API**: HTTP requests for AI communication
- **JSON Schema**: Structured AI response validation

### Development Tools
- **ESLint**: Code linting and quality assurance
- **Autoprefixer**: CSS vendor prefixing
- **React Hooks**: State management and side effects

## 📁 Project Structure

```
fridge_chef_app/
├── src/
│   ├── App.jsx              # Main application component
│   ├── App.css              # Application styles
│   ├── main.jsx             # Application entry point
│   ├── index.css            # Global styles
│   └── assets/              # Static assets
├── public/                  # Public assets
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
└── eslint.config.js         # ESLint configuration
```

## 🎨 Key Features Explained

### State Management
The app uses React hooks for comprehensive state management:
- `useState`: Component state (ingredients, screens, progress)
- `useEffect`: Side effects (chat scrolling, API calls)
- `useCallback`: Memoized functions (recipe finding)
- `useRef`: DOM references (chat container)

### Data Structures
- **Recipes**: Array of objects with ingredients and preparation steps
- **Ingredients**: Categorized dictionary with predefined and custom items
- **Chat History**: Array of message objects for AI conversation
- **UI State**: Screen management and user interaction tracking

### Responsive Design
- **Mobile-first**: Optimized for all screen sizes
- **Touch-friendly**: Large buttons and intuitive navigation
- **Visual feedback**: Hover effects, loading states, and progress indicators

## 🔧 Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Customization
- **Add recipes**: Modify the `recipes` array in `App.jsx`
- **Add ingredients**: Update `predefinedIngredients` object
- **Modify AI prompts**: Adjust the prompt templates in AI functions
- **Styling**: Customize Tailwind classes or modify CSS files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Google Gemini AI**: For providing the AI capabilities
- **React Team**: For the amazing framework
- **Tailwind CSS**: For the utility-first styling approach
- **Vite**: For the fast development experience

---

**Happy Cooking! 🍳✨**
