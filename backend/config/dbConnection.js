import mssql from "mssql"
import dotenv from "dotenv"

dotenv.config({ path: './backend/.env' }); // loads in env variables - to be used via the process object

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT) || 1433,
    options: {
        encrypt: true, // Use encryption
        trustServerCertificate: true, // 🚨 Security Risk: Should not be used in production unless you fully trust the server (instead set up a proper SSL certificate)
    },
}

export let pool;

/**
 * @returns pool - a connection to the database
 */
export async function connectToDatabase() {
    try {
      if (!pool) { // pool has never been initialized
        pool = await mssql.connect(dbConfig);  // Initialize the pool connection
        console.log(`Initialized new database: ${pool.config.database}`);
      }
      console.log(`Connected to the database: ${pool.config.database}`);
      const result = await pool.request().query(
        "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'"
      );
    
      console.log(result.recordset); // will print names of all tables in the database
      return pool;
    } catch (err) {
      console.error(`Database connection failed: ${err}`);
      throw err;
    }
  }

//   # Use the official Node.js image
// FROM node:16

// # Set the working directory inside the container
// WORKDIR /workspace/ConRoom

// # # Ensure the 'node' user has permissions on the work directory
// # RUN chown -R node:node /workspace/ConRoom

// # Switch to the non-root 'node' user
// USER root

// # Copy package.json and package-lock.json into the container from the root of the project
// COPY ../package.json ../package-lock.json ./

// # Install dependencies inside the container
// RUN npm install

// # Copy the rest of the project files into the container
// COPY ../ ./

// # Set the command to run the app
// CMD ["npm", "run", "devStart"]
