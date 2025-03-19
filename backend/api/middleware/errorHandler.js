import { httpStatusCodes } from "../../../constants/constants.js"

const errorHandler = (err, req, res, next) => { // could include "next" but in this case will only be used when an error is thrown and execution stopped.
    const statusCode = res.statusCode ? res.statusCode: 500;
    switch(statusCode){
        case httpStatusCodes.VALIDATION_ERROR:
            res.json({
                title: "Validation Failed",
                message: err.message,
                stackTrace: err.stack
            })
            break;

        case httpStatusCodes.UNAUTHORIZED:
            res.json({
                title: "Unauthorized",
                message: err.message,
                stackTrace: err.stack
            })
            break;

        case httpStatusCodes.FORBIDDEN:
            res.json({
                title: "Forbidden",
                message: err.message,
                stackTrace: err.stack
            })
            break;
            
        case httpStatusCodes.NOT_FOUND:
            res.json({
                title: "Not Found",
                message: err.message,
                stackTrace: err.stack
            })
            break;

            case httpStatusCodes.REQUEST_CONFLICT:
                res.json({
                    title: "Request Conflict",
                    message: err.message,
                    stackTrace: err.stack
                })
                break;

        case httpStatusCodes.SERVER_ERROR:
            res.json({
                title: "Server Error",
                message: err.message,
                stackTrace: err.stack
            })
            break;

        default:
            console.log(`Error Undetermined: \n${err.message}\n ${err.stack}`)
            break;


        
    }
};

export default errorHandler