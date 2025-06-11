export type CheckSavedTracksRequest = {
  access_token: string;
  ids: string[];
}

export type CheckSavedTracksQuery = {
  access_token?: string;
  ids?: string;
}
