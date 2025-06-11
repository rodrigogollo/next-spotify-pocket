import express, { Router, Request, Response } from 'express';
import axios from 'axios';
import { CheckSavedTracksQuery } from '../types/spotify';

const router: Router = express.Router();

router.post('/tracks', async (req: Request, res: Response) => {  
    try {
        const { access_token, ids } = req.query as CheckSavedTracksQuery;
        
        // Validate required parameters
        if (!access_token) {
            return res.status(400).json({
                error: 'Missing access_token parameter'
            });
        }
        
        if (!ids) {
            return res.status(400).json({
                error: 'Missing ids parameter'
            });
        }
        
        // Parse ids (expecting comma-separated string or array)
        let trackIds: string[];
        if (typeof ids === 'string') {
            trackIds = ids.split(',').map(id => id.trim()).filter(id => id.length > 0);
        } else {
            trackIds = Array.isArray(ids) ? ids : [ids];
        }
        
        // Validate track IDs
        if (trackIds.length === 0) {
            return res.status(400).json({
                error: 'No valid track IDs provided'
            });
        }
        
        // Spotify API allows max 50 IDs per request
        if (trackIds.length > 50) {
            return res.status(400).json({
                error: 'Maximum 50 track IDs allowed per request'
            });
        }
        
        const url = 'https://api.spotify.com/v1/me/tracks/contains';
        const authorization = `Bearer ${access_token}`;
        
        const response = await axios.get(url, {
        headers: {
            'Authorization': authorization,
            'Content-Type': 'application/json',
        },
        params: {
            ids: trackIds.join(','),
        },
        });
        
        res.json(response.data);
        
    } catch (error) {
        console.error('Check saved tracks error:', error);
        
        if (axios.isAxiosError(error)) {
        const status = error.response?.status || 500;
        const errorData = error.response?.data;
        
        // Handle specific Spotify API errors
        if (status === 401) {
            return res.status(401).json({
                error: 'Invalid or expired access token',
                details: errorData
            });
        }
        
        if (status === 403) {
            return res.status(403).json({
                error: 'Insufficient permissions. Required scope: user-library-read',
                details: errorData
            });
        }
        
        if (status === 429) {
            return res.status(429).json({
                error: 'Rate limit exceeded. Please try again later.',
                details: errorData
            });
        }
        
        return res.status(status).json({
            error: 'Spotify API error',
            details: errorData || error.message
        });
        }
        
        res.status(500).json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default router;