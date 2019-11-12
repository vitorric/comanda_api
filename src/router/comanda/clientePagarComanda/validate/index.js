module.exports = (req, res, next) => {
    try {
        next();

    } catch (error) {
        console.log(error);
    }
};