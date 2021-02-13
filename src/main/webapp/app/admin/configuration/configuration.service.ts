import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ConfigService } from 'app/core/config/config.service';
import { Bean, Beans, ConfigProps, Env, PropertySource } from './configuration.model';

@Injectable({ providedIn: 'root' })
export class ConfigurationService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  getBeans(): Observable<Bean[]> {
    return this.http.get<ConfigProps>(this.configService.getEndpointFor('management/configprops')).pipe(
      map(configProps =>
        Object.values(
          Object.values(configProps.contexts)
            .map(context => context.beans)
            .reduce((allBeans: Beans, contextBeans: Beans) => ({ ...allBeans, ...contextBeans }))
        )
      )
    );
  }

  getPropertySources(): Observable<PropertySource[]> {
    return this.http.get<Env>(this.configService.getEndpointFor('management/env')).pipe(map(env => env.propertySources));
  }
}
