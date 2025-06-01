const asyncHandler = (asyncFunc) => {
    return (req, res, next) => {
        Promise.resolve(asyncFunc(req, res, next))
            .then()
            .catch((err) => next(err));
    };
};

const asyncHandler1 = (fn) => async (err, req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        res.status(err.code || 500).json({
            success: false,
            message: err.message,
        });
    }
};

export { asyncHandler };
