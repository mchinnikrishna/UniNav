import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './../../Assets/css/SettingsPage.css';
import { useUser } from "@clerk/clerk-react";
import UserVerificationForm from "../User/UserVerificationForm";
// import '../../Assets/css/UserVerificationPage.css'
import axios from "axios";

const SettingsPage: React.FC = () => {
    const { user } = useUser();
    const [userDetails, setUserDetails] = useState({
        username: '',
        primaryEmail: '',
        phoneNumber: '',
        secondaryEmail: '',
        profileImage: ''
    });
    const [showForm, setShowForm] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [isRequestPresent, setIsRequestPresent] = useState<boolean | null>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRequestStatus = async () => {
            try {
                const response = await axios.get(`/user/is-request-present`, {
                    params: { userId: user?.id}
                });

                if (response.data.status === "success") {
                    setIsRequestPresent(response.data.isRequestPresent);
                } else {
                    setError('Failed to fetch request status');
                }
            } catch (error) {
                console.error('Error fetching request status:', error);
                setError('Failed to fetch request status');
            }
        };

        if (user) {
            fetchRequestStatus();
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            setUserDetails({
                username: user.fullName || 'User Name',
                primaryEmail: user.primaryEmailAddress?.emailAddress || 'user@example.com',
                phoneNumber: '',
                secondaryEmail: '',
                profileImage: user.imageUrl || 'https://via.placeholder.com/40'
            });
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleVerifyOnClick = () => {
        setShowForm(true);
    };

    function handleClose() {
        setShowForm(false);
    }

    function handleFormStatus(data: string) {
        if(data === "success"){
            handleClose();
            setIsButtonDisabled(true);
        }
    }

    return (
        <Container className="settings-page mt-4">
            {/* Header */}
            <div className="header-section">
                <h2 className="title">Settings</h2>
            </div>

            {/* User Details */}
            <div className="user-details-section mb-4">
                <h5 className="title">User Details</h5>
                <Row className="align-items-center mb-3">
                    <Col xs="auto">
                        <img src={userDetails.profileImage} alt="Profile" className="profile-pic" />
                    </Col>
                    <Col>
                        <p><strong>Username:</strong> {userDetails.username}</p>
                        <p><strong>Primary Email:</strong> {userDetails.primaryEmail}</p>
                    </Col>
                </Row>
                <Form>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="2">Phone Number</Form.Label>
                        <Col sm="10">
                            <Form.Control
                                type="text"
                                name="phoneNumber"
                                value={userDetails.phoneNumber}
                                onChange={handleInputChange}
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="2">Secondary Email</Form.Label>
                        <Col sm="10">
                            <Form.Control
                                type="email"
                                name="secondaryEmail"
                                value={userDetails.secondaryEmail}
                                onChange={handleInputChange}
                            />
                        </Col>
                    </Form.Group>
                </Form>
            </div>

            {/* Notifications */}
            {/*<div className="notifications-section">*/}
            {/*    <Row className="mb-3">*/}
            {/*        <Col><strong>Notifications</strong></Col>*/}
            {/*        <Col xs="auto"><strong>Email</strong></Col>*/}
            {/*    </Row>*/}

            {/*    <Row className="notification-item align-items-center">*/}
            {/*        <Col>Alerts</Col>*/}
            {/*        <Col xs="auto">*/}
            {/*            <Form.Check type="switch" defaultChecked />*/}
            {/*        </Col>*/}
            {/*    </Row>*/}

            {/*    <Row className="notification-item align-items-center">*/}
            {/*        <Col>Events</Col>*/}
            {/*        <Col xs="auto">*/}
            {/*            <Form.Check type="switch" />*/}
            {/*        </Col>*/}
            {/*    </Row>*/}

            {/*    <Row className="notification-item align-items-center">*/}
            {/*        <Col>Giveaways</Col>*/}
            {/*        <Col xs="auto">*/}
            {/*            <Form.Check type="switch" />*/}
            {/*        </Col>*/}
            {/*    </Row>*/}
            {/*</div>*/}

            {/* Authentication */}
            <div className="danger-zone mt-4">
                <h5 className="text-danger">Verify Yourself</h5>
                <Row className="align-items-center">
                    <Col>
                        <strong>Verify Yourself in order to Post</strong>
                    </Col>
                    <Col xs="auto">
                        <Button variant="danger" onClick={handleVerifyOnClick} disabled={isButtonDisabled || isRequestPresent?.valueOf()}>Verify</Button>
                    </Col>
                </Row>
            </div>

            <div className="footer-section mt-4 d-flex justify-content-end">
                <Button variant="light" className="me-2">Cancel</Button>
                <Button variant="dark">Save changes</Button>
            </div>

            {showForm && (
                <div className="user-verification-form-overlay">
                    <div className="user-verification-form card p-4">
                        <div className="d-flex justify-content-end">
                            <Button variant="danger" onClick={handleClose}>
                                Close
                            </Button>
                        </div>
                        <UserVerificationForm sendFormStatusToSettingsPage={handleFormStatus}/>
                    </div>
                </div>
            )}
        </Container>
    );
};

export default SettingsPage;
