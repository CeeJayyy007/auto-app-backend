# Node.js Server starter template

Bootstrap api template

## Getting started

```sh
# Clone the project
git clone https://github.com/CeeJayyy007/auto-app-backend.git
cd auto-app-backend

# Install dependencies
npm install

```

Set Environment Variables

```sh
cp .env.example .env
```

Then you can start the application:

```sh
npm run dev
```

or with Docker

```sh
docker-compose -f docker-compose.dev.yml up --build
```

To create a Module, run:

```sh
./create-module.sh <name-of-module>
```

This will launch the server [node](https://nodejs.org/en/) process on port 9093

Linting is set up using [ESlint](https://github.com/eslint/eslint/). It uses the
rules as specificed in the .eslintrc.js file which can be found in the root
directory.

Begin linting with the following command:

```sh
npm run lint
```
