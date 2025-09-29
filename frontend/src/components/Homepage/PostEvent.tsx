import React, {useEffect, useState} from 'react';
import PostEventForm from "./PostEventForm";
import What3WordsMapComponent from "./What3WordsMapComponent";
import "../../Assets/css/PostEvent.css";
import {RedirectToSignIn, SignedIn, SignedOut, useUser} from "@clerk/clerk-react";
import axios from "axios";
import {Button} from "react-bootstrap";
import UserVerificationForm from "../User/UserVerificationForm";
import SuccessModal from "../Models/SuccessModel";
import { useNavigate } from 'react-router-dom';


const PostEvent: React.FC = () => {

    const user = useUser();
    const [isVerified, setIsVerified] = useState<boolean>(false);
    const [showVerificationForm, setShowVerificationForm] = useState(false);
    const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
    const [showSuccessModel, setShowSuccessModel] = useState<boolean>(false)
    const [isRequested, setIsRequested] = useState<boolean>(false);
    const navigate = useNavigate();



    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/user/is-verified", {
                    params: { userId: user.user?.id },
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (response.data.status === "success") {
                    console.log(response);
                    setIsVerified(response.data.isVerified);
                }

                const response2 = await axios.get("/user/is-request-present", {
                    params: { userId: user.user?.id },
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                if (response2.data.status === "success") {
                    console.log(response2);
                    setIsRequested(response2.data.isRequestPresent);
                }
            } catch (error) {
                console.error("Error fetching user verification status:", error);
            }
        };

        if (user && user.user?.id) {
            fetchData();
        }
    }, [user]);

    function handleButtonClick() {
        navigate('/user-verification');
    }

    function formStatus(data: string) {
        if(data === "success"){
            setShowVerificationForm(false);
            setIsFormSubmitted(true);
            setShowSuccessModel(true);
        }
    }

    function handleOnClickClose() {
        setShowVerificationForm(false);
    }

    function handleSuccessFormClose() {
        setShowSuccessModel(false);
    }

    return (
        <div className="post-event-container">
            {isVerified &&
                <SignedIn>
                    <div className="map-component-container">
                    <What3WordsMapComponent/>
                    </div>
                    <div className="post-event-form-container">
                    <PostEventForm/>
                    </div>
                </SignedIn>
            }
            {!isVerified && !isRequested &&
                <SignedIn>
                    <div className="unverified-user-container">
                        <h1>Unverified User</h1>
                        <p>
                            Please get verified in Order to Create a post. Click the button to submit the Verification Form.
                        </p>
                        <button className="btn btn-primary" onClick={handleButtonClick} disabled={isFormSubmitted}>
                            Get Verified
                        </button>
                    </div>
                </SignedIn>
            }
            { isRequested && !isVerified &&
                <div className="unverified-user-container">
                    <h1>Unverified User</h1>
                    <p>
                        Our team is working on your request. Please wait until your request get approved! Thanks for your patience. You will be notified once you got approved.
                    </p>
                </div>
            }
            {showVerificationForm &&
                <div className="post-event-verification-form">
                    <Button variant={"danger"} onClick={handleOnClickClose} style={{position: "absolute", top: '20px', right: '20px'}}>Close</Button>
                    <UserVerificationForm sendFormStatusToSettingsPage={formStatus}/>
                </div>
            }
            <SignedOut>
                <RedirectToSignIn/>
            </SignedOut>
            {isFormSubmitted && <SuccessModal show={showSuccessModel} message={"Your request submitted successfully. Wait for the admin to approve. you will get a notification once your is approved!"} onClose={handleSuccessFormClose}/> }
        </div>
    );
};

export default PostEvent;
