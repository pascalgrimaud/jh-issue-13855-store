jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ShipmentService } from '../service/shipment.service';
import { IShipment, Shipment } from '../shipment.model';
import { IInvoice, Invoice } from 'app/entities/crm/invoice/invoice.model';
import { InvoiceService } from 'app/entities/crm/invoice/service/invoice.service';

import { ShipmentUpdateComponent } from './shipment-update.component';

describe('Component Tests', () => {
  describe('Shipment Management Update Component', () => {
    let comp: ShipmentUpdateComponent;
    let fixture: ComponentFixture<ShipmentUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let shipmentService: ShipmentService;
    let invoiceService: InvoiceService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ShipmentUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ShipmentUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ShipmentUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      shipmentService = TestBed.inject(ShipmentService);
      invoiceService = TestBed.inject(InvoiceService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Invoice query and add missing value', () => {
        const shipment: IShipment = { id: 456 };
        const invoice: IInvoice = { id: 15084 };
        shipment.invoice = invoice;

        const invoiceCollection: IInvoice[] = [{ id: 20822 }];
        spyOn(invoiceService, 'query').and.returnValue(of(new HttpResponse({ body: invoiceCollection })));
        const additionalInvoices = [invoice];
        const expectedCollection: IInvoice[] = [...additionalInvoices, ...invoiceCollection];
        spyOn(invoiceService, 'addInvoiceToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ shipment });
        comp.ngOnInit();

        expect(invoiceService.query).toHaveBeenCalled();
        expect(invoiceService.addInvoiceToCollectionIfMissing).toHaveBeenCalledWith(invoiceCollection, ...additionalInvoices);
        expect(comp.invoicesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const shipment: IShipment = { id: 456 };
        const invoice: IInvoice = { id: 64437 };
        shipment.invoice = invoice;

        activatedRoute.data = of({ shipment });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(shipment));
        expect(comp.invoicesSharedCollection).toContain(invoice);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const shipment = new Shipment(123);
        spyOn(shipmentService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ shipment });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: shipment }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(shipmentService.update).toHaveBeenCalledWith(shipment);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const shipment = new Shipment();
        spyOn(shipmentService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ shipment });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: shipment }));
        saveSubject.complete();

        // THEN
        expect(shipmentService.create).toHaveBeenCalledWith(shipment);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const shipment = new Shipment(123);
        spyOn(shipmentService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ shipment });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(shipmentService.update).toHaveBeenCalledWith(shipment);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackInvoiceById', () => {
        it('Should return tracked Invoice primary key', () => {
          const entity = new Invoice(123);
          const trackResult = comp.trackInvoiceById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
