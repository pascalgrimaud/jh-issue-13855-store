import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ConfigService } from 'app/core/config/config.service';
import { GatewayRoute } from './gateway-route.model';

@Injectable()
export class GatewayRoutesService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  findAll(): Observable<GatewayRoute[]> {
    return this.http.get<GatewayRoute[]>(this.configService.getEndpointFor('api/gateway/routes/'));
  }
}
