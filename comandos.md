backend:
cd D:\app-menu-image\backend
$env:GEMINI_API_KEY = "AIzaSyBX3Bhw1mYL3pV_jE-Vnfdt6PrEYDl2pBk"
uvicorn app.main:app --reload --port 8000

Frontend:

cd D:\app-menu-image\frontend
npm run dev