import {CategoryItem} from "../types/CategoryItem";
import {createContext, ReactNode, useEffect, useState} from "react";
import axios from "axios";


interface CategoryContextProps {
    children: ReactNode;
}

const CategoryContext = createContext<CategoryItem[]>([]);

function CategoryContextProvider({ children }: CategoryContextProps) {
    const [categories, setCategories] = useState<CategoryItem[]>([]);

    useEffect(() => {
        axios.get<CategoryItem[]>('/category/get-all-categories')
            .then((result) => {
                setCategories(result.data);
            })
            .catch((error) => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    return (
        <CategoryContext.Provider value={categories}>
            {children}
        </CategoryContext.Provider>
    );
}

export { CategoryContext, CategoryContextProvider };
