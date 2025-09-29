import React from 'react';
import '../../Assets/css/EventsNavBar.css';

const EventsNavBar: React.FC<{ selectedTab: string, setSelectedTab: (tab: 'description' | 'date-time' | 'location' | 'hosts' | 'media') => void }> = ({ selectedTab, setSelectedTab }) => {
    return (
        <div className="tab-container">
            <input type="radio" name="tab" id="tab1" className="EventsNavBar-tab tab--1" checked={selectedTab === 'description'} onChange={() => setSelectedTab('description')} />
            <label className="tab_label" htmlFor="tab1">Description</label>

            <input type="radio" name="tab" id="tab2" className="EventsNavBar-tab tab--2" checked={selectedTab === 'date-time'} onChange={() => setSelectedTab('date-time')} />
            <label className="tab_label" htmlFor="tab2">Date & Time</label>

            <input type="radio" name="tab" id="tab3" className="EventsNavBar-tab tab--3" checked={selectedTab === 'location'} onChange={() => setSelectedTab('location')} />
            <label className="tab_label" htmlFor="tab3">Location</label>

            <input type="radio" name="tab" id="tab4" className="EventsNavBar-tab tab--4" checked={selectedTab === 'hosts'} onChange={() => setSelectedTab('hosts')} />
            <label className="tab_label" htmlFor="tab4">Hosts</label>

            <input type="radio" name="tab" id="tab5" className="EventsNavBar-tab tab--5" checked={selectedTab === 'media'} onChange={() => setSelectedTab('media')} />
            <label className="tab_label" htmlFor="tab5">Media</label>

            <div className="indicator"></div>
        </div>
    );
};

export default EventsNavBar;