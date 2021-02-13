import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ConfigService } from 'app/core/config/config.service';
import { Metrics, ThreadDump } from './metrics.model';

@Injectable({ providedIn: 'root' })
export class MetricsService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  getMetrics(): Observable<Metrics> {
    return this.http.get<Metrics>(this.configService.getEndpointFor('management/jhimetrics'));
  }

  threadDump(): Observable<ThreadDump> {
    return this.http.get<ThreadDump>(this.configService.getEndpointFor('management/threaddump'));
  }
}
