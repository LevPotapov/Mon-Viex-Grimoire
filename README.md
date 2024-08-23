# Mon Vieux Grimoire

A book rating site. The site is called "Mon Vieux Grimoire", and allows members to add a new book and put a note visible to the public.

## Instructions for running on a local server

1. Clone this repository.

2. Create a **".env"** file in the **"backend"** folder.

3. Inside the created **".env"** file, write two variables, as in the example below, replacing **"YOUR_PASSWORD"** and **"YOUR_KEY"** with your personal password for generating JWT tokens and your mongoDB key for connecting to the database.

```
JWT_PASSWORD=YOUR_PASSWORD
MONGODB_KEY=YOUR_KEY
```

4. In the terminal, go from the root folder of the project to the **"backend"** folder and install the dependencies by writing:

```
npm install
```

5. After installing the dependencies, start the server - using the command:

```
npm start
```

6. In the terminal, go to the **"frontend"** folder and write:

```
npm install
npm start
```

7. Success!
