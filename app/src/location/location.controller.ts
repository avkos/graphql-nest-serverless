import {Controller, Get, Query} from '@nestjs/common';
import {LocationService} from "./location.service";

@Controller('location')
export class LocationController {
    constructor(private readonly locationService: LocationService) {}
    @Get()
    getLocation(@Query('address') address: string): Promise<any> {
        return this.locationService.getLocation(address)
    }
}
