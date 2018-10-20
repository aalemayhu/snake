ELECTRON_DIR ?=$(shell pwd)/electron
ELECTRON_GAME_DIR ?=${ELECTRON_DIR}/src
GAME_DIST_DIR ?=$(shell pwd)/dist

run: build copy_game
	# Temporary location for our example scripts
	mkdir -pv /tmp/Snake-Scripts/
	cp -r src/Scripts/* /tmp/Snake-Scripts/
	npm run start --prefix ${ELECTRON_DIR}

copy_game:
	cp  ${GAME_DIST_DIR}/*.js ${ELECTRON_GAME_DIR}/
	cp -r ${GAME_DIST_DIR}/assets ${ELECTRON_GAME_DIR}/assets

install_deps:
	npm install
install_build_deps:
	npm install -D
start:
	npm start
build: # TODO: game build should ignore electron
	npm run build
lint:
	npm run lint
lint-fix:
	npm run lint:fix

test:
	npm run test

CI:
	make install_build_deps
	make test
	make build
