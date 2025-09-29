import React, { useContext, useState } from 'react';
import { CategoryContext } from "../context/CategoryContext";
import { CategoryItem } from "../types/CategoryItem";
import { BiPencil } from 'react-icons/bi'; // Pencil Icon
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai'; // Check and X Icons
import '../../Assets/css/CategoriesPage.css';

const CategoriesPage: React.FC = () => {
    const categories = useContext<CategoryItem[]>(CategoryContext);

    const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
    const [editCategoryName, setEditCategoryName] = useState<string>('');
    const [editCategoryDescription, setEditCategoryDescription] = useState<string>('');

    const startEdit = (category: CategoryItem) => {
        setEditCategoryId(category.id);
        setEditCategoryName(category.name);
        setEditCategoryDescription(category.description);
    };

    const saveCategory = (id: string) => {
        cancelEdit();
    };

    const cancelEdit = () => {
        setEditCategoryId(null);
        setEditCategoryName('');
        setEditCategoryDescription('');
    };

    return (
        <div className="categories-container">
            <div className="categories-wrapper">
                <h2 className="categories-title">Existing Categories</h2>
                <div className="categories-list">
                    {categories.map(category => (
                        <div key={category.id} className="category-card">
                            {editCategoryId === category.id ? (
                                <div className="edit-form">
                                    <input
                                        type="text"
                                        className="edit-input"
                                        value={editCategoryName}
                                        onChange={(e) => setEditCategoryName(e.target.value)}
                                        placeholder="Edit category name"
                                    />
                                    <textarea
                                        className="edit-textarea"
                                        value={editCategoryDescription}
                                        onChange={(e) => setEditCategoryDescription(e.target.value)}
                                        placeholder="Edit category description"
                                        rows={3}
                                    />
                                    <div className="button-group">
                                        <button
                                            className="save-button"
                                            onClick={() => saveCategory(category.id)}
                                        >
                                            <AiOutlineCheck size={18} />
                                            Save
                                        </button>
                                        <button
                                            className="cancel-button"
                                            onClick={cancelEdit}
                                        >
                                            <AiOutlineClose size={18} />
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="category-header">
                                        <h3 className="category-title">{category.name}</h3>
                                        <button
                                            className="edit-button"
                                            onClick={() => startEdit(category)}
                                        >
                                            <BiPencil size={18} />
                                        </button>
                                    </div>
                                    <p className="category-description">{category.description}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoriesPage;
