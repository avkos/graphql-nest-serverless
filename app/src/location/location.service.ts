import {Injectable} from '@nestjs/common';
import * as MapboxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';

@Injectable()
export class LocationService {
    private client: MapboxGeocoding

    constructor() {
        this.client = MapboxGeocoding({accessToken: process.env.MAPBOX_TOKEN});
    }

    getLocation(query: string): Promise<any> {
        return this.client.forwardGeocode({query, limit: 1}).send().then(function (res) {
            // res is the http response, including: status, headers and entity properties
            const [lng, lat] = (res.body && res.body.features && res.body.features[0] && res.body.features[0].center) || [undefined, undefined]
            if (lat === undefined) {
                return 'Not found'
            }
            return {lat, lng}
        })
            .catch(function (err) {
                // handle errors
                console.error('getLocation error', err)
            });
    }
}
