build:
	tsc
	cp README.md dist/

rc: build
	npx ts-node ./scripts/pkg.rc.ts