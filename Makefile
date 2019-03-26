build:
	yarn test
	tsc
	cp README.md dist/

rc: build
	npx ts-node ./scripts/pkg.rc.ts

publish: build
	npx ts-node ./scripts/pkg.publish.ts