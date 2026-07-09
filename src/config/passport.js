import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

const registerConfig = {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
        session: false
}

function registerCallback(){
    
}

export function initalizePassport(){
    passport.use("register", new LocalStrategy(registerConfig, async (req, username, password, done) => {
        console.log(username, password)
        console.log(req.body)
    }))
}