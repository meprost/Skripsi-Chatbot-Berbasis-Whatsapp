import { asc, desc, eq, SQL } from 'drizzle-orm';

import {
  CreateProductSchema,
  DeleteProductQuerySchema,
  GetProductQuerySchema,
  UpdateProductSchema,
} from '@/apps/products/domain/schemas';
import {
  DatabaseError,
  TransactionEntityNotFound,
} from '@/lib/custom-errors/database-error';
import db from '@/lib/db';
import { products as productsTable } from '@/lib/db/schema/products';

export const getProductsTransaction = (queryParams: GetProductQuerySchema) => {
  const { productCode, productId, productType, sort } = queryParams;

  let whereFilter: SQL | undefined = undefined;
  let orderByFilter: SQL;

  if (productId) {
    whereFilter = eq(productsTable.id, productId);
  }

  if (productCode) {
    whereFilter = eq(productsTable.code, productCode);
  }

  if (productType) {
    whereFilter = eq(productsTable.type, productType);
  }

  if (sort) {
    if (sort === 'asc') {
      orderByFilter = asc(productsTable.id);
    } else if (sort === 'desc') {
      orderByFilter = desc(productsTable.id);
    }
  }

  return db.transaction(async (tx) => {
    const products = await tx
      .select()
      .from(productsTable)
      .where(whereFilter)
      .orderBy(orderByFilter);

    if (!products || products.length === 0) {
      throw new TransactionEntityNotFound(
        'Products',
        `${productCode ?? productId}`,
        'Select Product',
      );
    }

    return products;
  });
};

export const createProductTransaction = (product: CreateProductSchema) =>
  db.transaction(async (tx) => {
    const [createdProduct] = await tx
      .insert(productsTable)
      .values(product)
      .returning({
        name: productsTable.name,
        price: productsTable.price,
        discountPrice: productsTable.discountPrice,
        code: productsTable.code,
        type: productsTable.type,
        logo: productsTable.logo,
      });

    if (!createdProduct) {
      throw new DatabaseError('Failed To Create Product');
    }

    return createdProduct;
  });

export const updateProductTransaction = (
  productCode: string,
  productFields: UpdateProductSchema,
) =>
  db.transaction(async (tx) => {
    const [searchProductCode] = await tx
      .select({
        id: productsTable.id,
      })
      .from(productsTable)
      .where(eq(productsTable.code, productCode));

    if (!searchProductCode) {
      throw new TransactionEntityNotFound(
        'Products',
        productCode,
        'Update Product',
      );
    }

    const [updatedProduct] = await tx
      .update(productsTable)
      .set({
        name: productFields.name,
        price: productFields.price,
        discountPrice: productFields.discountPrice,
        code: productFields.code,
        type: productFields.type,
        logo: productFields.logo,
      })
      .where(eq(productsTable.code, productCode))
      .returning({
        name: productsTable.name,
        price: productsTable.price,
        discountPrice: productsTable.discountPrice,
        code: productsTable.code,
        type: productsTable.type,
        logo: productsTable.logo,
      });

    if (!updatedProduct) {
      throw new DatabaseError('Failed To Update Product');
    }

    return updatedProduct;
  });

export const deleteProductTransaction = ({
  productCode,
}: DeleteProductQuerySchema) =>
  db.transaction(async (tx) => {
    if (!productCode) {
      throw new TransactionEntityNotFound(
        'Products',
        0,
        'Please provide either productCode or productId',
      );
    }

    const [searchProductCode] = await tx
      .select({
        id: productsTable.id,
      })
      .from(productsTable)
      .where(eq(productsTable.code, productCode));

    if (!searchProductCode) {
      throw new TransactionEntityNotFound(
        'Products',
        productCode,
        'Delete Product',
      );
    }

    const [deletedProduct] = await tx
      .delete(productsTable)
      .where(eq(productsTable.code, productCode))
      .returning({ code: productsTable.code });

    if (!deletedProduct) {
      throw new DatabaseError('Failed To Delete Product');
    }

    return deletedProduct;
  });
