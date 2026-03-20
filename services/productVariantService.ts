import ProductVariant from '../models/ProductVariant';
import Product from '../models/Product';
import mongoose from 'mongoose';
import { IProductVariant } from '../types/ProductVariant';
import { IProduct } from '../types/Product';

export interface ProductVariantResponse {
  _id: string;
  product: { _id: string; title: string; price: number } | string;
  size: string;
  color: string;
  sku: string;
  stock: number;
  extraPrice: number;
}

export interface CreateProductVariantData {
  product: string;
  size: string;
  color: string;
  sku: string;
  stock?: number;
  extraPrice?: number;
}

export interface UpdateProductVariantData {
  size?: string;
  color?: string;
  sku?: string;
  stock?: number;
  extraPrice?: number;
}

const convertVariant = (variant: IProductVariant, populatedProduct?: IProduct): ProductVariantResponse => {
  const product = populatedProduct || (variant.product as unknown);

  let productInfo: { _id: string; title: string; price: number } | string;
  if (product && typeof product === 'object' && '_id' in (product as Record<string, unknown>)) {
    const p = product as IProduct;
    productInfo = { _id: p._id.toString(), title: p.title, price: p.price };
  } else {
    productInfo = variant.product.toString();
  }

  return {
    _id: variant._id.toString(),
    product: productInfo,
    size: variant.size,
    color: variant.color,
    sku: variant.sku,
    stock: variant.stock,
    extraPrice: variant.extraPrice,
  };
};

export const getProductVariants = async (productId?: string): Promise<ProductVariantResponse[]> => {
  const filter = productId ? { product: productId } : {};
  const variants = await ProductVariant.find(filter).populate('product', 'title price');

  return variants.map(variant => convertVariant(variant));
};

export const getProductVariantById = async (id: string): Promise<ProductVariantResponse | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid product variant ID');
  }

  const variant = await ProductVariant.findById(id).populate('product', 'title price');
  if (!variant) return null;

  return convertVariant(variant);
};

export const createProductVariant = async (data: CreateProductVariantData): Promise<ProductVariantResponse> => {
  const { product, size, color, sku, stock = 0, extraPrice = 0 } = data;

  // Validate product
  if (!product || !mongoose.Types.ObjectId.isValid(product)) {
    throw new Error('Invalid product ID');
  }

  const productExists = await Product.findById(product);
  if (!productExists) {
    throw new Error('Product not found');
  }

  // Validate required fields
  if (!size) throw new Error('Size is required');
  if (!color) throw new Error('Color is required');
  if (!sku || !sku.trim()) throw new Error('SKU is required');

  // Validate enums
  if (!['S', 'M', 'L'].includes(size)) {
    throw new Error('Size must be one of: S, M, L');
  }
  if (!['Red', 'Black'].includes(color)) {
    throw new Error('Color must be one of: Red, Black');
  }

  // Check SKU uniqueness
  const existingSku = await ProductVariant.findOne({ sku: sku.trim() });
  if (existingSku) {
    throw new Error('A variant with this SKU already exists');
  }

  // Check duplicate variant (same product + size + color)
  const existingVariant = await ProductVariant.findOne({ product, size, color });
  if (existingVariant) {
    throw new Error('A variant with this size and color already exists for this product');
  }

  const variant = new ProductVariant({
    product,
    size,
    color,
    sku: sku.trim(),
    stock,
    extraPrice,
  });

  await variant.save();

  const populated = await ProductVariant.findById(variant._id).populate('product', 'title price');
  return convertVariant(populated!);
};

export const updateProductVariant = async (id: string, data: UpdateProductVariantData): Promise<ProductVariantResponse> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid product variant ID');
  }

  const variant = await ProductVariant.findById(id);
  if (!variant) {
    throw new Error('Product variant not found');
  }

  if (data.size !== undefined) {
    if (!['S', 'M', 'L'].includes(data.size)) {
      throw new Error('Size must be one of: S, M, L');
    }
    variant.size = data.size as IProductVariant['size'];
  }

  if (data.color !== undefined) {
    if (!['Red', 'Black'].includes(data.color)) {
      throw new Error('Color must be one of: Red, Black');
    }
    variant.color = data.color as IProductVariant['color'];
  }

  if (data.sku !== undefined) {
    if (!data.sku.trim()) throw new Error('SKU cannot be empty');
    const existingSku = await ProductVariant.findOne({ sku: data.sku.trim(), _id: { $ne: id } });
    if (existingSku) throw new Error('A variant with this SKU already exists');
    variant.sku = data.sku.trim();
  }

  if (data.stock !== undefined) {
    if (data.stock < 0) throw new Error('Stock cannot be negative');
    variant.stock = data.stock;
  }

  if (data.extraPrice !== undefined) {
    if (data.extraPrice < 0) throw new Error('Extra price cannot be negative');
    variant.extraPrice = data.extraPrice;
  }

  await variant.save();

  const populated = await ProductVariant.findById(variant._id).populate('product', 'title price');
  return convertVariant(populated!);
};

export const deleteProductVariant = async (id: string): Promise<void> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid product variant ID');
  }

  const variant = await ProductVariant.findById(id);
  if (!variant) {
    throw new Error('Product variant not found');
  }

  await ProductVariant.findByIdAndDelete(id);
};
