.PHONY: build
build:
	cd agewasm && env GOOS=js GOARCH=wasm go build -o main.wasm .
	cp agewasm/main.wasm frontend/public/assets/main.wasm