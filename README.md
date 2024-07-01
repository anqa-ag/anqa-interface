# Anqa - Aptos Aggregator Interface

Welcome to Anqa, the Aptos Aggregator Interface.

## Table of Contents

- [Development](#development)
- [Running with Docker](#running-with-docker)

## Development

To start the development, use the following command:

```bash
yarn dev
```

This will start the interface in development mode, allowing you to make changes and see the results immediately.

## Running with Docker

To build and run the application using Docker, follow these steps:

1. **Build the Docker image:**

   ```bash
   docker build -t anqa-interface:latest -f ./Dockerfile .
   ```

2. **Run the Docker container:**

   ```bash
   docker run -dp 5173:80 anqa-interface
   ```

This will start the application in a Docker container, mapping port 5173 on your host to port 80 in the container.
