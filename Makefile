install_deps:
	npm install .
install_build_deps:
	npm install -g rimraf webpack webpack-cli
start:
	npm start
build:
	npm run build
lint:
	npm run lint
lint-fix:
	npm run lint:fix
