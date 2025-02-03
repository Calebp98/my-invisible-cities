import json
import os
import time
from openai import OpenAI
import requests
from pathlib import Path
from config import OPENAI_API_KEY

# Initialize OpenAI client
client = OpenAI(api_key=OPENAI_API_KEY)

def load_cities():
    """Load cities from the JSON file."""
    with open('src/data/cities.json', 'r') as f:
        return json.load(f)

def get_existing_images():
    """Get list of existing image files."""
    image_dir = Path('src/assets/images')
    if not image_dir.exists():
        image_dir.mkdir(parents=True)
    return {f.name for f in image_dir.glob('*.webp')}

def generate_and_save_image(city_name, city_description):
    """Generate and save an image for a city using DALL-E."""
    prompt = f"Create a dreamy watercolor illustration of {city_name}, a fantastical city: {city_description.split('.')[0]}. Ethereal, mystical, architectural fantasy in soft watercolors."
    
    try:
        print(f"Generating image for {city_name}...")
        response = client.images.generate(
            model="dall-e-3",  # or "dall-e-2" if you prefer
            prompt=prompt,
            size="1024x1024",
            quality="standard",
            n=1,
        )

        # Get the image URL
        image_url = response.data[0].url

        # Download the image
        image_response = requests.get(image_url)
        if image_response.status_code == 200:
            # Save as webp
            output_path = f"src/assets/images/{city_name.lower()}.webp"
            with open(output_path, 'wb') as f:
                f.write(image_response.content)
            print(f"Successfully saved image for {city_name}")
            return True
        else:
            print(f"Failed to download image for {city_name}")
            return False

    except Exception as e:
        print(f"Error generating image for {city_name}: {str(e)}")
        return False

def main():
    # Load cities from JSON
    cities = load_cities()
    
    # Get existing images
    existing_images = get_existing_images()
    
    # Find cities missing images
    missing_images = []
    for city in cities:
        expected_filename = f"{city['name'].lower()}.webp"
        if expected_filename not in existing_images:
            missing_images.append(city)
    
    if not missing_images:
        print("All cities have images!")
        return
    
    print(f"Found {len(missing_images)} cities missing images.")
    
    # Generate missing images
    for city in missing_images:
        success = generate_and_save_image(city['name'], city['text'])
        if success:
            # Wait a bit between requests to avoid rate limits
            time.sleep(2)

if __name__ == "__main__":
    main() 