import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ConfigService } from 'app/core/config/config.service';
import { LoggersResponse, Level } from './log.model';

@Injectable({ providedIn: 'root' })
export class LogsService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  changeLevel(name: string, configuredLevel: Level): Observable<{}> {
    return this.http.post(this.configService.getEndpointFor('management/loggers/' + name), { configuredLevel });
  }

  findAll(): Observable<LoggersResponse> {
    return this.http.get<LoggersResponse>(this.configService.getEndpointFor('management/loggers'));
  }
}
