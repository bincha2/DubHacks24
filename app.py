from flask import Flask, request, jsonify, json
from flask_cors import CORS
import requests
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

# route to recieve data from front end and send back genAI output
@app.route('/data', methods=['POST'])
def handle_data():
    data = request.get_json()
    ingredients = data.get('ingredients')
    restrictions = data.get('restrictions')
    isVegetarian = data.get('isVegetarian')
    isVegan = data.get('isVegan')
    isGlutenFree = data.get('isGlutenFree')
    isLactoseIntolerant = data.get('isLactoseIntolerant')

    # Process the data
    print(f"Received var: {ingredients}, {restrictions}, {isVegetarian}, {isVegan}, {isGlutenFree}, {isLactoseIntolerant}")

    inputs = [
        { "role": "system", "content": "You are a AI assistant that will list healthy recipes based on the ingredients the user provides and their accomodate for their dietary restrictions." },
        { "role": "user", "content": f"Give me exactly 2 healthy recipes plus cooking instructions (with times if applicable) based on the user's ingredients: {', '.join(ingredients)} with dietary restrictions: {', '.join(restrictions)} and dietary preferences: vegetarian={isVegetarian}, vegan={isVegan}, gluten-free={isGlutenFree}, lactose-intolerant={isLactoseIntolerant}, In your response, number each recipe, and format the text clean. " },
    ]
    output = run("@cf/meta/llama-3-8b-instruct", inputs)

    return jsonify({'message': 'Data received successfully', 'var': ingredients, 'restrictions': restrictions, 'isVegetarian': isVegetarian, 'isVegan': isVegan, 'isGlutenFree': isGlutenFree, 'isLactoseIntolerant': isLactoseIntolerant, 'output': (output['result']['response'])})

# Cloudflare Worker AI api using LLama-3-8b language model
API_BASE_URL = os.getenv("API_BASE_URL")
API_KEY = os.getenv("API_KEY")
headers = {"Authorization": f"Bearer {API_KEY}"}

def run(model, inputs):
    input = { "messages": inputs }
    response = requests.post(f"{API_BASE_URL}{model}", headers=headers, json=input)
    return response.json()


if __name__ == '__main__':
    app.run(debug=True)