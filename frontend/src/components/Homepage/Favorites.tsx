import React, {useContext, useEffect, useState} from 'react';
import Button from '@mui/material/Button';
import '../../Assets/css/Favorites.css';
import { CategoryContext } from "../context/CategoryContext";
import { SavedPostsContext } from '../context/SavedPostsContext';
import EventCard from "../Events/EventCard";
import axios from "axios";
import {useUser} from "@clerk/clerk-react";
import SuccessModal from "../Models/SuccessModel";

const Favorites: React.FC = () => {
    const [subscriptions, setSubscriptions] = useState<string[]>([]);
    const [isChanged, setIsChanged] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<'categories' | 'saved'>('categories');
    const { savedPosts } = useContext(SavedPostsContext);
    const categories = useContext(CategoryContext);
    const {user} = useUser();
    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>("");



    useEffect(() => {
        if (user === undefined){
            return;
        }

        axios.get(`/user-preferences/${user?.id}`).then(result => {
            if (result.data.status === "success")
            {
                setSubscriptions(result.data.preferences);
            }
            else {
                setSubscriptions([]);
            }
        }
        );
    }, [user]);


    const handleSubscriptionChange = (category: string) => {
        setSubscriptions(prevSubscriptions =>
            prevSubscriptions.includes(category)
                ? prevSubscriptions.filter(sub => sub !== category)
                : [...prevSubscriptions, category]
        );
        setIsChanged(true);
    };

    const handleSaveChanges = () => {
        try {
            axios.post(`/user-preferences/set-preferences/${user?.id}`, subscriptions).then(result =>
            {
                if (result.data.status === "success"){
                    setSuccessMessage(result.data.message);
                    setShowSuccessModal(true);
                }
                else {
                    setSuccessMessage(result.data.message);
                    setShowSuccessModal(true);
                }
            });
        } catch (e){
            console.log(e);
        }
        setIsChanged(false);
    };

    function handleSuccessModelClose() {
        setShowSuccessModal(false);
        setSuccessMessage("");
    }

    return (
        <div className="subscriptions-page">
            <div className="favorites-tabs">
                <button
                    className={`favorites-tab ${activeTab === 'categories' ? 'active' : ''}`}
                    onClick={() => setActiveTab('categories')}
                >
                    Categories
                </button>
                <button
                    className={`favorites-tab ${activeTab === 'saved' ? 'active' : ''}`}
                    onClick={() => setActiveTab('saved')}
                >
                    Saved Posts
                </button>
            </div>

            {activeTab === 'categories' ? (
                <div>
                    <h1>Manage Your Subscriptions</h1>
                    <ul className="categories-list">
                        {categories.map(category => (
                            <li key={category.id} className="category-item">
                                <label>
                                    <input
                                        className="switch"
                                        type="checkbox"
                                        checked={subscriptions.includes(category.id)}
                                        onChange={() => handleSubscriptionChange(category.id)}
                                    />
                                    {category.name}
                                </label>
                                <div className="item-hints">
                                    <div className="hint" data-position="4">
                                        <span className="hint-radius"></span>
                                        <span className="hint-dot">i</span>
                                        <div className="hint-content">
                                            <p>{category.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSaveChanges}
                        disabled={!isChanged}
                    >
                        Save Changes
                    </Button>
                </div>
            ) : (
                <div className="saved-posts">
                    <h1>Your Saved Posts</h1>
                    <div className="saved-posts-grid">
                        {savedPosts.length > 0 ? (
                            savedPosts.map(post => (
                                <EventCard
                                    key={post.id}
                                    id={post.id}
                                    name={post.name}
                                    description={post.description}
                                    imageUrl={post.imageUrl}
                                    organizerId={post.organizerId}
                                    onDelete={() => {}}
                                />
                            ))
                        ) : (
                            <p className="no-posts">No saved posts yet!</p>
                        )}
                    </div>
                </div>
            )}
            {
                showSuccessModal && <SuccessModal show={showSuccessModal} message={successMessage} onClose={handleSuccessModelClose}/>
            }
        </div>
    );
};

export default Favorites;
