import * as dayjs from 'dayjs';
import { IOrderItem } from 'app/entities/crm/order-item/order-item.model';
import { ICustomer } from 'app/entities/crm/customer/customer.model';
import { OrderStatus } from 'app/entities/enumerations/order-status.model';

export interface IProductOrder {
  id?: number;
  placedDate?: dayjs.Dayjs;
  status?: OrderStatus;
  code?: string;
  invoiceId?: string | null;
  orderItems?: IOrderItem[] | null;
  customer?: ICustomer;
}

export class ProductOrder implements IProductOrder {
  constructor(
    public id?: number,
    public placedDate?: dayjs.Dayjs,
    public status?: OrderStatus,
    public code?: string,
    public invoiceId?: string | null,
    public orderItems?: IOrderItem[] | null,
    public customer?: ICustomer
  ) {}
}
