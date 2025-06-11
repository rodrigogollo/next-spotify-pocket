export type UserPreferences = {
  refreshToken?: string;
  // Add other preference fields as needed
}

export type SpotifyTokenResponse = {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token?: string;
}

export type AuthPayload = {
  logged: boolean;
  access_token: string;
}