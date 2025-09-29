import React from 'react';
import './App.css';
import MapComponent from "./components/MapComponent";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";
import PostEvent from "./components/Homepage/PostEvent";
import SettingsPage from "./components/Homepage/SettingsPage";
import Sidebar from "./components/Homepage/Sidebar";
import EventsPage from "./components/Events/EventsPage";
import Favorites from "./components/Homepage/Favorites";
import AdminPage from "./components/Admin/adminPage";
import EventDetailsPage from "./components/Events/EventDetailsPage";
import UserVerificationForm from "./components/User/UserVerificationForm";
import { SavedPostsProvider } from "./components/context/SavedPostsContext";
import NotificationsPage from "./components/Homepage/NotificationsPage";

// Set the base URL for Axios

function App() {
    // axios.defaults.baseURL = 'https://uninav.onrender.com/api';
    axios.defaults.baseURL = 'http://localhost:8080/api';
    return (
        <SavedPostsProvider>
        <Router basename="/Uninav">
            <div className="App">
                <Sidebar/>
                <Routes>
                    <Route path="/" element={<MapComponent/>}/>
                    <Route path="/settings" element={<SettingsPage/>}></Route>
                    <Route path="/post" element={<PostEvent/>}/>
                    <Route path="/events" element={<EventsPage/>}/>
                    <Route path="/favorites" element={<Favorites/>}/>
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/adminpage" element={<AdminPage/>}/>
                    <Route path={"/events/:paramName"} element={<EventDetailsPage/>}/>
                    <Route path="/user-verification" element={<UserVerificationForm/>}/>
                </Routes>
            </div>
        </Router>
        </SavedPostsProvider>
    );
}

export default App;
