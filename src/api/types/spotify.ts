export type CheckSavedTracksRequest = {
  access_token: string;
  ids: string[];
}

export type CheckSavedTracksQuery = {
  access_token?: string;
  ids?: string;
}

export interface TransferPlaybackRequest {
  access_token: string;
  device_id: string;
}

export interface SpotifyTransferPayload {
  device_ids: string[];
}