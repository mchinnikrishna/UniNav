import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from "react";
import axios from "axios";
import '../../Assets/css/AddCategory.css';

const AddCategory: React.FC = () => {
    const [newCategoryName, setNewCategoryName] = useState<string>('');
    const [newCategoryDescription, setNewCategoryDescription] = useState<string>('');

    async function addCategory() {
        if (newCategoryName.trim() && newCategoryDescription.trim()) {
            const currentTime = new Date();
            const year = currentTime.getFullYear();
            const month = (currentTime.getMonth() + 1).toString().padStart(2, '0');
            const day = currentTime.getDate().toString().padStart(2, '0');
            const hours = currentTime.getHours().toString().padStart(2, '0');
            const minutes = currentTime.getMinutes().toString().padStart(2, '0');
            const seconds = currentTime.getSeconds().toString().padStart(2, '0');

            const localDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
            try {
                const formData = new FormData();
                formData.append("name", newCategoryName);
                formData.append("description", newCategoryDescription);
                formData.append("createdAt", localDateTime);
                formData.append("updatedAt", localDateTime);
                const response = await axios.post("/category/add-category", formData, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                alert(response.data);
            } catch (e) {
                alert("error");
                console.log(e);
            }

            setNewCategoryName('');
            setNewCategoryDescription('');
        }
    }

    return (
        <div className="add-category-container">
            <h2>Add Category</h2>
            <div className="mb-3">
                <label htmlFor="categoryName" className="form-label">Category Name</label>
                <input
                    type="text"
                    id="categoryName"
                    className="form-control"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Enter category name"
                />
            </div>
            <div className="mb-3">
                <label htmlFor="categoryDescription" className="form-label">Category Description</label>
                <textarea
                    id="categoryDescription"
                    className="form-control"
                    value={newCategoryDescription}
                    onChange={(e) => setNewCategoryDescription(e.target.value)}
                    placeholder="Enter category description"
                    rows={3}
                />
            </div>
            <button className="btn btn-primary mb-3" onClick={addCategory}>
                Add Category
            </button>
        </div>
    );
};

export default AddCategory;
