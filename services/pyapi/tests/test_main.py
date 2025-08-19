from fastapi.testclient import TestClient
from app.main import app
client = TestClient(app)
def test_health():
    r = client.get("/health"); assert r.status_code==200 and r.json()["status"]=="ok"
def test_hello_ok():
    r = client.get("/hello", params={"name":"Mint"}); assert r.status_code==200 and r.json()["message"]=="Hello, Mint!"
def test_hello_400():
    r = client.get("/hello"); assert r.status_code==400
