import React, {useContext, useEffect, useState} from 'react';
import {Button, Col, Form, InputGroup, ProgressBar, Row} from 'react-bootstrap';
import {Event} from '../types/Event';
import {FaCalendarAlt, FaClock} from 'react-icons/fa';
import './../../Assets/css/PostEventForm.css';
import axios from 'axios';
import {useUser} from '@clerk/clerk-react';
import {useWhat3Words} from '../context/What3WordsContext';
import {CategoryContext} from "../context/CategoryContext";
import {CategoryItem} from "../types/CategoryItem";
import { useNavigate } from 'react-router-dom';
import SuccessModel from "../Models/SuccessModel";

const PostEventForm: React.FC = () => {
    const { user } = useUser();
    const { selectedW3words, selectedLatLng } = useWhat3Words();
    const categories = useContext<CategoryItem[]>(CategoryContext);
    const [date, setDate] = useState<string>('');  // Format: YYYY-MM-DD
    const [time, setTime] = useState<string>('');  // Format: HH:mm
    const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
    const [showModel, setShowModel] = useState<boolean>(false);
    const [modelMessage, setModelMessage] = useState<string>("");
    const [uploadMessage, setUploadMessage] = useState<string>('');
    const [uploadStatus, setUploadStatus] = useState<'success' | 'error' | 'warning' | ''>('');
    const [formErrors, setFormErrors] = useState<string>('');
    const navigate = useNavigate();

    const [address, setAddress] = useState({
        street: '',
        apartmentNumber: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        phone: ''
    });
    const [event, setEvent] = useState<Event>({
        id: '',
        name: '',
        description: '',
        categoryId: '',
        organizerId: user?.id || '',
        what3wordsAddress: selectedW3words?.valueOf(),
        latitude: 0,
        longitude: 0,
        address: address,
        date: '',
        attendees: [],
        maybeAttendees: [],
        declinedAttendees: [],
        duration: '',
        imageUrl: '',
        createdAt: '',
        updatedAt: '',
        type: 'Public',
        likes: 0
    });

    const [files, setFiles] = useState<File[]>([]);
    const [newAttendee, setNewAttendee] = useState<string>('');


    useEffect(() => {
        if (user?.id != null) {
            setEvent((prevEvent) => ({
                ...prevEvent,
                organizerId: user.id,
            }));
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEvent((prevEvent) => ({
            ...prevEvent,
            [name]: value,
        }));
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name , value} = e.target;
        setDate(value);
    }

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setTime(value);
    }


    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEvent((prevEvent) => ({
            ...prevEvent,
            address: {
                ...prevEvent.address,
                [name]: value,
            },
        }));
    };

    useEffect(() => {
        if (selectedLatLng && window.google) {
            const geocoder = new window.google.maps.Geocoder();
            const latLng = new window.google.maps.LatLng(
                selectedLatLng.lat,
                selectedLatLng.lng
            );
            console.log(latLng.lat(), latLng.lng());
            geocoder.geocode({ location: latLng }, (results, status) => {
                if (status === 'OK' && results && results.length > 0) {
                    console.log("inside the geocode");
                    const addressComponents = results[0].address_components;
                    const formattedAddress = {
                        street: extractComponent(addressComponents, 'route') || '',
                        city: extractComponent(addressComponents, 'locality') || '',
                        state: extractComponent(addressComponents, 'administrative_area_level_1') || '',
                        zip: extractComponent(addressComponents, 'postal_code') || '',
                        country: extractComponent(addressComponents, 'country') || '',
                    };

                    // Check if the values are updating properly and re-run the state setter
                    setEvent((event) => ({
                        ...event,
                        address: {
                            ...event.address,
                            street: formattedAddress.street,
                            city: formattedAddress.city,
                            state: formattedAddress.state,
                            zip: formattedAddress.zip,
                            country: formattedAddress.country,
                        },
                        latitude: selectedLatLng.lat,
                        longitude: selectedLatLng.lng,
                    }));
                    console.log(formattedAddress);
                } else {
                    console.error('Geocoder failed due to:', status);
                }
            });
        }
    }, [selectedLatLng]);

    const extractComponent = (components: any[], type: string) => {
        const component = components.find((comp) => comp.types.includes(type));
        return component ? component.long_name : '';
    };


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files).filter(file =>
                file.type.startsWith('image/')
            );

            // Check file size (1MB = 1048576 bytes)
            const oversizedFiles = selectedFiles.some(file => file.size > 1048576);

            if (oversizedFiles) {
                setUploadMessage('File size must be less than 1MB');
                setUploadStatus('warning');
                setFiles([]);
            } else {
                setFiles(selectedFiles);
                setUploadMessage('');
                setUploadStatus('');
            }
        }
    };

    const handleUpload = async () => {
        if (files.length === 0) return;

        const formData = new FormData();
        files.forEach(file => formData.append('file', file));

        try {
            const response = await axios.post('/s3/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            event.imageUrl = response.data.fileUrl;
            setUploadMessage('File uploaded successfully!');
            setUploadStatus('success');
        } catch (error) {
            setUploadMessage('Failed to upload file. Please try again.');
            setUploadStatus('error');
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        if (!event.name || !event.description || !event.categoryId || !date || !time ||
            !event.address.street || !event.address.city || !event.address.state ||
            !event.address.zip || !event.address.country || !event.address.phone) {
            setFormErrors('Please fill in all required fields');
            return;
        }

        event.date = `${date}T${time}:00`;
        try {
            const response = await axios.post('/event/create-event', event, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.data.status === "success"){
                setIsFormSubmitted(true);
                setShowModel(true);
                setModelMessage("Event is successfully created!");
                setFormErrors('');
                // navigate('/'); // Navigate to the MapComponent page
            }
        } catch (error) {
            console.error('Error submitting DateTime:', error);
            setIsFormSubmitted(true);
            setShowModel(true);
            setModelMessage("Failed to create Event.");
        }
    };

    const handleAddAttendee = () => {
        if (newAttendee.trim() !== '' && !event.attendees.includes(newAttendee)) {
            setEvent({
                ...event,
                attendees: [...event.attendees, newAttendee.trim()],
            });
            setNewAttendee('');
        }
    };

    const handleRemoveAttendee = (attendee: string) => {
        setEvent({
            ...event,
            attendees: event.attendees.filter(a => a !== attendee),
        });
    };

    function handleCancel() {
        setEvent({
            id: '',
            name: '',
            description: '',
            categoryId: '',
            organizerId: user?.id || '',
            what3wordsAddress: selectedW3words?.valueOf(),
            latitude: 0,
            longitude: 0,
            address: address,
            date: '',
            attendees: [],
            maybeAttendees: [],
            declinedAttendees: [],
            duration: '',
            imageUrl: '',
            createdAt: '',
            updatedAt: '',
            type: 'Public',
            likes: 0
        })
    }

    function handleOnClose() {
        setShowModel(false);
        setEvent({
            id: '',
            name: '',
            description: '',
            categoryId: '',
            organizerId: user?.id || '',
            what3wordsAddress: selectedW3words?.valueOf(),
            latitude: 0,
            longitude: 0,
            address: address,
            date: '',
            attendees: [],
            maybeAttendees: [],
            declinedAttendees: [],
            duration: '',
            imageUrl: '',
            createdAt: '',
            updatedAt: '',
            type: 'Public',
            likes: 0
        })
    }

    return (
        <Form onSubmit={handleSubmit} className="post-event-form">
            <h3 className="mb-4">Create Event</h3>

            <Form.Group controlId="name" className="mb-3">
                <Form.Label>Event Name <span className="text-danger">*</span></Form.Label>
                <Form.Control
                    type="text"
                    name="name"
                    value={event.name}
                    onChange={handleChange}
                    placeholder="Enter Event Name"
                    required
                />
            </Form.Group>

            <Form.Group controlId="description" className="mb-3">
                <Form.Label>Event Description <span className="text-danger">*</span></Form.Label>
                <Form.Control
                    as="textarea"
                    name="description"
                    value={event.description}
                    onChange={handleChange}
                    placeholder="Enter Description"
                    required
                />
            </Form.Group>

            <Form.Group controlId="eventType" className="mb-3">
                <Form.Label>Event Type <span className="text-danger">*</span></Form.Label>
                <Form.Select
                    name="type"
                    value={event.type}
                    onChange={handleChange}
                >
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                    <option value="Group">Group</option>
                </Form.Select>
            </Form.Group>

            <Form.Group controlId="categoryId" className="mb-3">
                <Form.Label>Category <span className="text-danger">*</span></Form.Label>
                <Form.Select
                    name="categoryId"
                    value={event.categoryId}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Category</option>
                    {categories.map(category =>
                        <option key={category.id} value={category.id}>{category.name}</option>
                    )}
                </Form.Select>
            </Form.Group>

            <Form.Group controlId="organizerId" className="mb-3">
                <Form.Label>Organizer</Form.Label>
                <Form.Control
                    type="text"
                    name="organizerId"
                    value={user?.firstName + ' ' + user?.lastName || ''}
                    disabled={true}
                />
            </Form.Group>

            <Row className="mb-3">
                <Col md={4}>
                    <Form.Group controlId="eventDate">
                        <Form.Label>Date</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="date"
                                name="date"
                                value={date}
                                onChange={handleDateChange}
                                required
                            />
                            <InputGroup.Text>
                                <FaCalendarAlt />
                            </InputGroup.Text>
                        </InputGroup>
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group controlId="eventTime">
                        <Form.Label>Time</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="time"
                                name="time"
                                value={time}
                                onChange={handleTimeChange}
                                required
                            />
                            <InputGroup.Text>
                                <FaClock />
                            </InputGroup.Text>
                        </InputGroup>
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group controlId="duration">
                        <Form.Label>Duration</Form.Label>
                        <Form.Control
                            type="text"
                            name="duration"
                            value={event.duration}
                            onChange={handleChange}
                            placeholder="e.g., 3hr 45min"
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Form.Group controlId="what3wordsAddress" className="mb-3">
                <Form.Label>Location</Form.Label>
                <InputGroup>
                    <Form.Control
                        type="text"
                        name="location"
                        value={selectedW3words || event.what3wordsAddress}
                        onChange={handleChange}
                        placeholder="Choose Location"
                        disabled={true}
                    />
                </InputGroup>
            </Form.Group>

            <Form.Group controlId="address" className="mb-3">
                <Form.Label>Address <span className="text-danger">*</span></Form.Label>
                <Row>
                <Col md={6}>
                        <Form.Control
                            type="text"
                            name="street"
                            value={event.address.street}
                            onChange={handleAddressChange}
                            placeholder="Street"
                            required
                        />
                    </Col>
                    <Col md={6}>
                        <Form.Control
                            type="text"
                            name="apartmentNumber"
                            value={event.address.apartmentNumber}
                            onChange={handleAddressChange}
                            placeholder="Apartment Number (Optional)"
                        />
                    </Col>
                </Row>
                <Row className="mt-2">
                    <Col md={4}>
                        <Form.Control
                            type="text"
                            name="city"
                            value={event.address.city}
                            onChange={handleAddressChange}
                            placeholder="City *"
                            required
                        />
                    </Col>
                    <Col md={4}>
                        <Form.Control
                            type="text"
                            name="state"
                            value={event.address.state}
                            onChange={handleAddressChange}
                            placeholder="State *"
                            required
                        />
                    </Col>
                    <Col md={4}>
                        <Form.Control
                            type="text"
                            name="zip"
                            value={event.address.zip}
                            onChange={handleAddressChange}
                            placeholder="ZIP Code *"
                            required
                        />
                    </Col>
                </Row>
                <Row className="mt-2">
                    <Col md={6}>
                        <Form.Control
                            type="text"
                            name="country"
                            value={event.address.country}
                            onChange={handleAddressChange}
                            placeholder="Country"
                        />
                    </Col>
                    <Col md={6}>
                        <Form.Control
                            type="text"
                            name="phone"
                            value={event.address.phone}
                            onChange={handleAddressChange}
                            placeholder="Phone"
                        />
                    </Col>
                </Row>
            </Form.Group>
            <Form.Group controlId="uploadAttachments" className="mb-3">
                <div className="upload-container">
                    <Form.Label>Upload Attachments (Images Only)</Form.Label>
                    <Form.Control
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                    />

                    {uploadMessage && (
                        <div className={`upload-message ${uploadStatus}`} style={{
                            color: uploadStatus === 'success' ? 'green' :
                                uploadStatus === 'error' ? 'red' :
                                    uploadStatus === 'warning' ? 'orange' : 'inherit',
                            marginTop: '10px',
                            marginBottom: '10px'
                        }}>
                            {uploadMessage}
                        </div>
                    )}

                    <Button
                        className="upload-btn"
                        onClick={handleUpload}
                        disabled={files.length === 0}
                    >
                        Upload File
                    </Button>
                </div>
            </Form.Group>
            <Form.Group controlId="attendees" className="mb-3" hidden={!(event.type === 'Group')}>
                <Form.Label>Attendees</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Enter attendee email"
                    value={newAttendee}
                    onChange={(e) => setNewAttendee(e.target.value)}
                />
                <Button variant="success" className="mt-2" onClick={handleAddAttendee}>
                    Add Attendee
                </Button>
                <div className="mt-3">
                    {event.attendees.length > 0 && (
                        <ul className="list-group">
                            {event.attendees.map((attendee, index) => (
                                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                    {attendee}
                                    <Button variant="danger" size="sm" onClick={() => handleRemoveAttendee(attendee)}>
                                        Remove
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </Form.Group>

            {formErrors && (
                <div className="alert alert-danger">{formErrors}</div>
            )}

            <div className="form-actions mt-4">
                <Button variant="outline-secondary" className="me-2" onClick={handleCancel}>
                    Cancel
                </Button>
                <Button className="custom-button" type="submit" >
                    Create Event
                </Button>
            </div>
        {isFormSubmitted && <SuccessModel show={showModel} message={modelMessage} onClose={handleOnClose}/>}
    </Form>
    );
};

export default PostEventForm;
