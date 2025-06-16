import http.server
import socketserver
import os

# --- Configuration ---
PORT = 8000  # You can choose any available port number (e.g., 8000, 8080, 5000)
FILENAME = "ai_journey_welcome.html" # Name of the HTML file to be served

# --- HTML Content (same as the enhanced AI Journey Welcome Page) ---
# This multiline string holds all the HTML code.
html_content = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your AI Journey Starts Here!</title>
    <!-- Tailwind CSS CDN for easy styling and responsiveness -->
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        /* Custom font for a nice modern look */
        body {
            font-family: 'Inter', sans-serif;
        }
        /* Custom animation for the button */
        @keyframes pulse-once {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        .pulse-animation {
            animation: pulse-once 0.5s ease-in-out;
        }
    </style>
</head>
<body class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-800 via-purple-700 to-pink-500 text-white p-4 sm:p-6 md:p-8">

    <!-- Main Container -->
    <div class="bg-white text-gray-800 p-6 sm:p-8 md:p-10 rounded-3xl shadow-2xl text-center max-w-lg w-full transform transition-all duration-500 hover:scale-[1.01] border-b-4 border-l-2 border-indigo-200">

        <!-- Header Section -->
        <header class="mb-6">
            <h1 class="text-3xl sm:text-4xl font-extrabold text-purple-800 mb-2">
                <span role="img" aria-label="brain emoji">🧠</span> Welcome to Your AI Journey!
            </h1>
            <p class="text-lg sm:text-xl text-gray-600">Hello, World! Your adventure into Artificial Intelligence begins now.</p>
        </header>

        <!-- AI Insight Section -->
        <section class="bg-gradient-to-r from-purple-100 to-indigo-100 p-5 rounded-2xl mb-6 shadow-inner border border-purple-300">
            <h2 class="text-2xl font-bold text-purple-700 mb-3 flex items-center justify-center">
                <span class="mr-2">✨</span> Daily AI Insight
            </h2>
            <p id="ai-insight" class="text-gray-700 text-base sm:text-lg italic mb-4">
                "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle." - Steve Jobs (Applied to your passion in AI!)
            </p>
            <button id="get-insight-btn" class="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75">
                Get New Insight
            </button>
        </section>

        <!-- Importance of Web Dev for AI Section -->
        <section class="bg-blue-50 p-5 rounded-2xl mb-6 shadow-inner border border-blue-200">
            <h2 class="text-2xl font-bold text-blue-700 mb-3 flex items-center justify-center">
                <span class="mr-2">💻</span> Why Web Dev for AI?
            </h2>
            <p class="text-gray-700 text-base sm:text-lg mb-2">
                HTML, CSS, and JavaScript are crucial for building the **interfaces** of AI applications.
            </p>
            <ul class="text-gray-600 text-sm sm:text-base text-left mx-auto max-w-xs list-disc list-inside space-y-1">
                <li><strong class="text-blue-600">HTML:</strong> Structures the content you see.</li>
                <li><strong class="text-blue-600">CSS:</strong> Styles and makes it look beautiful.</li>
                <li><strong class="text-blue-600">JavaScript:</strong> Adds interactivity and connects to AI models!</li>
            </ul>
        </section>

        <!-- Learning Path Encouragement -->
        <section class="bg-green-50 p-5 rounded-2xl shadow-inner border border-green-200">
            <h2 class="text-2xl font-bold text-green-700 mb-3 flex items-center justify-center">
                <span class="mr-2">🚀</span> Keep Learning!
            </h2>
            <p class="text-gray-700 text-base sm:text-lg">
                Every line of code is a step forward. Embrace the challenges and enjoy the process of discovery!
            </p>
        </section>

    </div>

    <!-- JavaScript for dynamic insight -->
    <script>
        // Array of AI-related insights/quotes
        const aiInsights = [
            "Artificial Intelligence is not a threat, but a partner that helps us amplify human ingenuity.",
            "The future of AI lies in its ability to understand context and nuance, just like humans.",
            "Machine Learning is the engine that drives most modern AI applications.",
            "Deep Learning, a subset of Machine Learning, uses neural networks inspired by the human brain.",
            "Data is the fuel for AI. The quality of data directly impacts the intelligence of the model.",
            "Ethical considerations are paramount in AI development to ensure fairness and prevent bias.",
            "Natural Language Processing (NLP) allows AI to understand, interpret, and generate human language.",
            "Computer Vision enables AI to 'see' and interpret visual information from the world.",
            "Reinforcement Learning is how AI learns to make decisions by trial and error, like playing a game.",
            "AI is rapidly transforming industries from healthcare to finance, creating new possibilities.",
            "Embrace continuous learning in AI; the field is always evolving!"
        ];

        let currentInsightIndex = -1; // To ensure the first click gets a new one, or starts from a random index

        function getNewInsight() {
            const insightElement = document.getElementById('ai-insight');
            const oldIndex = currentInsightIndex;
            let newIndex;

            // Ensure a different insight is picked if possible
            do {
                newIndex = Math.floor(Math.random() * aiInsights.length);
            } while (newIndex === oldIndex && aiInsights.length > 1); // Avoid infinite loop if only one insight

            currentInsightIndex = newIndex;
            insightElement.textContent = aiInsights[currentInsightIndex];

            // Add a temporary animation class for visual feedback
            insightElement.classList.add('pulse-animation');
            // Remove the class after the animation finishes
            setTimeout(() => {
                insightElement.classList.remove('pulse-animation');
            }, 500); // Matches the animation duration
        }

        // Add event listener to the button
        document.getElementById('get-insight-btn').addEventListener('click', getNewInsight);

        // Optionally load an initial random insight when the page loads
        document.addEventListener('DOMContentLoaded', getNewInsight);

    </script>
</body>
</html>
"""

# --- Create the HTML file if it doesn't exist ---
# This ensures that the Python server has an HTML file to serve.
# In a real project, you might keep your HTML files separate and just serve the directory.
try:
    with open(FILENAME, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"Created/Updated {FILENAME}")
except IOError as e:
    print(f"Error writing HTML file: {e}")
    exit() # Exit if we can't create the file

# --- Define the Request Handler ---
# SimpleHTTPRequestHandler serves files from the current directory.
# We'll set it up to serve our specific HTML file.
class MyHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Serve the specific HTML file regardless of the path requested
        if self.path == '/' or self.path == f'/{FILENAME}':
            self.send_response(200)
            self.send_header("Content-type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(html_content.encode("utf-8"))
        else:
            # For other requests (like favicon.ico or Tailwind CSS CDN),
            # let the default handler take over.
            super().do_GET()

# --- Set up the server ---
# Use an empty string for the host to make it accessible from any network interface.
Handler = MyHandler
httpd = socketserver.TCPServer(("", PORT), Handler)

print(f"Serving AI Journey page at http://localhost:{PORT}/{FILENAME}")
print("Press Ctrl+C to stop the server.")

# --- Start the server ---
try:
    httpd.serve_forever()
except KeyboardInterrupt:
    print("\nServer stopped.")
    httpd.shutdown()
    # Optionally, clean up the created HTML file if you don't want to keep it
    # os.remove(FILENAME)
    # print(f"Cleaned up {FILENAME}") 