import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase/firebase.init';
import { AuthContext } from './AuthContext';


const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);

    const registerUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const signInUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password)
    }

    const signInGoogle = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    }

    const logOut = () => {
        setLoading(true);
        // Clear token from localStorage
        localStorage.removeItem('access_token');
        setToken(null);
        return signOut(auth);
    }

    const updateUserProfile = (profile) =>{
        return updateProfile(auth.currentUser, profile)
    }

    // Function to generate JWT token
    const generateToken = async (email, uid) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/jwt`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, uid })
            });

            if (!response.ok) {
                throw new Error('Failed to generate token');
            }

            const data = await response.json();
            
            // Store token in localStorage
            localStorage.setItem('access_token', data.token);
            setToken(data.token);
            
            return data.token;
        } catch (error) {
            console.error('Error generating JWT token:', error);
            throw error;
        }
    }

    // observe user state
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            
            if (currentUser) {
                try {
                    // Generate JWT token for the user
                    await generateToken(currentUser.email, currentUser.uid);
                } catch (error) {
                    console.error('Error generating token on auth state change:', error);
                }
            } else {
                // Clear token when user logs out
                localStorage.removeItem('access_token');
                setToken(null);
            }
            
            setLoading(false);
            console.log(currentUser)
        })
        return () => {
            unSubscribe();
        }
    }, [])

    const authInfo = {
        user,
        loading,
        token,
        registerUser,
        signInUser,
        signInGoogle,
        logOut,
        updateUserProfile,
        generateToken
    }

    return (
        <AuthContext value={authInfo}>
            {children}
        </AuthContext>
    );
};

export default AuthProvider;