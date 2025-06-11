"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useAuthStore } from "../../stores/authStore";
import Loading from "../../components/Loading/Loading";

const CallbackPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const setToken = useAuthStore(state => state.setToken);

    useEffect(() => {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const spotifyError = searchParams.get('error');
        const error_description = searchParams.get('error_description');

        const getToken = async () => {
            if (spotifyError) {
                setLoading(false);
                setError(`Spotify authentication error: ${error_description || spotifyError}`);
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
                return;
            }

            if (code) {
                try {
                    const response = await axios.post('http://localhost:9876/auth/callback', {
                        code: code,
                        state: state,
                        redirectUri: 'http://localhost:3001/callback'
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    const { accessToken, tokenExpiry } = response.data;
                    setToken(accessToken, tokenExpiry);
                    router.push('/');
                    
                } catch (error) {
                    console.error('Error exchanging code for token with backend:', error.response?.data || error.message);
                    setLoading(false);
                    const backendError = error.response?.data?.message || 'Failed to get tokens from backend.';
                    setError(`Authentication failed: ${backendError}`);
                    setTimeout(() => {
                        router.push('/login');
                    }, 3000);
                }
            } else {
                setLoading(false);
                setError('No authorization code found in URL.');
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            }
        };

        getToken();
        
    }, [searchParams, router, setToken]);

    if (loading) return <Loading />;
    if (error) return <div>{error}</div>;
    
    return null;
};

export default CallbackPage;