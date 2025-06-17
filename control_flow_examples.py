 # --- 1. Basic 'if' Statement ---
# This checks if a condition is true, and if so, executes the code inside.

print("--- Basic 'if' Example ---")
# ORIGINAL: temperature = 25
try:
    temperature = float(input("Enter temperature for Basic 'if' Example: ")) # Ask user for temperature
    if temperature > 20: # Condition: Is temperature greater than 20?
        print("It's a warm day!")
    else: # Added an else for clarity if condition is false
        print("It's not a warm day (temperature is 20 or less).")
except ValueError:
    print("Invalid input for temperature. Please enter a number.")

print("Finished basic 'if' example.\n")


# --- 2. 'if/else' Statement ---
# This checks a condition. If true, it runs one block of code.
# If false, it runs a different block of code (the 'else' part).

print("--- 'if/else' Example ---")
# ORIGINAL: hour = 10
try:
    hour = int(input("Enter hour (0-23) for 'if/else' Example: ")) # Ask user for hour
    if hour < 12: # Condition: Is hour less than 12?
        print("Good morning!")
    else: # This block runs only if the 'if' condition is False
        print("Good afternoon!")
except ValueError:
    print("Invalid input for hour. Please enter a whole number.")

print("Finished 'if/else' example.\n")


# --- 3. 'if/elif/else' Statement (Multiple Conditions) ---
# Use 'elif' (short for 'else if') when you have more than two possible conditions.
# Python checks conditions one by one, from top to bottom.
# As soon as it finds a True condition, it executes that block and skips the rest.

print("--- 'if/elif/else' Example (Grade Calculator) ---")
# ORIGINAL: score = 85
try:
    score = int(input("Enter student score (0-100) for Grade Calculator: ")) # Ask user for score

    if score >= 90: # Is score 90 or more?
        print("Grade: A")
    elif score >= 80: # Else, is score 80 or more?
        print("Grade: B")
    elif score >= 70: # Else, is score 70 or more?
        print("Grade: C")
    elif score >= 60: # Corrected: Moved D grade 'elif' to the correct position before 'else'
        print("Grade: D")
    else: # This 'else' is a fallback if none of the above conditions are True
        print("Grade: F")
except ValueError:
    print("Invalid input for score. Please enter a whole number.")

print("Finished 'if/elif/else' example.\n")


# --- NEW: 4. More Complex 'if/elif/else' Chain (Movie Rating) ---
# We can add as many 'elif' conditions as needed to cover various scenarios.
# The order of 'elif' matters! Conditions are checked in sequence.

print("--- More Complex 'if/elif/else' Example (Movie Rating) ---")
# ORIGINAL: age = 16
try:
    age = int(input("Enter your age for Movie Rating Example: ")) # Ask user for age

    if age < 5:
        print("Recommended: G-rated movies only.")
    elif age < 13: # This runs if age is 5 or more, BUT less than 13
        print("Recommended: PG or G-rated movies.")
    elif age < 17: # This runs if age is 13 or more, BUT less than 17
        print("Recommended: PG-13, PG, or G-rated movies.")
    elif age >= 17: # This runs if age is 17 or more (i.e., not caught by previous 'elif's)
        print("Recommended: All movie ratings (except NC-17).")
    else: # This 'else' would only run if 'age' somehow wasn't a valid number handled above
        print("Invalid age entered.")
except ValueError:
    print("Invalid input for age. Please enter a whole number.")

print("Finished complex 'if/elif/else' example.\n")


# --- NEW: 5. Nested 'if' Statements ---
# This is when you put an 'if' statement INSIDE another 'if' or 'elif' or 'else' block.
# The inner 'if' is only checked if the outer condition is true.
# Pay close attention to indentation!

print("--- Nested 'if' Example (Game Character Status) ---")
# ORIGINAL: character_health = 70
# ORIGINAL: has_potion = True
# ORIGINAL: enemy_nearby = True
try:
    character_health = int(input("Enter character's health (e.g., 1-100): "))
    has_potion_input = input("Does character have a potion? (yes/no): ").lower()
    has_potion = (has_potion_input == 'yes') # Convert 'yes'/'no' to True/False

    enemy_nearby_input = input("Is an enemy nearby? (yes/no): ").lower()
    enemy_nearby = (enemy_nearby_input == 'yes') # Convert 'yes'/'no' to True/False

    if character_health <= 20: # Outer condition: Is health low?
        print("Health is critically low!")
        if has_potion: # This inner 'if' is checked ONLY IF outer is True
            print("Using health potion to recover.")
        else:
            print("No potion available, must find cover!")
    elif character_health > 20: # Outer condition: Health is OK
        print("Health is stable.")
        if enemy_nearby: # Nested if: Check for enemy ONLY if health is stable
            print("Engaging enemy cautiously!")
        else:
            print("No immediate threats. Exploring...")
    else:
        print("Invalid health value.") # Handles cases where health is negative
except ValueError:
    print("Invalid input for health. Please enter a whole number.")
except Exception as e:
    print(f"An error occurred: {e}")


print("Finished nested 'if' example.\n")


# --- Important Syntax Notes ---
# 1. Condition: The part after 'if', 'elif', or 'else' that evaluates to True or False.
# 2. Colon (:): Always put a colon at the end of the 'if', 'elif', and 'else' lines.
# 3. Indentation: The code *inside* the if/elif/else block MUST be indented (usually 4 spaces).
#    Python uses indentation to know which lines belong to which block.
#    If indentation is incorrect, you'll get an IndentationError.

# Example of incorrect indentation (DO NOT DO THIS):
# if True:
# print("This will cause an error!") # Missing indentation here!

print("--- User Input Example with if/else (Original Age Check) ---")

user_age_str = input("Please enter your age: ")
try:
    user_age = int(user_age_str) # Convert input (which is always text) to a number
    if user_age >= 18:
        print("You are an adult.")
    else:
        print("You are a minor.")
except ValueError:
    print("That's not a valid age. Please enter a number.")



     