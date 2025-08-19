# cs-ai-roadmap Lesson 1
## Start
- docker compose up -d
- py: http://localhost:8000/health
- ts: http://localhost:3000/health
## Stop / Logs
- docker compose logs -f
- docker compose down
## Tests
- (py) cd services/pyapi && . .venv/bin/activate && pytest -q
- (ts) cd services/tsapi && npm test
## Load (record results)
- npx autocannon -d 10 -c 50 "http://localhost:8000/hello?name=Mint"
- npx autocannon -d 10 -c 50 "http://localhost:3000/hello?name=Mint"
## Targets
- p95 < 20ms locally for /hello on both services
