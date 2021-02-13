import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ConfigService } from 'app/core/config/config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProductOrder, getProductOrderIdentifier } from '../product-order.model';

export type EntityResponseType = HttpResponse<IProductOrder>;
export type EntityArrayResponseType = HttpResponse<IProductOrder[]>;

@Injectable({ providedIn: 'root' })
export class ProductOrderService {
  public resourceUrl = this.configService.getEndpointFor('api/product-orders', 'crm');

  constructor(protected http: HttpClient, private configService: ConfigService) {}

  create(productOrder: IProductOrder): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productOrder);
    return this.http
      .post<IProductOrder>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(productOrder: IProductOrder): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productOrder);
    return this.http
      .put<IProductOrder>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IProductOrder>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IProductOrder[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addProductOrderToCollectionIfMissing(
    productOrderCollection: IProductOrder[],
    ...productOrdersToCheck: (IProductOrder | null | undefined)[]
  ): IProductOrder[] {
    const productOrders: IProductOrder[] = productOrdersToCheck.filter(isPresent);
    if (productOrders.length > 0) {
      const productOrderCollectionIdentifiers = productOrderCollection.map(
        productOrderItem => getProductOrderIdentifier(productOrderItem)!
      );
      const productOrdersToAdd = productOrders.filter(productOrderItem => {
        const productOrderIdentifier = getProductOrderIdentifier(productOrderItem);
        if (productOrderIdentifier == null || productOrderCollectionIdentifiers.includes(productOrderIdentifier)) {
          return false;
        }
        productOrderCollectionIdentifiers.push(productOrderIdentifier);
        return true;
      });
      return [...productOrdersToAdd, ...productOrderCollection];
    }
    return productOrderCollection;
  }

  protected convertDateFromClient(productOrder: IProductOrder): IProductOrder {
    const copy: IProductOrder = Object.assign({}, productOrder, {
      placedDate: productOrder.placedDate?.isValid() ? productOrder.placedDate.toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.placedDate = res.body.placedDate ? dayjs(res.body.placedDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((productOrder: IProductOrder) => {
        productOrder.placedDate = productOrder.placedDate ? dayjs(productOrder.placedDate) : undefined;
      });
    }
    return res;
  }
}
