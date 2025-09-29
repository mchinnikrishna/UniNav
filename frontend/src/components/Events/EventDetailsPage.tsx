// EventDetailsPage.tsx
import React, {useContext, useEffect, useState} from 'react';
import { Button, Container, Card, ListGroup, Modal } from 'react-bootstrap';
import {
    FaCalendarAlt,
    FaClock,
    FaMapMarkerAlt,
    FaThumbsUp,
    FaCheck,
    FaTimes,
    FaQuestion,
    FaThumbsDown
} from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { EventContext } from '../context/EventContext';
import '../../Assets/css/EventDetailsPage.css';
import EventsNavBar from '../Buttons/EventsNavBar';
import GoogleCalendarButton from '../Buttons/GoogleCalendarButton';
import axios from "axios";
import {useUser} from "@clerk/clerk-react";

const FALLBACK_IMAGE_URL = 'https://via.placeholder.com/1200x400';

const EventDetailsPage: React.FC = () => {
    const [like, setLike] = useState<boolean>(false);
    const [rsvpStatus, setRsvpStatus] = useState<'yes' | 'no' | 'maybe' | ''>('');
    const [showMediaModal, setShowMediaModal] = useState(false);
    const [selectedTab, setSelectedTab] = useState<'description' | 'date-time' | 'location' | 'hosts' | 'media'>('description');
    const events = useContext(EventContext);
    const { paramName } = useParams<{ paramName: string }>();
    const event = events.find(e => e.id === paramName);
    const [likes, setLikes] = useState(event?.likes || 0);
    const {user} = useUser();

    useEffect(() => {
        const storedLike = localStorage.getItem(`like_${event?.id}`);
        setLike(storedLike === "true");
        setLikes(event?.likes || 0);
    }, [event?.id]);

    const handleLike = () => {
        if (!like) {
            axios.post(`/event/like/${event?.id}`).then(r => {
                if (r.status === 200) {
                    let newLike = !like;
                    setLike(newLike);
                    setLikes(likes + 1);
                    localStorage.setItem(`like_${event?.id}`, newLike.toString());
                }
            });
        } else {
            axios.post(`/event/unlike/${event?.id}`).then(r => {
                if (r.status === 200) {
                    let newLike = !like;
                    setLike(newLike);
                    setLikes(likes-1);
                    localStorage.setItem(`like_${event?.id}`, newLike.toString());
                }
            })
        }
    };

    const handleRSVP = (status: 'yes' | 'no' | 'maybe') => {
        setRsvpStatus(status);
        const RSVPData = new FormData();
        RSVPData.append('eventId', event?.id || '');
        RSVPData.append('status', status);
        RSVPData.append('userId', user?.id || '');
        const response = axios.post("/event/rsvp", RSVPData, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
    };

    const handleMediaClick = () => {
        setShowMediaModal(true);
    };

    const handleMediaClose = () => {
        setShowMediaModal(false);
    };

    return (
        <div className="event-details-page">
            <div className="event-details-container">
                {event && (
                    <>
                        <div className="cover-image-container">
                            <div className="cover-image"
                                 style={{backgroundImage: `url(${event.imageUrl || FALLBACK_IMAGE_URL})`}}></div>
                            <div className="main-image-title-container">
                                <img className="main-image" src={event.imageUrl || FALLBACK_IMAGE_URL} alt="Main Event"/>
                                <h1 className="event-title">{event.name}</h1>
                            </div>
                        </div>
                        <div className="content-container">
                            <div className="nav-bar-container">
                                <EventsNavBar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
                                <div className="nav-bar-content">
                                    <Container>
                                        {selectedTab === 'description' && (
                                            <Card className="eventdetails-card">
                                                <Card.Body>
                                                    <p>{event.description}</p>
                                                </Card.Body>
                                            </Card>
                                        )}
                                        {selectedTab === 'date-time' && (
                                            <Card className="eventdetails-card">
                                                <Card.Body>
                                                    <p><FaCalendarAlt/> <strong>Date:</strong> {event.date}</p>
                                                    <p><FaClock /> <strong>Duration:</strong> {event.duration}</p>
                                                    {event && (
                                                        <GoogleCalendarButton
                                                            eventName={event.name}
                                                            eventDescription={event.description}
                                                            eventDate={event.date}
                                                            eventDuration={event.duration}
                                                            eventLocation={`${event.address.street}, ${event.address.city}, ${event.address.state}, ${event.address.zip}, ${event.address.country}`}
                                                        />
                                                    )}
                                                </Card.Body>
                                            </Card>
                                        )}
                                        {selectedTab === 'location' && (
                                            <Card className="eventdetails-card">
                                                <Card.Body>
                                                    <p><FaMapMarkerAlt /> <strong>Location:</strong> {`${event.address.street}, ${event.address.city}, ${event.address.state}, ${event.address.zip}, ${event.address.country}`}</p>
                                                    {event.what3wordsAddress && (
                                                        <p><strong>What3Words:</strong> {event.what3wordsAddress}</p>
                                                    )}
                                                </Card.Body>
                                            </Card>
                                        )}
                                        {selectedTab === 'hosts' && (
                                            <Card className="eventdetails-card">
                                                <Card.Body>
                                                    <p><strong>Organizer ID:</strong> {event.organizerId}</p>
                                                </Card.Body>
                                            </Card>
                                        )}
                                        {selectedTab === 'media' && (
                                            <Card className="eventdetails-card">
                                                <Card.Body>
                                                    <img
                                                        src={event.imageUrl || FALLBACK_IMAGE_URL}
                                                        alt="Event Media"
                                                        className="zoomed-out-image"
                                                        onClick={handleMediaClick}
                                                    />
                                                </Card.Body>
                                            </Card>
                                        )}
                                    </Container>
                                </div>
                            </div>
                            <div className="rsvp-container">
                                <Card>
                                    <Card.Body>
                                        <h3 className="rsvp-text">RSVP:</h3>
                                        <Button variant="outline-primary" className="me-2" onClick={() => handleRSVP('yes')}>
                                            <FaCheck/> Yes
                                        </Button>
                                        <Button variant="outline-secondary" className="me-2" onClick={() => handleRSVP('maybe')}>
                                            <FaQuestion/> Maybe
                                        </Button>
                                        <Button variant="outline-danger" onClick={() => handleRSVP('no')}>
                                            <FaTimes/> No
                                        </Button>
                                        <div className="mt-3">
                                            <Button variant="outline-success" onClick={handleLike}>
                                                {like && <FaThumbsDown color={"red"} />}
                                                {!like && <FaThumbsUp color={"green"} />}
                                                Like ({likes})
                                            </Button>
                                        </div>
                                        {rsvpStatus && (
                                            <div className="mt-3">
                                                <h5>Your RSVP: <span
                                                    className={`text-${rsvpStatus === 'yes' ? 'success' : rsvpStatus === 'no' ? 'danger' : 'warning'}`}>{rsvpStatus.toUpperCase()}</span>
                                                </h5>
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                                <ListGroup className="mb-4">
                                    <ListGroup.Item><strong>Attendees:</strong> {event.attendees.join(', ') || 'No attendees yet'}</ListGroup.Item>
                                    <ListGroup.Item><strong>Maybe Attendees:</strong> {event.maybeAttendees.join(', ') || 'None'}</ListGroup.Item>
                                    <ListGroup.Item><strong>Declined Attendees:</strong> {event.declinedAttendees.join(', ') || 'None'}</ListGroup.Item>
                                </ListGroup>
                            </div>
                        </div>
                        <Modal show={showMediaModal} onHide={handleMediaClose} centered>
                            <Modal.Body>
                                <img src={event.imageUrl || FALLBACK_IMAGE_URL} alt="Media" className="modal-image" />
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleMediaClose}>Close</Button>
                            </Modal.Footer>
                        </Modal>
                    </>
                )}
            </div>
        </div>
    );
};

export default EventDetailsPage;
