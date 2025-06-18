# This script asks the user for their name and then greets them.

# 1. Ask the user for their name using the input() function.
#    The message inside input() is what the user will see.
#    Whatever the user types will be stored in the 'user_name' variable.
user_name = input("What's your name? ")

# 2. Use an if/else statement to check the entered name
if user_name.lower() == "gittyupmoe": # .lower() makes the comparison case-insensitive
    # Special message for GittyupMoe
    print(f"Hey, GittyupMoe! It's an awesome day to learn more about AI.")
else:
    # Generic message for any other name
    print(f"Hey, {user_name}! Have a wonderful day!")

# The original welcome message is removed as the above covers the greeting.
# print(f"Hello, {user_name}! Welcome to your AI journey!")
# print("It's great to have you here!")

