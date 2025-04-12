import mssql from "mssql"
import { connectToDatabase } from "../config/dbConnection.js"
import DB_COMMANDS  from "../../constants/dbCommands.js"
import  Admin  from "../api/model/Admin.js"
import { 
        GetAdminError, 
        CreateAdminError, 
        DuplicateAdminError, 
        UpdateAdminError, 
        DeleteAdminError, 
        AdminValidationError
    } from "../../errors/AdminError.js"
import { DatabaseConnectionError } from "../../errors/ConnectionError.js"

/**@type {mssql.ConnectionPool} */
let pool

try{
    if (!pool){
        pool = await connectToDatabase()
    }
}catch (err) {
    console.error({ message: err.message, stack: err.stack });
    throw new DatabaseConnectionError("Failed to connect to database")
}


/**
 * Fetch all admins from the database.
 * @returns {Promise<Admin[]>} an array of all admins in the database.
 */
export const getAllAdmins = async () => { 
    try {
        const result = await pool.request().query(DB_COMMANDS.getAllAdmins);
        const allAdminsData = result.recordset;
        /** @type {Admin[]} all admins in the database*/
        const allAdmins = allAdminsData.map((admin) => Admin.fromObject(admin));

        return allAdmins
      } catch (err) {
          console.error({ message: err.message, stack: err.stack });
          throw new GetAdminError(`Failed to retrieve admins`);
      }
 };

 
/**
 * Fetch a specific admin from the database by its unique id.
 * @param {string} id unique id of the admin.
 * @returns {Promise<Admin | undefined>} an admin in the database.
 */
 export const getAdminById = async (id) => { 
    try {
        const result = await pool.request()
        .input('id', mssql.VarChar(255), id)
        .query(DB_COMMANDS.getAdminById);

        const adminData = result.recordset?.[0];

        if (adminData){
            return Admin.fromObject(adminData) // convert each database record to an Admin object
        }else{
            return undefined
        }
      } catch (err) {
          console.error({ message: err.message, stack: err.stack });
          throw new GetAdminError(`Failed to retrieve admin`);
      }
 };


/**
 * Fetch a specific admin from the database by its email.
 * @param {string} email unique email of the admin.
 * @returns {Promise<Admin | undefined>} an admin in the database.
 */
export const getAdminByEmail = async (email) => { 
    try {
        const result = await pool.request()
        .input('email', mssql.VarChar(255), email)
        .query(DB_COMMANDS.getAdminByEmail);

        const adminData = result.recordset?.[0];

        if (adminData){
            return Admin.fromObject(adminData) // convert each database record to an Admin object
        }else{
            return undefined
        }
      } catch (err) {
          console.error({ message: err.message, stack: err.stack });
          throw new GetAdminError(`Failed to retrieve admin`);
      }
 };

/**
 * Fetch a specific admin from the database by its refresh token.
 * @param {string} refreshToken unique refresh token of the admin.
 * @returns {Promise<Admin | undefined>} an admin in the database.
 */
export const getAdminByRefreshToken = async (refreshToken) => { 
    try {
        const result = await pool.request()
        .input('refresh_token', mssql.VarChar(2000), refreshToken)
        .query(DB_COMMANDS.getAdminByRefreshToken);

        const adminData = result.recordset?.[0];

        if (adminData){
            return Admin.fromObject(adminData) // convert a database record to an Admin instance
        }else{
            return undefined
        }
      } catch (err) {
          console.error({ message: err.message, stack: err.stack });
          throw new GetAdminError(`Failed to retrieve admin`);
      }
 };


/**
 * Create a new admin in the database.
 * @param {Admin} adminData the details of the new admin.
 * @returns {promise<Admin>} the newly created admin (converted to an Admin object).
 */
