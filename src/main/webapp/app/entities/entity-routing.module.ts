import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'invoice',
        data: { pageTitle: 'storeApp.crmInvoice.home.title' },
        loadChildren: () => import('./crm/invoice/invoice.module').then(m => m.CrmInvoiceModule),
      },
      {
        path: 'customer',
        data: { pageTitle: 'storeApp.crmCustomer.home.title' },
        loadChildren: () => import('./crm/customer/customer.module').then(m => m.CrmCustomerModule),
      },
      {
        path: 'shipment',
        data: { pageTitle: 'storeApp.crmShipment.home.title' },
        loadChildren: () => import('./crm/shipment/shipment.module').then(m => m.CrmShipmentModule),
      },
      {
        path: 'product',
        data: { pageTitle: 'storeApp.crmProduct.home.title' },
        loadChildren: () => import('./crm/product/product.module').then(m => m.CrmProductModule),
      },
      {
        path: 'product-order',
        data: { pageTitle: 'storeApp.crmProductOrder.home.title' },
        loadChildren: () => import('./crm/product-order/product-order.module').then(m => m.CrmProductOrderModule),
      },
      {
        path: 'order-item',
        data: { pageTitle: 'storeApp.crmOrderItem.home.title' },
        loadChildren: () => import('./crm/order-item/order-item.module').then(m => m.CrmOrderItemModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
