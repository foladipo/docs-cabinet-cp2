[![license](https://img.shields.io/github/license/mashape/apistatus.svg)]()
[![Build Status](https://travis-ci.org/andela-foladipo/docs-cabinet-cp2.svg?branch=develop)](https://travis-ci.org/andela-foladipo/docs-cabinet-cp2)
[![Code Climate](https://codeclimate.com/github/andela-foladipo/docs-cabinet-cp2//badges/gpa.svg)](https://codeclimate.com/github/andela-foladipo/docs-cabinet-cp2/)
[![Coverage Status](https://coveralls.io/repos/github/andela-foladipo/docs-cabinet-cp2/badge.svg?branch=develop)](https://coveralls.io/github/andela-foladipo/docs-cabinet-cp2?branch=develop)


# Welcome to Docs Cabinet
Docs Cabinet is a cool web app that enables you to create and save your
 documents. It's stable, intuitive and, best of all, **FREE**! It was also
 built using modern tech stacks like
 [PostgreSQL](https://www.postgresql.org/),
 [Node](https://nodejs.org/en/),
 [React](https://facebook.github.io/react/)
 etc. One of these tools,
 [CKEditor](http://ckeditor.com/),
 enables you to create well-laid out documents
 complete with **bold**/_italicized_ text, pictures and much more. You
 can also control access to your document. That is, you can make them
 public, private or accessible only to other users with the same
 role/account type as yours (e.g other admins).

Docs Cabinet also has search features that enable you to easily search
 for documents or other users.

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
- [CKEditor](http://ckeditor.com/), an awesome, free, open source HTML
 text editor designed to simplify website content creation. In this app,
 it enables you to create rich, multi-format documents online.
- [PostgreSQL](https://www.postgresql.org/), an open source database.
- [Sequelize](docs.sequelizejs.com/), a promise-based O.R.M for Node.js v4
 and up. It supports PostgreSQL, MySQL, SQLite and MSSQL.
- [Scss](https://sass-lang.com), for writing custom styles.
- [Swagger](https://swagger.io/), to document the app's RESTful endpoints.

## Installation and setup

Here are the steps you need to follow to run this project on your computer:
- **Install NodeJS**: You may visit [this link](https://nodejs.org/en/download/)
 for complete instructions on installing NodeJS on your computer.

- **Install PostgreSQL**: You may visit
 [this link](http://postgresguide.com/setup/install.html)
 for instructions on setting up PostgreSQL on your computer. When you're
 done, please note your database name, username and password.

- **Open a terminal/command prompt** on your computer and `cd` into your
 preferred path/location.

- **Clone this repo**: Enter this command in the terminal:

```bash
git clone https://github.com/andela-foladipo/docs-cabinet-cp2.git
```

- **Install dependencies**: Do so by running the following command:

```bash
npm install
```

Note: `npm` is a component of NodeJS that serves as its package manager.
 So, it comes along with installing NodeJS.

- **Add the required environment variables**: Consult the `.env.sample`
 file in the root of this repository for info about the different
 environmental variables you need to specify for this app. When
 you're done, save your changes in a `.env` file in the root of
 the repo. (Note that you might not have some of this info until
 later in this installation steps. So it's fine to leave those for now.)

- **Initialize the DB**: Run the following commands:
```bash
npm run db:migrate

npm run db:seed:all
```

These will create the required tables in the database and seed some of them.

- **Add an admin user**: You'll need to manually create an admin user because
 we don't seed such a user for security reasons. To do this, you can use this
 [document](https://github.com/andela-foladipo/docs-cabinet-cp2/wiki/How-to-add-an-admin-user)
 as a guide.

- That's it! You may now run `npm start` and the app will run on your
 system. Visit `localhost:PORT` to browse it.

## Limitations

- You can't upload digital documents (like PDFs).
- You can't share links to documents. Other users can only search for
 your public documents, or access them if they have the same role/account
 type as you.
- You can't change your profile picture (yet).
- There is no automated password reset system. If you forget your password,
 you have to contact an admin and ask him/her to reset it for you.
- This project doesn't use a realtime database (like Firebase DB). So, you
 have to refresh the page sometimes to get the latest documents or changes.

## Contributing

Found a bug? You can send us a bug report by creating a new issue at
 [this link](https://github.com/andela-foladipo/docs-cabinet-cp2/issues). If
  you would rather fix the bug(s) than simply tell us about it, please consult
 [this document](https://help.github.com/articles/fork-a-repo/) for
 instructions on how to create a fork of this project, implement your
 solutions and submit a pull request.
 
Similarly, if you want to help add a new feature, please use
 [this document](https://help.github.com/articles/fork-a-repo/) as a guide
 on how to fork this repo, add your feature(s) and submit a pull request.
 
Lastly, you can send your
 suggestions, feedback etc by tweeting at the
 [Lead Developer](https://google.com/search?q=folusho+oladipo),
 [Folusho Oladipo](https://twitter.com/folushooladipo).

## License

This project is authored by [Folusho Oladipo](https://google.com/search?q=Folusho+Oladipo)
  and is licensed for your use, modification and distribution under
  [the MIT license](https://en.wikipedia.org/wiki/MIT_License). Feel
  free to hack, extend and share it!

Happy hacking, and see you around!
