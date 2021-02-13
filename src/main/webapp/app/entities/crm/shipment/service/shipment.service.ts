import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ConfigService } from 'app/core/config/config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IShipment, getShipmentIdentifier } from '../shipment.model';

export type EntityResponseType = HttpResponse<IShipment>;
export type EntityArrayResponseType = HttpResponse<IShipment[]>;

@Injectable({ providedIn: 'root' })
export class ShipmentService {
  public resourceUrl = this.configService.getEndpointFor('api/shipments', 'crm');

  constructor(protected http: HttpClient, private configService: ConfigService) {}

  create(shipment: IShipment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(shipment);
    return this.http
      .post<IShipment>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(shipment: IShipment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(shipment);
    return this.http
      .put<IShipment>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IShipment>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IShipment[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addShipmentToCollectionIfMissing(shipmentCollection: IShipment[], ...shipmentsToCheck: (IShipment | null | undefined)[]): IShipment[] {
    const shipments: IShipment[] = shipmentsToCheck.filter(isPresent);
    if (shipments.length > 0) {
      const shipmentCollectionIdentifiers = shipmentCollection.map(shipmentItem => getShipmentIdentifier(shipmentItem)!);
      const shipmentsToAdd = shipments.filter(shipmentItem => {
        const shipmentIdentifier = getShipmentIdentifier(shipmentItem);
        if (shipmentIdentifier == null || shipmentCollectionIdentifiers.includes(shipmentIdentifier)) {
          return false;
        }
        shipmentCollectionIdentifiers.push(shipmentIdentifier);
        return true;
      });
      return [...shipmentsToAdd, ...shipmentCollection];
    }
    return shipmentCollection;
  }

  protected convertDateFromClient(shipment: IShipment): IShipment {
    const copy: IShipment = Object.assign({}, shipment, {
      date: shipment.date?.isValid() ? shipment.date.toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.date = res.body.date ? dayjs(res.body.date) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((shipment: IShipment) => {
        shipment.date = shipment.date ? dayjs(shipment.date) : undefined;
      });
    }
    return res;
  }
}
