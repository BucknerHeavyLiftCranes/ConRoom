
/**
 * Admin in the system (adhering to Microsoft's profile layout + the refresh token for silent authentication).
 */
export default class Admin {
    constructor(
        /** @type {number}  Admin's unique id*/
        id, 
        /** @type {string} Admin's name*/
        name, 
        /** @type {string} Admin's email*/
        email, 
        /** @type {string} */
        refreshToken) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.refreshToken = refreshToken
        }

        static fromObject({ 
            id, 
            name,
            email, 
            refresh_token, 
            refreshToken }
        ) {
            return new Admin(
                id,
                name,
                email,
                refreshToken ?? refresh_token // handles coming from Outlook (refreshToken) or DB (refresh_token)
            );
        }
        

    fromModel() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            refreshToken: this.refreshToken,
        }
    }

}