# Test docker local

```sh
docker build -t anqa-interface:latest -f ./Dockerfile .
docker run -dp 5173:80 anqa-interface
```
