from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()


apis = os.getenv("API_KEY")

if not apis:
    raise ValueError("API_KEY environment variable is not set.")

client = OpenAI(api_key=apis)

DEFAULT_MODEL = "gpt-4o-mini"