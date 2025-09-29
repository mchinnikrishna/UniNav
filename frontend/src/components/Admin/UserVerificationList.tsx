import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import SuccessModal from "../Models/SuccessModel";

interface UserRequest {
    id: string;
    name: string;
    phone: string;
    email: string;
    verificationDocumentUrl: string;
    isBlocked: boolean;
}

const UserVerificationList: React.FC = () => {


    const [userRequests, setUserRequests] = useState<UserRequest[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [previewImageUrl, setPreviewImageUrl] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string> ("");
    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);


    useEffect(() => {
        axios.get<UserRequest[]>('/user/get-user-requests')
            .then((result) => {
                setUserRequests(result.data);
                console.log(result.data);
            })
            .catch((error) => {
                console.error('Error fetching User requests:', error);
            });
    }, []);

    const verifyUser = async (id: string) => {
        const response = await axios.post("/user/verify-user", {"userId": id}, {
            headers : {
                'Content-Type': 'application/json',
            },
            params : {
                'id' : id
            }
        })
        if (response.data.status === "success"){
            setSuccessMessage(response.data.message);
            setShowSuccessModal(true);
        } else {
            setSuccessMessage(response.data.message);
            setShowSuccessModal(true);
        }
    };

    const blockUser = (id: string) => {
        setUserRequests(prevRequests =>
            prevRequests.map(user =>
                user.id === id ? { ...user, isBlocked: true } : user
            )
        );
    };

    const unblockUser = (id: string) => {
        setUserRequests(prevRequests =>
            prevRequests.map(user =>
                user.id === id ? { ...user, isBlocked: false } : user
            )
        );
    };

    const deleteUser = (id: string) => {
        setUserRequests(prevRequests =>
            prevRequests.filter(user => user.id !== id)
        );
    };

    const handleImageClick = (imageUrl: string) => {
        setPreviewImageUrl(imageUrl);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setPreviewImageUrl('');
    };

    function handleClose() {
        setShowSuccessModal(false);
        window.location.reload();
    }

    return (
        <div>
            <h2>User Requests</h2>
            {userRequests.length === 0 ? (
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh'}}>
                    <h2><span style={{color: '#DD2255'}}>No</span> User Requests Available.</h2>
                </div>) : (
                <div style={{maxHeight: '80%', overflowY: 'auto'}}>
                    <div className="d-flex flex-wrap justify-content-start gap-3">
                    {userRequests.map(request => (
                            <div
                                key={request.id}
                                className="card"
                                style={{width: '30%', minWidth: '250px'}}
                            >
                                <img
                                    src={request.verificationDocumentUrl}
                                    alt="User ID"
                                    className="card-img-top img-thumbnail"
                                    style={{height: '200px', objectFit: 'cover', cursor: 'pointer'}}
                                    onClick={() => handleImageClick(request.verificationDocumentUrl)}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{request.name}</h5>
                                    <p className="card-text">
                                        <strong>Phone:</strong> {request.phone}
                                        <br/>
                                        <strong>Email:</strong> {request.email}
                                    </p>
                                    <div className="d-flex gap-2">
                                        <button
                                            className="btn btn-success"
                                            onClick={() => verifyUser(request.id)}
                                        >
                                            Verify
                                        </button>
                                        {request.isBlocked ? (
                                            <button
                                                className="btn btn-warning"
                                                onClick={() => unblockUser(request.id)}
                                            >
                                                Unblock
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => blockUser(request.id)}
                                            >
                                                Block
                                            </button>
                                        )}
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => deleteUser(request.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showModal && (
                <div className="modal show d-block" tabIndex={-1} role="dialog" onClick={closeModal}>
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Image Preview</h5>
                                <button type="button" className="close" onClick={closeModal}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body text-center">
                                <img src={previewImageUrl} alt="Preview" className="img-fluid"/>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <SuccessModal show={showSuccessModal} message={successMessage} onClose={handleClose}/>
        </div>
    );
};

export default UserVerificationList;
