import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")


def generate_insights(prompt, json_mode=False):
    if json_mode:
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
    else:
        response = model.generate_content(prompt)
    return response.text