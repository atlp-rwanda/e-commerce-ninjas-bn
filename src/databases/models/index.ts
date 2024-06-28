import CartProducts from "./cartProducts";
import Carts from "./carts";
import Products from "./products";
import Shops from "./shops";
import Users from "./users";
import Orders from "./orders";
import Sessions from "./sessions";
import Chats from "./chats";
import wishLists from "./wishLists";
import Notifications from "./notifications";
import ProductReviews from "./productReviews";

const db = {
  CartProducts,
  Carts,
  Products,
  Shops,
  Users,
  Orders,
  Sessions,
  Chats,
  wishLists,
  Notifications,
  ProductReviews
};

Object.values(db).forEach(model => {
  if (model.associate) {
    // @ts-expect-error: Model association method expects a different type signature
    model.associate(db);
  }
});

export default db;