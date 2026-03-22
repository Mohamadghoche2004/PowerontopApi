import mongoose from 'mongoose';
import { ICart } from '../types/Cart';
declare const Cart: mongoose.Model<ICart, {}, {}, {}, mongoose.Document<unknown, {}, ICart, {}, mongoose.DefaultSchemaOptions> & ICart & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ICart>;
export default Cart;
//# sourceMappingURL=Cart.d.ts.map