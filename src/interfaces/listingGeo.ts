export interface ListingGeo {
  type: string
  geometry: Geometry
  properties: Properties
}

interface Properties {
  id: string
  price: string
  sport_type: string
  latitude: number
  longitude: number
}

interface Geometry {
  type: string
  geometry: Geometry
  properties: Properties
}
