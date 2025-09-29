// UserVerificationForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import '../../Assets/css/UserVerificationForm.css';
import GoBackButton from '../Buttons/GoBackButton';

interface settingPageProps {
    sendFormStatusToSettingsPage?: (data: string) => void;
}

const UserVerificationForm: React.FC<settingPageProps> = ({ sendFormStatusToSettingsPage }) => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        idImage: null as File | null,
        imagePreview: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        if (files && files.length > 0) {
            const file = files[0];
            setFormData({
                ...formData,
                [name]: file,
                imagePreview: URL.createObjectURL(file)
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const uploadImageToServer = async (file: File): Promise<string> => {
        try {
            const fileData = new FormData();
            fileData.append('file', file);

            const response = await axios.post('/s3/upload', fileData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data.fileUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw new Error('Failed to upload image');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            let fileUrl = '';
            if (formData.idImage) {
                fileUrl = await uploadImageToServer(formData.idImage);
            }

            const requestBody = {
                userId: user?.id,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                verificationDocumentUrl: fileUrl,
                isBlocked: false
            };

            const response = await axios.post('/user/verification-request', requestBody, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.status === 'success') {
                alert('Form submitted successfully!');
                sendFormStatusToSettingsPage && sendFormStatusToSettingsPage('success');
            } else if (response.data.status === 'request-already-exists') {
                alert('A verification request already exists.');
                sendFormStatusToSettingsPage && sendFormStatusToSettingsPage('success');
            } else {
                alert('There was an issue with the submission.');
            }

            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('There was an error submitting the form.');
        }
    };

    const handleGoBack = () => {
        navigate('/');
    };

    return (
        <div className="verification-page">
            <div className="form-section">
                <form onSubmit={handleSubmit} className="verification-form">
                    <h2 className="mb-3">User Verification</h2>
                    <p className="text-muted">Please provide your details to verify your identity.</p>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="form-control"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phone" className="form-label">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            className="form-control"
                            placeholder="+1 (555) 000-0000"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="idImage" className="form-label">Upload ID Proof</label>
                        <input
                            type="file"
                            id="idImage"
                            name="idImage"
                            className="form-control"
                            accept="image/*"
                            onChange={handleChange}
                            required
                        />
                        <small className="size-limit">File size limit: 1MB</small>
                        {formData.imagePreview && (
                            <div className="mt-3">
                                <img
                                    src={formData.imagePreview}
                                    alt="ID Proof Preview"
                                    className="img-thumbnail preview-image"
                                />
                            </div>
                        )}
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Submit</button>
                    <GoBackButton onClick={handleGoBack}/>
                </form>
            </div>
            <div className="image-section">
                <div className="promo-image"></div>
            </div>
        </div>
    );
};

export default UserVerificationForm;
