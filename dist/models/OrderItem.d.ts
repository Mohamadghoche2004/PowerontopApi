import mongoose from 'mongoose';
import { IOrderItem } from '../types/OrderItem';
declare const OrderItem: mongoose.Model<IOrderItem, {}, {}, {}, mongoose.Document<unknown, {}, IOrderItem, {}, mongoose.DefaultSchemaOptions> & IOrderItem & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IOrderItem>;
export default OrderItem;
//# sourceMappingURL=OrderItem.d.ts.map