
isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        next()
    }
    else {
        res.status(401).json({status: 401, message: 'Unauthorized'})
        next('route')}
}

module.exports = isAuthenticated