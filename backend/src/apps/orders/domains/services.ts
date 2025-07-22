import { eq } from 'drizzle-orm';

import { CreateOrderDataSchema } from '@/apps/orders/domains/schemas';
import { TransactionEntityNotFound } from '@/lib/custom-errors/database-error';
import db from '@/lib/db';
import { orders as ordersTable } from '@/lib/db/schema/orders';
import { ordersData as ordersDataTable } from '@/lib/db/schema/orders-data';
import { payments as paymentsTable } from '@/lib/db/schema/payments';
import { products as productsTable } from '@/lib/db/schema/products';
import { generateAdditionalPrice, generateShortUUID } from '@/lib/utils';

export const createOrder = async (productCode: string) => {
  const [product] = await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      price: productsTable.price,
      discountPrice: productsTable.discountPrice,
      code: productsTable.code,
      type: productsTable.type,
    })
    .from(productsTable)
    .where(eq(productsTable.code, productCode));

  if (!product) {
    throw new TransactionEntityNotFound(
      'Products',
      productCode,
      'Select product on create order',
    );
  }

  const productPrice =
    product.discountPrice > 0 ? product.discountPrice : product.price;
  const orderReference = generateShortUUID();
  const additionalPrice = generateAdditionalPrice(productPrice);

  const createOrder = await db.transaction(async (tx) => {
    const [createdOrder] = await tx
      .insert(ordersTable)
      .values({
        productId: product.id,
        orderReference,
        additionalPrice,
      })
      .returning();

    if (!createdOrder) {
      throw new TransactionEntityNotFound('Orders', '', 'Create order');
    }

    const [createdPayment] = await tx
      .insert(paymentsTable)
      .values({
        orderId: createdOrder.id,
        amount: productPrice + createdOrder.additionalPrice,
      })
      .returning({
        amount: paymentsTable.amount,
      });

    if (!createdPayment) {
      throw new TransactionEntityNotFound(
        'Payments',
        '',
        'Create payment on create order',
      );
    }

    return {
      orderId: createdOrder.id,
      orderReference: createdOrder.orderReference,
      additionalPrice: createdOrder.additionalPrice,
      totalPrice: createdPayment.amount,
      orderedAt: createdOrder.orderedAt,
    };
  });

  return {
    orderId: createOrder.orderId,
    orderReference: createOrder.orderReference,
    productName: product.name,
    productCode: product.code,
    productType: product.type,
    additionalPrice: createOrder.additionalPrice,
    totalPrice: createOrder.totalPrice,
    orderedAt: createOrder.orderedAt,
  };
};

export const createOrderData = ({
  orderId,
  nickname,
  accountId,
  loginMethod,
  email,
  password,
  heroesRequest,
}: CreateOrderDataSchema) =>
  db.transaction(async (tx) => {
    if (!orderId) {
      throw new TransactionEntityNotFound(
        'OrdersData',
        0,
        'There is no order id',
      );
    }

    const [order] = await tx
      .select({ id: ordersTable.id })
      .from(ordersTable)
      .where(eq(ordersTable.id, orderId));

    if (!order) {
      throw new TransactionEntityNotFound(
        'Orders',
        orderId,
        'Select order on create order data',
      );
    }

    const [createdOrderData] = await tx
      .insert(ordersDataTable)
      .values({
        orderId: order.id,
        nickname,
        accountId,
        loginMethod,
        email,
        password,
        heroesRequest,
      })
      .returning({
        orderId: ordersDataTable.orderId,
      });

    if (!createdOrderData) {
      throw new TransactionEntityNotFound(
        'OrdersData',
        0,
        'Failed to create order data',
      );
    }

    return createdOrderData;
  });
