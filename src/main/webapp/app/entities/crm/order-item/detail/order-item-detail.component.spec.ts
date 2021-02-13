import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OrderItem } from '../order-item.model';

import { OrderItemDetailComponent } from './order-item-detail.component';

describe('Component Tests', () => {
  describe('OrderItem Management Detail Component', () => {
    let comp: OrderItemDetailComponent;
    let fixture: ComponentFixture<OrderItemDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [OrderItemDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ orderItem: new OrderItem(123) }) },
          },
        ],
      })
        .overrideTemplate(OrderItemDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(OrderItemDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load orderItem on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.orderItem).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
