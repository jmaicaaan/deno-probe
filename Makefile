.DEFAULT_GOAL := dev

dev:
	deno run --allow-net --config tsconfig.json --watch src/app.ts

start:
	deno run --allow-net --config tsconfig.json src/app.ts