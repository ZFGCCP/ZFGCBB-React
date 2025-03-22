# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change.

Please note we have a code of conduct, please follow it in all your interactions with the project.

TBD. We could use some help writing this out.

## Table of Contents

- [Contributing](#contributing)
  - [Table of Contents](#table-of-contents)
  - [Development](#development)
    - [Provided package.json scripts](#provided-packagejson-scripts)
      - [Setting up the project](#setting-up-the-project)
        - [Configuring .env.local file](#configuring-envlocal-file)
  - [Pull Request Process](#pull-request-process)

## Development

### Provided package.json scripts

- `yarn dev`: Starts the development server
- `yarn build`: Builds the application for production
- `yarn check`: Runs type checking, linting, and formatting checks
- `yarn format`: Formats the code using Prettier
- `yarn preview`: Runs the application in the production mode
<!-- - `yarn preview:ssr`: Runs the application in the production mode with server-side rendering
- `yarn start`: Runs the application in production mode with server-side rendering -->

#### Setting up the project

1. Clone the repository

   ```bash
   git clone https://github.com/ZFGC-BB/ZFGCBB-React.git
   ```

2. Configure the project

   ```bash
   corepack enable
   ```

3. Install the dependencies

   ```bash
   yarn install
   ```

4. Start the development server

   ```bash
   yarn dev
   ```

5. Open your browser and navigate to <http://localhost:3000>.

##### Configuring [.env.local](./.env.local) file

The default value is pointing to your local machine. While we do have dockerfiles for the backend, we haven't gotten around to streamlining using the backend in a development setting for the frontend. Setting the .env.local value to `http://zfgc.com:28080/zfgbb` will allow you to run the frontend against the production backend.

## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a
   build.
