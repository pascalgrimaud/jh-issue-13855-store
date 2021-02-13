import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ConfigService } from '../config/config.service';
import { Logout } from 'app/login/logout.model';

@Injectable({ providedIn: 'root' })
export class AuthServerProvider {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  logout(): Observable<Logout> {
    return this.http.post<Logout>(this.configService.getEndpointFor('api/logout'), {});
  }
}
