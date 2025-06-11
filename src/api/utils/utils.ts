import { UserPreferences } from "../types/auth";
import path from 'path';
import fs from 'fs';

export async function loadPreferences(): Promise<UserPreferences> {
  try {
    const prefsPath = path.join(process.cwd(), 'user-preferences.json');
    const data = fs.readFileSync(prefsPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.log('No existing preferences found, creating new ones');
    return {};
  }
}

export async function savePreferences(preferences: UserPreferences): Promise<void> {
  try {
    const prefsPath = path.join(process.cwd(), 'user-preferences.json');
    fs.writeFileSync(prefsPath, JSON.stringify(preferences, null, 2));
    console.log('Preferences saved successfully');
  } catch (error) {
    console.error('Failed to save preferences:', error);
    throw error;
  }
}

export async function clearPreferences(): Promise<void> {
    try {
        let default_preferences: UserPreferences = {
            refreshToken: undefined
        }

        await savePreferences(default_preferences)
        
        console.log('Preferences cleared successfully');
    } catch (error) {
        console.error('Failed to clear preferences:', error);
        throw error;
    }
}