export const createAdmin = async (adminData) => {
    await validateAdmin(adminData)

  
    try{
        const result = await pool.request()
        .input('id', mssql.VarChar(255), adminData.id)
        .input('name', mssql.VarChar(255), adminData.name)
        .input('email', mssql.VarChar(255), adminData.email)
        .input('refresh_token', mssql.VarChar(2000), adminData.refreshToken)
        .query(DB_COMMANDS.createNewAdmin)
        
        const newAdminData = result.recordset?.[0]
        if (!newAdminData){
            throw new GetAdminError("Failed to retrieve new admin data")
        }

        console.log("==================================================================")
        console.log(`Admin created successfully: ${result.rowsAffected} row(s) added.`);
        console.log("==================================================================")


        const newAdmin = Admin.fromObject(newAdminData)

        return newAdmin;
    }catch(err){
        console.error({ message: err.message, stack: err.stack });
        throw new CreateAdminError(`Failed to create new admin`);
    }
};


/**
 * Update admin's refresh token in the database.
 * @param {string} id id of the updated admin.
 * @param {string} newRefreshToken new refresh token for the updated admin.
 * @returns {promise<Admin>} the updated admin (with the new refresh token).
 */
export const updateAdminRefreshToken = async (id, newRefreshToken) => {
    try{
        const adminExists = await getAdminById(id)
    
        if (!adminExists){
            throw new GetAdminError(`This admin doesn't exist`);
        }

        const adminWithNewRefreshTokenAlreadyExists = await getAdminByRefreshToken(newRefreshToken)
    
        if(adminWithNewRefreshTokenAlreadyExists){
            throw DuplicateAdminError("An admin with this refresh token already exists")
        }

        const result = await pool.request()
        .input('id', mssql.VarChar(255), id)
        .input('refresh_token', mssql.VarChar(2000), newRefreshToken) // the REALLY important update
        .query(DB_COMMANDS.updateAdminRefreshToken)
        
        const updatedAdminData = result.recordset?.[0]
        if (!updatedAdminData){
            throw new GetAdminError("Failed to retrieve updated admin data")
        }

        console.log("==================================================================")
        console.log(`Admin refresh token updated successfully: ${result.rowsAffected} row(s) added.`);
        console.log("==================================================================")


        const updatedAdmin = Admin.fromObject(updatedAdminData)

        return updatedAdmin;
    }catch(err){
        console.error({ message: err.message, stack: err.stack });
        throw new UpdateAdminError(`Failed to update admin refresh token`);
    }
};


/**
 * Delete a admin from the database.
 * @param {string} id id of the admin to delete.
 * @returns {Promise<Admin>} the deleted admin.
 */
export const deleteAdmin = async (id) => { 
    try{
        const deletedAdmin = await getAdminById(id)
    
        if (!deletedAdmin){
            throw new GetAdminError(`This admin doesn't exist`);
        }

        const result = await pool.request()
        .input('id', mssql.VarChar(255), id)
        .query(DB_COMMANDS.deleteAdmin)
        
        console.log("==================================================================")
        console.log(`Admin deleted successfully: ${result.rowsAffected} row(s) deleted.`);
        console.log("==================================================================")
    
        return deletedAdmin;
        }catch(err){
        console.error({ message: err.message, stack: err.stack });
        throw new DeleteAdminError(`Failed to delete admin`);
        }
    };


/**
 * Validate an admin before peformating a CRUD operation in the database.
 * @param {Admin} admin admin to be validated
 */
const validateAdmin = async (admin) => {
    try {
        const adminEmailExists = await getAdminByEmail(admin.email)

        // 1. Another admin with this email already exists
        if(adminEmailExists && (adminEmailExists.id != admin.id)){
            throw new DuplicateAdminError("An admin with this email already exists")
        }

        // 2. Another admin with this refresh token already exists
        const adminRefreshTokenExists = await getAdminByRefreshToken(admin.refreshToken)

        if(adminRefreshTokenExists && (adminRefreshTokenExists.id != admin.id)){
            throw new DuplicateAdminError("An admin with this refresh token already exists")
        }
    } catch (err) {
        console.log(console.error({message: err.message, stack: err.stack}))
        throw new AdminValidationError(`Failed to validate admin`)
        
    }
}