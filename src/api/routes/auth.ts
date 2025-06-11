import express, { Router, Request, Response } from 'express';
import { randomBytes } from 'crypto';
import { loadPreferences, savePreferences, clearPreferences } from '../utils/utils';
import axios from 'axios';
import dotenv from 'dotenv'

dotenv.config();

const router: Router = express.Router();

const generateRandomState = (): string => {
  return randomBytes(16)
    .toString('base64')
    .replace(/[+/=]/g, '')
    .substring(0, 16);
}

router.get('/login', (req: Request, res: Response) => {
    try {
        const clientId = process.env.SPOTIFY_CLIENT_ID;
        
        if (!clientId) {
            return res.status(500).json({ 
                error: 'Spotify client ID not configured' 
            });
        }

        const redirectUri = 'http://localhost:3001/callback';
        const state = generateRandomState();

        const scopeList: string[] = [
            'user-read-private',
            'user-read-email',
            'user-modify-playback-state',
            'streaming',
            'user-read-playback-state',
            'user-library-read',
            'playlist-read-private',
            'playlist-read-collaborative',
            'user-top-read',
            'user-library-modify',
        ];

        const scope = scopeList.join(' ');

        const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}`;

        res.json({ authUrl, state });

    } catch (error) {
        console.error('Failed to initiate Spotify authentication:', error);
        res.status(500).json({ 
            error: 'Failed to initiate authentication' 
        });
    }
});

router.post('/callback', async (req: Request, res: Response) => {
    console.log('handle_spotify_callback');

    try {
        const { code, state, redirectUri } = req.body;
        
        if (!code || !state) {
            console.log('Authorization failed. No code found.');
            return res.status(400).json({ 
                error: 'Authorization failed. No code found.' 
            });
        }
        
        console.log('code:', code);        
        const grantType = 'authorization_code';
        
        const clientId = process.env.SPOTIFY_CLIENT_ID;
        const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
        
        if (!clientId || !clientSecret) {
        throw new Error('Spotify credentials not found in environment variables');
        }
        
        const tokenRequestData = new URLSearchParams({
            code: code as string,
            redirect_uri: redirectUri,
            grant_type: grantType,
        });
        
        // Create Basic Auth header
        const credentials = `${clientId}:${clientSecret}`;
        const encodedCredentials = Buffer.from(credentials).toString('base64');
        const authorization = `Basic ${encodedCredentials}`;
        
        console.log('auth:', authorization, tokenRequestData);
        
        // Request access token from Spotify
        const tokenResponse = await axios.post('https://accounts.spotify.com/api/token',
            tokenRequestData,
            {
                headers: {
                'Authorization': authorization,
                'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        
        const tokenData = tokenResponse.data;
        console.log('Token data:', tokenData);
        
        // Load and update preferences
        let preferences = await loadPreferences();
        preferences.refreshToken = tokenData.refresh_token;
        
        // Save updated preferences
        await savePreferences(preferences);

        console.log("DATAAAA", tokenData)

        res.send({
            message: 'Authorization successful',
            accessToken: tokenData.access_token,
            tokenExpiry: Date.now() +tokenData.expires_in * 1000,
            logged: true,
        });

        // res.send('<script>window.close();</script>');
        console.log('Authorization success.');
        
    } catch (error) {
        console.error('Spotify callback error:', error);
        
        if (axios.isAxiosError(error)) {
            console.error('Spotify API error:', error.response?.data);

            return res.status(400).json({
                error: 'Failed to exchange code for token',
                details: error.response?.data || error.message,
            });
        }
        
        res.status(500).json({
            error: 'Internal server error during authorization',
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

router.get('/refresh', async (req: Request, res: Response) => {
    try {
        console.log('refreshing token');
        
        const url = 'https://accounts.spotify.com/api/token';
        const clientId = process.env.SPOTIFY_CLIENT_ID;
        const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
        
        if (!clientId || !clientSecret) {
        res.status(500).json({ error: 'SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET not found in environment variables' });
        return;
        }
        
        const loadedPreferences = loadPreferences();
        const storedRefreshToken = loadedPreferences.refresh_token;
        
        // console.log('refresh token from store', storedRefreshToken || 'no refresh token');
        
        const refreshTokenValue = storedRefreshToken || 'No token available';
        
        if (!storedRefreshToken) {
            res.status(400).json({ error: 'No refresh token available' });
            return;
        }
        
        // Prepare form data
        const params = new URLSearchParams();
        params.append('grant_type', 'refresh_token');
        params.append('refresh_token', refreshTokenValue);
        params.append('client_id', clientId);
        
        // Create basic auth credentials
        const credentials = `${clientId}:${clientSecret}`;
        const encoded = Buffer.from(credentials).toString('base64');
        const authorization = `Basic ${encoded}`;
        
        // Make the HTTP request
        const response = await axios.post(url, params, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': authorization,
        },
        });
        
        // console.log('Refreshed Json:', response.data);
        
        const accessToken = response.data.access_token;
        console.log("ACESSSSSSSSSSSS", accessToken)
        
        if (!accessToken) {
            res.status(500).json({ error: 'Token not found in response' });
            return;
        }
        
        // Return the access token
        res.send(accessToken);
        
    } catch (error) {
        console.error('Error refreshing token:', error);
        res.status(500).json({ error: 'Failed to refresh token' });
    }
})

router.post('/logout', async (req: Request, res: Response) => {
    try {
        clearPreferences();

        res.status(200).json({
            message: 'Logout successful',
        })

    } catch (error) {
        res.status(500).json({
            error: 'Internal server error during logout',
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
})



export default router;