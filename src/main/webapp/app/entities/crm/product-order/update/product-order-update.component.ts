import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IProductOrder, ProductOrder } from '../product-order.model';
import { ProductOrderService } from '../service/product-order.service';
import { ICustomer } from 'app/entities/crm/customer/customer.model';
import { CustomerService } from 'app/entities/crm/customer/service/customer.service';

@Component({
  selector: 'jhi-product-order-update',
  templateUrl: './product-order-update.component.html',
})
export class ProductOrderUpdateComponent implements OnInit {
  isSaving = false;
  customers: ICustomer[] = [];

  editForm = this.fb.group({
    id: [],
    placedDate: [null, [Validators.required]],
    status: [null, [Validators.required]],
    code: [null, [Validators.required]],
    invoiceId: [],
    customer: [null, Validators.required],
  });

  constructor(
    protected productOrderService: ProductOrderService,
    protected customerService: CustomerService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productOrder }) => {
      if (productOrder.id === undefined) {
        const today = dayjs().startOf('day');
        productOrder.placedDate = today;
      }

      this.updateForm(productOrder);

      this.customerService.query().subscribe((res: HttpResponse<ICustomer[]>) => (this.customers = res.body ?? []));
    });
  }

  updateForm(productOrder: IProductOrder): void {
    this.editForm.patchValue({
      id: productOrder.id,
      placedDate: productOrder.placedDate ? productOrder.placedDate.format(DATE_TIME_FORMAT) : null,
      status: productOrder.status,
      code: productOrder.code,
      invoiceId: productOrder.invoiceId,
      customer: productOrder.customer,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const productOrder = this.createFromForm();
    if (productOrder.id !== undefined) {
      this.subscribeToSaveResponse(this.productOrderService.update(productOrder));
    } else {
      this.subscribeToSaveResponse(this.productOrderService.create(productOrder));
    }
  }

  private createFromForm(): IProductOrder {
    return {
      ...new ProductOrder(),
      id: this.editForm.get(['id'])!.value,
      placedDate: this.editForm.get(['placedDate'])!.value ? dayjs(this.editForm.get(['placedDate'])!.value, DATE_TIME_FORMAT) : undefined,
      status: this.editForm.get(['status'])!.value,
      code: this.editForm.get(['code'])!.value,
      invoiceId: this.editForm.get(['invoiceId'])!.value,
      customer: this.editForm.get(['customer'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductOrder>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackCustomerById(index: number, item: ICustomer): number {
    return item.id!;
  }
}
