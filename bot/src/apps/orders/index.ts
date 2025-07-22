import { CreateOrderDataBodySchema, orderSchema } from '@/apps/orders/shemas';
import { backendApi } from '@/lib/api';

export const createOrder = async (productCode: string) => {
  const response = await backendApi.post('/order', {
    productCode,
  });
  if (!response.data.success) {
    throw new Error('Fetch Create Order Failed');
  }

  const parseOrder = orderSchema.safeParse(response.data.data);
  if (!parseOrder.success) {
    throw new Error('Parse Order Response Failed');
  }

  return parseOrder.data;
};

export const createOrderData = async (orderData: CreateOrderDataBodySchema) => {
  const response = await backendApi.post('/order/data', orderData);
  if (!response.data.success) {
    throw new Error('Fetch Create Order Data Failed');
  }
};
