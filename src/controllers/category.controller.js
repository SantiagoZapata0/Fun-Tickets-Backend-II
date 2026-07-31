import { getCategories, createCategory } from "../services/category.service.js";

export async function getAllCategories(req, res) {
    try {
        const categories = await getCategories();
        return res.status(200).json({status: "Success", payload: categories});
    } catch (err) {
        return res.status(err.status || 500).json({status: "Failed", message: err.message});
    }
}


export async function createOneCategory(req, res) {
    try {
        const { name } = req.body;
        const category = await createCategory(name);
        return res.status(200).json({status: "Success", payload: `Categoria ${name} creada.`});
    } catch (err) {
        return res.status(err.status || 500).json({status: "Failed", message: err.message});
    }
}