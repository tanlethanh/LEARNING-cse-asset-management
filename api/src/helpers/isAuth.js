
isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        next()
    }
    else {
        return res.status(401).json({status: 401, message: 'Unauthorized'})    
    }
}

module.exports = isAuthenticated