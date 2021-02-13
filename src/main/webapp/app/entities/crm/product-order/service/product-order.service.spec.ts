import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { OrderStatus } from 'app/entities/enumerations/order-status.model';
import { IProductOrder, ProductOrder } from '../product-order.model';

import { ProductOrderService } from './product-order.service';

describe('Service Tests', () => {
  describe('ProductOrder Service', () => {
    let service: ProductOrderService;
    let httpMock: HttpTestingController;
    let elemDefault: IProductOrder;
    let expectedResult: IProductOrder | IProductOrder[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ProductOrderService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = new ProductOrder(0, currentDate, OrderStatus.COMPLETED, 'AAAAAAA', 'AAAAAAA');
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            placedDate: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a ProductOrder', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            placedDate: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            placedDate: currentDate,
          },
          returnedFromService
        );

        service.create(new ProductOrder()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a ProductOrder', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            placedDate: currentDate.format(DATE_TIME_FORMAT),
            status: 'BBBBBB',
            code: 'BBBBBB',
            invoiceId: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            placedDate: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of ProductOrder', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            placedDate: currentDate.format(DATE_TIME_FORMAT),
            status: 'BBBBBB',
            code: 'BBBBBB',
            invoiceId: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            placedDate: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a ProductOrder', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
