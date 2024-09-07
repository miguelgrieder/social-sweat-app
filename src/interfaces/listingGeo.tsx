export interface ListingGeo {
  type: string;
  geometry: Geometry;
  properties: Properties;
}

interface Properties {
  id: string;
  price: string;
  latitude: number;
  longitude: number;
}

interface Geometry {
  type: string;
  geometry: Geometry;
  properties: Properties;
}
