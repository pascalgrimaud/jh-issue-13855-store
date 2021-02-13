jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IShipment, Shipment } from '../shipment.model';
import { ShipmentService } from '../service/shipment.service';

import { ShipmentRoutingResolveService } from './shipment-routing-resolve.service';

describe('Service Tests', () => {
  describe('Shipment routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ShipmentRoutingResolveService;
    let service: ShipmentService;
    let resultShipment: IShipment | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ShipmentRoutingResolveService);
      service = TestBed.inject(ShipmentService);
      resultShipment = undefined;
    });

    describe('resolve', () => {
      it('should return existing IShipment for existing id', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: new Shipment(id) })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultShipment = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultShipment).toEqual(new Shipment(123));
      });

      it('should return new IShipment if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultShipment = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultShipment).toEqual(new Shipment());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultShipment = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultShipment).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
