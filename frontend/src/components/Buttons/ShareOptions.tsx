import React from 'react';
import { FaFacebookF, FaLink, FaXTwitter } from 'react-icons/fa6';
import { RiInstagramFill } from "react-icons/ri";
import { FaLinkedin } from 'react-icons/fa';
import '../../Assets/css/ShareOptions.css';

interface ShareOptionsProps {
    eventName: string;
    eventLink: string;
    eventImage: string; // Optional, for platforms supporting image sharing
}

const ShareOptions: React.FC<ShareOptionsProps> = ({ eventName, eventLink, eventImage }) => {

    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventLink)}&quote=${encodeURIComponent(
        `Check out this "${eventName}" on UniNav`
    )}`;
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `Check out this "${eventName}" on UniNav ${eventLink}`
    )}`;
    const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(eventLink)}&title=${encodeURIComponent(
        `Check out this "${eventName}" on UniNav`
    )}`;
    const copyLinkToClipboard = () => {
        navigator.clipboard.writeText(eventLink);
        alert('Event link copied to clipboard!');
    };

    return (
        <div className="main">
            <div className="up">
                {/*<button className="card1">*/}
                {/*    <RiInstagramFill className="instagram" size={30}/>*/}
                {/*    <span className="tooltip">Share on Instagram</span>*/}
                {/*</button>*/}
                <a href={facebookShareUrl} target="_blank" rel="noopener noreferrer" className="card2">
                    <FaFacebookF className="facebook" size={24}/>
                    <span className="tooltip">Share on Facebook</span>
                </a>
                <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer" className="card3">
                    <FaXTwitter className="twitter" size={24}/>
                    <span className="tooltip">Share on Twitter</span>
                </a>
                <a href={linkedinShareUrl} target="_blank" rel="noopener noreferrer" className="card5">
                    <FaLinkedin className="linkedin" size={24}/>
                    <span className="tooltip">Share on LinkedIn</span>
                </a>
                <a onClick={copyLinkToClipboard} className="card4">
                    <FaLink className="copy" size={30}/>
                    <span className="tooltip">Copy Link</span>
                </a>
            </div>
        </div>
    );
};

export default ShareOptions;