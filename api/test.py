from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello from Vercel API"}

@app.post("/")
def post_root():
    return {"message": "POST request received", "status": "ok"}

@app.get("/api")
def api_root():
    return {"message": "API endpoint working"}

@app.post("/api")
def api_post():
    return {"message": "API POST working"}
