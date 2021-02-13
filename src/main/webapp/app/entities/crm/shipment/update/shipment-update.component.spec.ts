jest.mock('@angular/router');

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ShipmentService } from '../service/shipment.service';
import { Shipment } from '../shipment.model';
import { Invoice } from 'app/entities/crm/invoice/invoice.model';

import { ShipmentUpdateComponent } from './shipment-update.component';

describe('Component Tests', () => {
  describe('Shipment Management Update Component', () => {
    let comp: ShipmentUpdateComponent;
    let fixture: ComponentFixture<ShipmentUpdateComponent>;
    let service: ShipmentService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ShipmentUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ShipmentUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ShipmentUpdateComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ShipmentService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Shipment(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new Shipment();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
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
