import React, { useState, useRef, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { MdOpenInNew } from "react-icons/md";
import { IoShareSocialSharp } from "react-icons/io5";
import { FaRegBookmark } from "react-icons/fa";
import { GoBookmarkSlash } from "react-icons/go";
import ShareOptions from '../Buttons/ShareOptions';
import '../../Assets/css/EventCard.css';
import { SavedPostsContext } from '../context/SavedPostsContext';
import { useUser } from '@clerk/clerk-react';
import { FaTrash } from 'react-icons/fa';

interface EventCardProps {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    organizerId: string;
    onDelete: (id: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ id, name, description, imageUrl, organizerId, onDelete }) => {
    const [showShareOptions, setShowShareOptions] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const shareOptionsRef = useRef<HTMLDivElement>(null);
    const { savedPosts, toggleSavedPost } = useContext(SavedPostsContext);
    const isSaved = savedPosts.some(post => post.id === id);

    const { user } = useUser();

    const handleDelete = () => {
        onDelete(id);
    };

    const handleShareClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        const buttonRect = (event.target as HTMLElement).getBoundingClientRect();
        setDropdownPosition({ top: buttonRect.bottom + window.scrollY, left: buttonRect.left + window.scrollX });
        setShowShareOptions(true);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (shareOptionsRef.current && !shareOptionsRef.current.contains(event.target as Node)) {
                setShowShareOptions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const truncateDescription = (text: string, maxLength: number) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    const renderShareOptions = () => (
        <div
            ref={shareOptionsRef}
            className="share-options-container"
            style={{
                position: 'absolute',
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                zIndex: 1000
            }}
        >
            <ShareOptions
                eventName={name}
                eventLink={`${window.location.origin}/events/${id}`}
                eventImage={imageUrl}
            />
        </div>
    );

    return (
        <div className="event-card">
            <div className="event-card-image">
                {imageUrl ? <img src={imageUrl} alt={name} style={{ width: '100%', height: '100%' }} /> : <span>No Image</span>}
                {user?.id === organizerId && (
                    <button className="delete-button" onClick={handleDelete}>
                        <FaTrash />
                    </button>
                )}
            </div>
            <div className="event-card-content">
                <h3 className="event-card-title">{name}</h3>
                <p className="event-card-description">{truncateDescription(description, 20)}</p>
                <div className="event-card-actions">
                    <Link to={`/events/${id}`} className="action-button event-card-link">
                        <MdOpenInNew size={20} />
                    </Link>
                    <button onClick={handleShareClick} className="action-button">
                        <IoShareSocialSharp size={20} />
                    </button>
                    <button
                        onClick={() => toggleSavedPost({id, name, description, imageUrl, organizerId})}
                        className="action-button"
                    >
                        {isSaved ? <GoBookmarkSlash size={20}/> : <FaRegBookmark size={20}/>}
                    </button>
                </div>
                {showShareOptions && ReactDOM.createPortal(renderShareOptions(), document.body)}
            </div>
        </div>
    );
};

export default EventCard;