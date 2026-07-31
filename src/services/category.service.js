import { categoryRepository } from "../repositories/category.repository.js";

export async function getCategories(){
    const categories = await categoryRepository.getAllCategories();
    
    if(categories.length === 0){
        const error = new Error("No se encontraron categorias.");
        error.status = 404;
        throw error
    }

    return categories;
}

export async function createCategory(category){
    
    if(!category){
        const error = new Error("Se requiere insertar una categoria.");
        error.status = 400;
        throw error;
    }

    const existingCategory = await categoryRepository.getOneCategory(category);

    if(existingCategory){
        const error = new Error("La categoria ya existe.");
        error.status = 409;
        throw error;
    }
    
    const createdCategory = await categoryRepository.createOneCategory(category);

    return createCategory;
}