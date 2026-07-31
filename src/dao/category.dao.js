import { Common } from "./common.dao.js";
import { categoryModel } from "../models/category.model.js"

class CategoryDao extends Common{
    constructor(){
        super(categoryModel)
    }

    async getCategories(){
        try{
            const result = await this.model.find();
            return result
        } catch(error){
            throw error
        }
    }

    async getCategory(category){
        try{
            const result = await this.model.findOne({name: category});
            return result
        } catch(error){
            throw error
        }
    }

    async getCatById(categoryId){
        try{
            const result = await this.model.findById(categoryId);
            return result
        } catch(error){
            throw error
        }
    }

    async createCategory(category){
        try{
            const result = await this.model.create({name: category})
            return result
        } catch(error){
            throw error
        }
    }
}

export const categoryDao = new CategoryDao();