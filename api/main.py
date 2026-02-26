import sys
import os

# Añadimos la carpeta backend al path de búsqueda de Python
# para que la aplicación FastAPI pueda encontrar sus módulos (app.core, app.api, etc.)
backend_path = os.path.join(os.path.dirname(__file__), '..', 'backend')
sys.path.append(backend_path)

# Importamos la instancia de la aplicación desde el backend existente
from app.main import app

# Vercel espera una variable llamada 'app' o 'handler'
# Como ya se llama 'app', no hay que hacer nada más.
