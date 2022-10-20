start:
	make -C client start && make -C server start

backend:
	bash -c "npm run start-backend"

frontend:
	bash -c "npm run start-frontend"

lint:
	npm run lint

test:
	npm run test
