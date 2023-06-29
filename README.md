# NC News API

[![Deployed API](https://img.shields.io/badge/API-Hosted-brightgreen)](https://nc-news-kwsf.onrender.com/api)

The NC News API is a backend server application that provides access to various endpoints for retrieving and manipulating data related to articles, topics, comments, and users. It serves as the backend for a news aggregation and discussion website similar to Reddit. The API allows users to perform operations such as fetching articles, posting comments, voting on articles and comments, and more.

## Table of Contents

- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the App](#running-the-app)
- [Environment Variables](#environment-variables)
- [Dependencies](#dependencies)
- [API Documentation](#api-documentation)
- [Minimum Requirements](#minimum-requirements)

## Installation

To clone and set up the project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/JackCollier/nc-news-api.git
   ```

2. Navigate to the project directory:

   ```base
   cd nc-news-api
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

## Database Setup

This project uses a PostgreSQL database. To seed the local database with sample data, follow these steps:

Create a .env.development file in the project root with the following content:

    PGDATABASE=nc_news

Run the following command to set up the local database and seed it with data:

```bash
npm run setup-dbs
```

## Running the App

To start the server and run the app locally, execute the following command:

```bash
npm start
```

## Environment Variables

The project requires two .env files for configuration: .env.development and .env.test . You can create these files in the project root and provide the necessary environment variables. Example content for .env.development:

    DB_NAME=nc_news_dev

Example content for .env.test:

    DB_NAME=nc_news_test

## Dependencies

This project uses the following main dependencies:

    dotenv: ^16.3.1
    express: ^4.18.2
    fs.promises: ^0.1.2
    jest-sorted: ^1.0.14
    pg: ^8.7.3
    pg-format: ^1.0.4
    supertest: ^6.3.3

For a complete list of dependencies, please refer to the package.json file.
API Documentation

Please refer to the [Deployed API](https://nc-news-kwsf.onrender.com/api) for detailed information about the available endpoints and request/response formats.

## Minimum Requirements

To run the project, make sure you have the following minimum versions of Node.js and PostgreSQL:

    Node.js: v12.0.0 or above
    Postgres: v9.6 or above
