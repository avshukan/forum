env:
	cp -n .env.example .env || true

start:
	docker-compose up --build -d

backend:
	bash -c "npm run start-backend"

frontend:
	bash -c "npm run start-frontend"

lint:
	npm run lint

test:
	npm run test
