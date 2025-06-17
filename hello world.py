# This script asks the user for their name and then greets them.

# 1. Ask the user for their name using the input() function.
#    The message inside input() is what the user will see.
#    Whatever the user types will be stored in the 'user_name' variable.
user_name = input("What's your name? ")

# 2. Print a personalized greeting.
#    We use an f-string (formatted string literal) for easy combining of text and variables.
#    The variable 'user_name' is placed inside curly braces {}.
print(f"Hello, {user_name}! Welcome to your AI journey!")

# You can also add another line, for example:
print("It's great to have you here!")