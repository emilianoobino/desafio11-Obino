import passport from 'passport';

const authMiddleware = (excludedRoutes = []) => (req, res, next) => {
    if (excludedRoutes.includes(req.path)) {
        return next();
    }

    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.user = null;
           
        } else {
            req.user = user;
        }
        next();
    })(req, res, next);
};

export default authMiddleware;

