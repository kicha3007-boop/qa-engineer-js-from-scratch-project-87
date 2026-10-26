install:
	npm ci

gendiff:
	node bin/gendiff.js -h

test:
	npm test

test-coverage:
	npm run test:coverage

lint:
	npm run lint

lint-fix:
	npm run lint:fix

.PHONY: install gendiff test test-coverage lint lint-fix
