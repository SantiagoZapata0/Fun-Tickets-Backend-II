import { Common } from "./common.dao.js";
import { userModel } from "../models/user.model.js";

export class UserDao extends Common{
    constructor(){
        super(userModel)
    }

    async createUser(userData){
        try{
            const result = await this.model.create(userData)
            return result
        } catch(err){
            throw err
        }
    }

    async getUserByEmail(email){
        try{
            const result = await this.model.findOne({email}).select("+password");
            return result
        } catch(err){
            throw err
        }
    }
}

export const userDao = new UserDao;