# Chat & Task Management API

## Overview

This project provides a backend API for:

- **User Authentication** (Registration & Login)
- **Task Management** (CRUD Operations with filtering)
- **Chat Import** (Import chat data from excel file)

## Tech Stack

- **Node.js** with **Express.js**
- **TypeScript**
- **Prisma ORM** (for database)
- **mySQL**
- **Multer** (for file uploads)
- **JWT Authentication**
- **XLSX** for handling Excel files
- **JEST** for test cases
- **ZOD** for route validation

---

## Setup Instructions

### Clone the Repository

```sh
git clone https://github.com/aasmiCodez/NodeJs.git
```

### Install Dependencies

```sh
npm install
```

### Set up variables

```sh
DATABASE_URL=
Token generated using => node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET =
```

### Initialize Database

```sh
npx prisma migrate dev --name init
npm prisma generate
```

### Run the Server

```sh
npm run dev
```

---

## API Endpoints

### Authentication

- Register (POST /api/auth/register)
- Login (POST /api/auth/login)

### Task Management

- Get All Tasks (GET /api/tasks)
- Add Tasks (POST /api/tasks)
- Update Task (PUT /api/tasks:id)
- Delete Task (DELETE /api/tasks:id)

### Chat Import

- ## (POST api/chat/import) in the body upload a .xlsx file

## Tools used

- Postman - API Testing
- Prisma - Database ORM
- VS Code - Code Editor
