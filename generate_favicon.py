from PIL import Image
import os

# Create a simple black square favicon
size = 16
image = Image.new('RGB', (size, size), 'black')

# Save as favicon.ico
image.save('favicon.ico', format='ICO')
