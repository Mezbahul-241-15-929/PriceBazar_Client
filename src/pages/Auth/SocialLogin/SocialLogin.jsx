import React, { useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router';
import axios from 'axios';

const SocialLogin = () => {
    const { signInGoogle } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError('');

        try {
            const result = await signInGoogle();
            console.log('Google sign-in result:', result.user);

            // Prepare user data for database
            const userInfo = {
                email: result.user.email,
                displayName: result.user.displayName,
                photoURL: result.user.photoURL,
                uid: result.user.uid
            };

            const serverURL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

            // Check if user already exists in database
            try {
                const checkUserRes = await axios.get(`${serverURL}/users/${result.user.email}/role`);
                console.log('User already exists:', checkUserRes.data);
            } catch (checkError) {
                if (checkError.response?.status === 404) {
                    // User doesn't exist, create new user
                    console.log('Creating new user...');
                    try {
                        const createUserRes = await axios.post(`${serverURL}/users`, userInfo);
                        console.log('User created in database:', createUserRes.data);
                    } catch (createError) {
                        console.error('Error creating user:', createError);
                        // Don't throw - user might be created but API failed
                    }
                } else {
                    console.error('Error checking user:', checkError);
                }
            }

            // Navigate after authentication
            navigate(location.state?.from?.pathname || '/', { replace: true });
        } catch (error) {
            console.error('Google sign-in error:', error);
            setError(error.message || 'Failed to sign in with Google. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='text-center pb-8'>
            <p className='mb-2'>OR</p>
            {error && <p className='text-red-500 mb-2'>{error}</p>}
            <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="btn bg-white text-black border-[#e5e5e5] disabled:opacity-50"
            >
                {isLoading ? (
                    <>
                        <span className="loading loading-spinner"></span>
                        Signing in...
                    </>
                ) : (
                    <>
                        <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                        Login with Google
                    </>
                )}
            </button>
        </div>
    );
};

export default SocialLogin;