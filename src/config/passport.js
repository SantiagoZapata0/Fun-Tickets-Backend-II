import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy } from "passport-jwt";
import { loginUser, registerUser } from "../services/user.service.js";
import { env } from "./env.js";

// ! Configs.

const registerConfig = {
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true, 
    session: false
}

const loginConfig = {
    usernameField: "email",
    passwordField: "password",
    session: false
}

function cookieExtractor(req){
    return req.cookies?.currentUser || null
}

const jwtConfig = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: env.JWT_SECRET
}

// ! Callbacks

async function registerCallback(req, email, password, done){
    try{
        const { first_name, last_name } = req.body;
        const user = await registerUser({first_name, last_name, email, password});
        return done(null, user);
    } catch(err){
        return done(err, false);
    }
}

async function loginCallback(email, password, done){
    try{
        const user = await loginUser({email, password});
        return done(null, user);
    } catch(err){
        return done(err, false);
    }
}

async function jwtCallback(jwtPayload, done){
    try{
        return done(null, jwtPayload);
    } catch(err){
        return done(err, false);
    }
}

export function initializePassport(){
    passport.use("register", new LocalStrategy(registerConfig, registerCallback));
    passport.use("login", new LocalStrategy(loginConfig, loginCallback));
    passport.use("jwt", new JwtStrategy(jwtConfig, jwtCallback));
};