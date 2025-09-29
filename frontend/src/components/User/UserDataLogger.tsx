import { useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import axios from "axios";

function UserDataLogger() {
    const { user } = useUser();

    useEffect(() => {
        const saveUserData = async () => {
            if (user) {
                const userData = {
                    userId: user.id,
                    name: user.fullName,
                    email: user.primaryEmailAddress?.emailAddress,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    profileImage: user.imageUrl,
                    phoneNumber: user.primaryPhoneNumber?.phoneNumber,
                    role : "",
                    verified: false
                };

                try {
                    const response = await axios.post("/user/save-user", userData, {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    console.log(response.status);
                } catch (error) {
                    console.error("Error saving user data:", error);
                }
            }
        };

        saveUserData().then();

    }, [user]);

    return null;
}

export default UserDataLogger;
