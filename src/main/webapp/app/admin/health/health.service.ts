import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ConfigService } from 'app/core/config/config.service';
import { Health } from './health.model';

@Injectable({ providedIn: 'root' })
export class HealthService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  checkHealth(): Observable<Health> {
    return this.http.get<Health>(this.configService.getEndpointFor('management/health'));
  }
}
