export interface MappedVenue {
  id: string;
  images: S3Object[];
  name: string;
}

/* ---------------- VenueResponse --------------- */
export interface VenueResponse {
  venues: VenuesClass;
}

export interface VenuesClass {
  edges: Edge[];
}

export interface Edge {
  node: Node;
}

export interface Node {
  id: string;
  images: S3Object[];
  name: string;
}

export interface S3Object {
  bucketName: string;
  displayName: string;
  key: string;
  type: string;
  url: string;
}
