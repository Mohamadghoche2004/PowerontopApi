import mongoose from 'mongoose';
import { IProductVariant } from '../types/ProductVariant';
declare const ProductVariant: mongoose.Model<IProductVariant, {}, {}, {}, mongoose.Document<unknown, {}, IProductVariant, {}, mongoose.DefaultSchemaOptions> & IProductVariant & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IProductVariant>;
export default ProductVariant;
//# sourceMappingURL=ProductVariant.d.ts.map