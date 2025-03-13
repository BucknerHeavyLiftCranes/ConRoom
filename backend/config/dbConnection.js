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

let pool;

/**
 * @returns pool - a connection to the database (used for perform database operations).
 */
export async function connectToDatabase() {
  // console.log(dbConfig)
    try {
      if (!pool) { // pool has never been initialized
        pool = await mssql.connect(dbConfig);  // Initialize the pool connection
        console.log(`Initialized new database connection: ${pool.config.database}`);
      }
      console.log(`Connected to the database: ${pool.config.database}`);
      // const result = await pool.request().query(
      //   "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'"
      // );
    
      // console.log(result.recordset); // will print names of all tables in the database
      return pool;
    } catch (err) {
      console.error(`Database connection failed: ${err}`);
      throw err;
    }
  }

  // export async function connectToDatabase() {
  //   // console.log(dbConfig)
  //   if (!pool) { // pool has never been initialized
  //     try {
  //       pool = await mssql.connect(dbConfig);  // Initialize the pool connection
  //       console.log(`Initialized new database: ${pool.config.database}`);
  //     } catch (err) {
  //       console.error(`Database connection failed: ${err}`);
  //       throw err;
  //     }
  //   }else{
  //     console.log(`Connected to the database: ${pool.config.database}`);
  //   }
  //   return pool
  // }

  /* Attempted TypeScript Version */
  // // import * as mssql from "mssql"
  // import dotenv from "dotenv"
  // import { config, ConnectionPool } from "../../types/mssql.ts";
  // // import pool from "../../types/mssql";
  // // import { config } from "mssql";
  // // import { ConnectionPool } from "mssql";
  
  // // sqlpool.connect()
  // // pool.connect()
  
  // dotenv.config({ path: './backend/.env' }); // loads in env variables - to be used via the process object
  
  // const dbConfig:config = {
  //     user: process.env.DB_USER,
  //     password: process.env.DB_PASSWORD,
  //     server: process.env.DB_SERVER!,
  //     database: process.env.DB_NAME,
  //     port: parseInt(process.env.DB_PORT!),// || 1433,
  //     options: {
  //         encrypt: true, // Use encryption
  //         trustServerCertificate: true, // 🚨 Security Risk: Should not be used in production unless you fully trust the server (instead set up a proper SSL certificate)
  //     },
  // }
  
  // let pool: ConnectionPool;
  
  // /**
  //  * @returns pool - a connection to the database (used for perform database operations).
  //  */
  // export async function connectToDatabase() {
  //   // console.log(dbConfig)
  //     try {
  //       if (!pool) { // pool has never been initialized
  //         pool = await new ConnectionPool(dbConfig).connect();  // Initialize the pool connection
  //         console.log(`Initialized new database connection: ${pool.connected}`);//config.database}`);
  //       }
  //       console.log(`Connected to the database: ${pool.connected}`);//config.database}`);
  //       // const result = await pool.request().query(
  //       //   "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'"
  //       // );
      
  //       // console.log(result.recordset); // will print names of all tables in the database
  //       return pool;
  //     } catch (err) {
  //       console.error(`Database connection failed: ${err}`);
  //       throw err;
  //     }
  //   }