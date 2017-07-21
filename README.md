[![Build Status](https://travis-ci.org/andela-foladipo/docs-cabinet-cp2.svg?branch=develop)](https://travis-ci.org/andela-foladipo/docs-cabinet-cp2)
[![Code Climate](https://codeclimate.com/github/andela-foladipo/docs-cabinet-cp2//badges/gpa.svg)](https://codeclimate.com/github/andela-foladipo/docs-cabinet-cp2/)
[![Coverage Status](https://coveralls.io/repos/github/andela-foladipo/docs-cabinet-cp2/badge.svg?branch=develop)](https://coveralls.io/github/andela-foladipo/docs-cabinet-cp2?branch=develop)


# Welcome to Docs Cabinet
Docs Cabinet is a cool place to create and save your documents. It's
 stable, intuitive and, best of all, FREE! It was also built using
 modern tech stacks like PostgreSQL, Node, React etc.

## Table of Contents

  1. [Our Tech Stack](#our-tech-stack)
  1. [Installation and Setup](#installation-and-setup)
  1. [Limitations](#limitations)
  1. [Contributing](#contributing)
  1. [Licence](#license)

## Our Tech Stack

This project was built using modern technology tools. These include:
- [React](https://facebook.github.io/react/), for the front end code.
- [Materialize CSS](materializecss.com/), a CSS framework that implements
 Google's Material Design philosophy.
- [React Materialize](https://react-materialize.github.io/#/), a library of
 reusable, Material-design-themed React Components.
- [PostgreSQL](https://www.postgresql.org/), an open source database.
- [Sequelize](docs.sequelizejs.com/), a promise-based O.R.M for Node.js v4 and up. It supports
 PostgreSQL, MySQL, SQLite and MSSQL.
- [Scss](https://sass-lang.com), for writing custom styles.
- Swagger, to document the app's RESTful endpoints.

## Installation and setup

Here are the steps you need to follow to run this project on your computer:
- **Install NodeJS**: You may visit [this link](https://nodejs.org/en/download/) for complete 
instructions on installing NodeJS on your computer.

- **Install PostgreSQL**: You may visit [this link](http://postgresguide.com/setup/install.html) for 
instructions on setting up PostgreSQL on your computer. When you're done, please note your 
database name, username and password.

- **Open a terminal/command prompt** on your computer and `cd` into your preferred path/location.

- **Clone this repo**: Enter this command in the terminal:

```bash
git clone https://github.com/andela-foladipo/docs-cabinet-cp2.git
```

- **Install dependencies**: Do so by running the following command:

```bash
npm install
```

Note: `npm` is a component of NodeJS that serves as its package manager. So, it comes along with
 installing NodeJS.

- **Add the required environment variables**: Consult the `.env.sample` file in the root of this
 repository for info about the different environmental variables you need to specify for this app. When
 you're done, save your changes in a `.env` file in the root of the repo. (Note that you might not have
 some of this info until later in this installation steps. So it's fine to leave those for now.)

- **Initialize the DB**: Run the following commands:
```bash
npm run db:migrate

npm run db:seed
```

These will create the required tables in the database and seed some of them.

- **Add an admin user**: You'll need to manually create an admin user because we don't seed such a
 user for security reasons. To do this, you can use this command as a guide:

```bash
psql -c "INSERT INTO public.\"User\" \
    (\"id\",\"firstName\",\"lastName\",\"username\",\"password\",\"roleId\",\"createdAt\",\"updatedAt\") \
    VALUES (DEFAULT,'<ADMIN_FIRST_NAME>','<ADMIN_LAST_NAME>','<ADMIN_EMAIL>','<HASHED_ADMIN_PASSWORD>',0,'2017-06-14 17:01:40.739 +00:00','2017-06-14 17:01:40.739 +00:00')" -d <DATABASE_NAME>
```
Replace <DATABASE_NAME> with the name of your database. Then please replace <ADMIN\_FIRST\_NAME> and
 <ADMIN\_LAST\_NAME> with your desired names. Use a valid email instead of <ADMIN\_EMAIL>. Finally
 install [bcryptjs](https://www.npmjs.com/package/bcryptjs) generate a hashed password using
 `hashSync(PASSWORD, 10)` and use that to replace <HASHED\_ADMIN\_PASSWORD>. (Your PASSWORD must
 contain one upper case letter, one lower case letter, one number and one symbol (like $, *, @ etc).)
 Note that the hashed string that `bcryptjs` will generate will contain `$` (dollar) symbols. Make
 sure you escape all of them. That is, replace all those `$` symbols with `\$`. Finally, don't forget
 to add the credentials of this account to your `.env` file.

- That's it! You may now run `npm start` and the app will run on your system. 

## Limitations

- You can't upload digital documents.

## Contributing

You can send us your bug reports, suggestions feedback etc by tweeting at
 the [Lead Developer], [Folusho Oladipo](https://twitter.com/folushooladipo).


## License

This project is authored by [Folusho Oladipo](https://google.com/search?q=Folusho+Oladipo) and is licensed 
for your use, modification and distribution under [the MIT license](https://en.wikipedia.org/wiki/MIT_License). 
Feel free to hack, extend and share it!

See you around!
