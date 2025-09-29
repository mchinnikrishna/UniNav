import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaExclamationTriangle, FaEnvelope } from 'react-icons/fa';
import './../../Assets/css/NotificationsPage.css';

interface Notification {
    id: string;
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    type: 'alert' | 'general';
}

const NotificationsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('all');

    const tabs = [
        { id: 'all', label: 'All Notifications', icon: <FaBell /> },
        { id: 'unread', label: 'Unread', icon: <FaEnvelope /> },
        { id: 'alerts', label: 'Alerts', icon: <FaExclamationTriangle /> }
    ];

    return (
        <div className="notifications-container">
            <h1 className="notifications-title">Notifications</h1>

            <div className="notifications-tabs-wrapper">
                {tabs.map(tab => (
                    <motion.button
                        key={tab.id}
                        className={`notifications-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="tab-icon">{tab.icon}</span>
                        {tab.label}
                        {tab.id === 'unread' && (
                            <span className="notification-badge">5</span>
                        )}
                    </motion.button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="notifications-content"
                >
                    {/* Placeholder content - will be replaced with actual notifications */}
                    <div className="notification-card">
                        <div className="notification-header">
                            <FaBell className="notification-icon" />
                            <span className="notification-time">2 hours ago</span>
                        </div>
                        <h3 className="notification-title">New Event Near You</h3>
                        <p className="notification-message">
                            There's a new event happening in your area!
                        </p>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default NotificationsPage;
