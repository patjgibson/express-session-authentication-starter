module.exports.isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).json({msg: 'You are not authorized to view this resource.'});
    }
}

module.exports.isAdmin = (req, res, next) => {
    if (req.user && req.isAuthenticated() && req.user.rows[0].admin == 1) {
        console.log("Is admin: " + req.user.rows[0].admin);
        next();
    } else {
        res.status(401).json({msg: 'You are not authorized to view this resource because you are not an admin.'});
    }
}