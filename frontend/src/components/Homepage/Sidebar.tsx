import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './../../Assets/css/Sidebar.css';
import halflogo from '../../Assets/images/uninav_halflogo1.png';
import fulllogo from '../../Assets/images/uninav_fulllogo1.png';
import { FaHome, FaBell, FaFolder, FaCalendar, FaHeart, FaCog, FaAd } from 'react-icons/fa';
import { MdOutlineLogin } from 'react-icons/md';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import UserDataLogger from "../User/UserDataLogger";
import Button from "react-bootstrap/Button";

const Sidebar: React.FC = () => {
    const { user } = useUser();
    const [isExpanded, setIsExpanded] = useState(false);
    const location = useLocation();

    // Get user's profile image, name, and email
    const profileImage = user?.imageUrl || 'https://via.placeholder.com/40';
    const profileName = user?.fullName || 'User Name';
    const profileEmail = user?.primaryEmailAddress?.emailAddress || 'user@example.com';

    return (
        <div
            className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <div className="logo-section">
                <div className="logo-container">
                    <img
                        src={halflogo}
                        alt="Logo"
                        className="logo collapsed-logo"
                    />
                    <img
                        src={fulllogo}
                        alt="Logo"
                        className="logo expanded-logo"
                    />
                </div>
            </div>

            <ul className="nav-list">
                <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
                    <FaHome className="nav-icon" />
                    <span className="nav-label">Home</span>
                </Link>
                <Link to="/notifications" className={`nav-item ${location.pathname === '/notifications' ? 'active' : ''}`}>
                    <FaBell className="nav-icon" />
                    <span className="nav-label">Notifications <span className="badge">10</span></span>
                </Link>
                <Link to="/events" className={`nav-item ${location.pathname === '/events' ? 'active' : ''}`}>
                    <FaFolder className="nav-icon" />
                    <span className="nav-label">Events</span>
                </Link>
                <Link to="/post" className={`nav-item ${location.pathname === '/post' ? 'active' : ''}`}>
                    <FaCalendar className="nav-icon" />
                    <span className="nav-label">Post Event</span>
                </Link>
                <Link to="/favorites" className={`nav-item ${location.pathname === '/favorites' ? 'active' : ''}`}>
                    <FaHeart className="nav-icon" />
                    <span className="nav-label">Favorites</span>
                </Link>
                <Link to="/settings" className={`nav-item ${location.pathname === '/settings' ? 'active' : ''}`}>
                    <FaCog className="nav-icon" />
                    <span className="nav-label">Settings</span>
                </Link>
                { user && user.primaryEmailAddress && "adivakararao@vt.edu" === user.primaryEmailAddress.toString()  && (
                    <Link to="/adminpage" className={`nav-item ${location.pathname === '/adminpage' ? 'active' : ''}`}>
                        <FaAd className="nav-icon" />
                        <span className="nav-label">Admin</span>
                    </Link>
                )}
            </ul>

            <div className="profile-section">
                <SignedIn>
                    <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                            elements: {
                                avatarBox: 'profile-img',
                            },
                        }}
                    />
                    <div className="profile-details">
                        <span className="profile-name">{profileName}</span>
                    </div>
                    <UserDataLogger />
                </SignedIn>
                <SignedOut>
                    {isExpanded ? (
                        <SignInButton>
                            <Button className="user-signin-button" variant="outline-success" size="lg">SignIn</Button>
                        </SignInButton>
                    ) : (
                        <MdOutlineLogin className="login-icon" />
                    )}
                </SignedOut>
            </div>
        </div>
    );
};

export default Sidebar;
