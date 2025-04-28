/**
 * Generic admin error (better to throw one of its subclasses).
 */
export class AdminError extends Error {
    constructor(message) {
        super(message)
        this.name = "AdminError"
    }
}

/**
 * Thrown when a Admin object contains invalid data.
 */
export class AdminValidationError extends AdminError{
    constructor(message) {
        super(message)
        this.name = "AdminValidationError"
    }
}

/**
 * Thrown when the database fails to return a admin record.
 */
export class GetAdminError extends AdminError {
    constructor(message) {
        super(message)
        this.name = "GetAdminError"
    }
}

/**
 * Thrown if a new admin fails to be created in the database.
 */
export class CreateAdminError extends AdminError {
    constructor(message) {
        super(message)
        this.name = "CreateAdminError"
    }
}

/**
 * Thrown if a admin fails to be updated in the database.
 */
export class UpdateAdminError extends AdminError {
    constructor(message) {
        super(message)
        this.name = "UpdateAdminError"
    }
}

/**
 * Thrown if a admin fails to be deleted from the database.
 */
export class DeleteAdminError extends AdminError {
    constructor(message) {
        super(message)
        this.name = "DeleteAdminError"
    }
}

/**
 * Thrown if details for a admin fail to be retrieved from the database.
 */
export class AdminDetailsError extends AdminError {
    constructor(message) {
        super(message)
        this.name = "AdminDetailsError"
    }
}

/**
 * Thrown when a user attempts to create a admin that already exists.
 */
export class DuplicateAdminError extends AdminError {
    constructor(message) {
        super(message)
        this.name = "AdminFetchError"
    }
}