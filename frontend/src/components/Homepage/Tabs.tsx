import React from 'react';
import { SignedIn } from '@clerk/clerk-react';
import '../../Assets/css/Tabs.css';


interface TabsProps {
    onTabChange: (selectedTab: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ onTabChange }) => {
    const handleTabChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onTabChange(event.target.id);
    };

    return (
        <div className="container">
            <SignedIn>
                <div className="tabs">
                    <input
                        type="radio"
                        id="Public"
                        name="tabs"
                        defaultChecked
                        onChange={handleTabChange}
                    />
                    <label className="tab" htmlFor="Public">Public</label>
                    <input
                        type="radio"
                        id="Group"
                        name="tabs"
                        onChange={handleTabChange}
                    />
                    <label className="tab" htmlFor="Group">Group</label>
                    <input
                        type="radio"
                        id="Private"
                        name="tabs"
                        onChange={handleTabChange}
                    />
                    <label className="tab" htmlFor="Private">Private</label>
                    <span className="glider"></span>
                </div>
            </SignedIn>
        </div>
    );
};

export default Tabs;
