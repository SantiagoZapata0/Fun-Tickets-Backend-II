import passport from "passport";

export function passportError(strategy) {
    return (req, res, next) => {
        passport.authenticate(strategy, { session: false }, (err, user) => {
            if (err) {
                return res.status(err.status || 500).json({ status: "Failed", payload: err.message });
            }
            if (!user) {
                return res.status(401).json({ status: "Failed", payload: "No autorizado" });
            }
            req.user = user;
            next();
        })(req, res, next);
    };
}