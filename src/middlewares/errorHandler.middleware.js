const errorHandler = (error, req, res,next) => {

    console.log('Error :: ' , req.body);
    console.log('Error :: ' , error);

    let statusCode = error.statusCode || 500;
    let message = error.message || 'Internal server error';

    return res.status(statusCode).json({
        message,
        success: false,
        errors: error.errors || []
    })

}


export default errorHandler;