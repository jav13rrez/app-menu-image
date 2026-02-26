backend:

cd D:\app-menu-image\backend
$env:GEMINI_API_KEY = "tu_nueva_api"
uvicorn app.main:app --reload --port 8000

Frontend:

cd D:\app-menu-image\frontend
npm run dev

todo a la vez:

cd D:\app-menu-image
.\start-local.ps1 -Reload

