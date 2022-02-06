# Northcoders News - Back End API

This is the repo for the back end of my Northcoders news app.

Northcoders news is a simple, full-stack, reddit-like news app created during northcoders 13-week web development bootcamp.

- Back end tech:
  - Node.js
  - Express.js
  - postgreSQL
 
- Front end tech:
  - React
  - React-router
  - React-bootstrap
  - HTML/CSS

## Links

  - **Front end:**
    - [Hosted app](https://jovial-brahmagupta-dbf249.netlify.app/)
    - [**Github repo**](https://github.com/adamrleigh/nc-news)

  - Back end:
    - [Hosted api](https://adam-northcoders-news.herokuapp.com/)
    - [Github repo](https://github.com/adamrleigh/Northcoders-News)

## Using the app

### Requirements

- Node v16+
- NPM v8+
- postgreSQL v12+
- Github CLI
- OPTIONAL: jest for testing

### Running the app

If you would like to see the back end in action, simply click the link for the hosted back end api above

Otherwise, if you would like to host and run the app locally:

1. Clone the repo by first navigating to the desired folder within a terminal, then entering:
```
git clone https://github.com/adamrleigh/Northcoders-News
```

2. Install the dependencies for the app by navigating to the root directory of the cloned repo and entering:
```
npm i
```

3. Create two .env files in the root of the clone repo: .env.test and .env.development
```
cp .env-example ./.env.test
cp .env-example ./.env.development
```
4. Replace the 'database_name_here' with the desired name of the database in both of the newly created .env files

5. Create and seed the databases by entering:
```
npm run setup-dbs
npm run seed
```

6. 
OPTIONAL: Check that everything is setup properly by entering:
```
npm t
```
Run the api by entering:
```
npm start
```

7. The port in use will be displayed in the console and can be connected to through your preffered means
