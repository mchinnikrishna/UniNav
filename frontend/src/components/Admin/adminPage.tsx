import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CategoriesPage from './CategoriesPage';
import AddCategory from "./AddCategory";
import UserVerificationList from "./UserVerificationList";
import '../../Assets/css/AdminPage.css'; // Import the CSS file

const AdminPage: React.FC = () => {
    const [selectedSection, setSelectedSection] = useState<string>('addCategory');

    return (
        <div className={"admin-pannel"}>
            <div className="d-flex">
                {/* Sidebar */}
                <div className="bg-light border-end" style={{width: '250px', minHeight: '100vh'}}>
                    <h3 className="text-center py-3">Admin Panel</h3>
                    <div className="radio-container">
                        <input
                            id="radio-addCategory"
                            name="radio"
                            type="radio"
                            checked={selectedSection === 'addCategory'}
                            onChange={() => setSelectedSection('addCategory')}
                        />
                        <label htmlFor="radio-addCategory">Add Category</label>
                        <input
                            id="radio-categories"
                            name="radio"
                            type="radio"
                            checked={selectedSection === 'categories'}
                            onChange={() => setSelectedSection('categories')}
                        />
                        <label htmlFor="radio-categories">Category Management</label>
                        <input
                            id="radio-userRequests"
                            name="radio"
                            type="radio"
                            checked={selectedSection === 'userRequests'}
                            onChange={() => setSelectedSection('userRequests')}
                        />
                        <label htmlFor="radio-userRequests">User Requests Management</label>

                        <div className="glider-container">
                            <div className="glider"></div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-grow-1 p-4">
                    {selectedSection === 'addCategory' && (
                        <AddCategory/>
                    )}
                    {selectedSection === 'categories' && (
                        <CategoriesPage/>
                    )}
                    {selectedSection === 'userRequests' && (
                        <UserVerificationList/>
                    )}
                </div>
            </div>

        </div>

    );
};

export default AdminPage;