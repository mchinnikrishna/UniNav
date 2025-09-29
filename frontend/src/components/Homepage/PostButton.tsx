import React from 'react';
import '../../Assets/css/PostButton.css';
import {useNavigate} from "react-router-dom";


const PostButton: React.FC = () => {
    const navigate = useNavigate(); // Initialize useNavigate

    // Handle click event
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault(); // Prevent default anchor behavior
        navigate('/post'); // Navigate to /posts
    };

    return (
        <a className="fancy" href="/src/components/Homepage/PostEvent" onClick={handleClick}>
            <span className="top-key"></span>
            <span className="text">Post</span>
            <span className="bottom-key-1"></span>
            <span className="bottom-key-2"></span>
        </a>
    );
};

export default PostButton;
