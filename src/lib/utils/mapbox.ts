import mapboxgl from 'mapbox-gl';

declare const MAPBOX_ACCESS_TOKEN: string;

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

export const key = Symbol('mapbox');

export { mapboxgl as mapbox };
