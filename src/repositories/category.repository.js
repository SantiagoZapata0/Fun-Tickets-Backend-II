import { categoryDao } from "../dao/category.dao.js";

class CategoryRepository{
    async getAllCategories(){
        return await categoryDao.getCategories()
    }

    async getOneCategory(category){
        return await categoryDao.getCategory(category)
    }

    async getCategoryById(category){
        return await categoryDao.getCatById(category)
    }

    async createOneCategory(category){
        return await categoryDao.createCategory(category)
    }

}

export const categoryRepository = new CategoryRepository();