import mssql from "mssql"
import dotenv from "dotenv"
import { DatabaseConnectionError } from "../../errors/ConnectionError.js";

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

let conn;

/**
 * @returns {Promise<mssql.ConnectionPool>} a connection to the database (for performing database operations).
 */
export async function connectToDatabase() {
    try {
      if (!conn) { // pool has never been initialized
        conn = await mssql.connect(dbConfig);  // Initialize the pool connection
        if (!(conn instanceof mssql.ConnectionPool)){
          console.log(conn)
          throw new DatabaseConnectionError("The connection was not made")
        }
      }
      
      // console.log(`Connected to the database: ${pool.connected}`); // 🚨 🚨 🚨
      return conn;
    } catch (err) {
      console.error({ message: err.message, stack: err.stack });
      throw new DatabaseConnectionError(`Database connection failed: ${err}`);
    }
  }

  /* REMEMBER IT IS OK TO THROW ERRORS BUT THEY MUST EVENTUALLY BE CAUGHT IN PRODUCTION RUNNING CODE */

// Key Changes for Deployment:
    // Always Encrypted: Enable for sensitive data.
    // Connection Retry Count: Increase to handle temporary failures in cloud environments.
    // Max Pool Size: Increase based on expected production traffic.
    // Min Pool Size: Set to ensure a minimum number of available connections.
    // Load Balance Timeout: Set in a multi-node setup for better balancing.
    
// Summary for Production:
    // Ensure Always Encrypted is enabled if needed for security compliance.
    // Increase Max Pool Size and set an appropriate Min Pool Size to handle more connections.
    // Adjust Connection Timeout, Retry Count, and Retry Interval based on the stability of your production environment.
    // In a multi-node setup, configure Load Balance Timeout to ensure smoother failover and load balancing.
    // Once deployed, these settings help ensure that your application can handle higher traffic, has better resilience to network issues, and complies with necessary security standards.