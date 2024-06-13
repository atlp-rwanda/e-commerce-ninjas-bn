import CartProducts from "./cartProducts";
import Carts from "./carts";
import Products from "./products";
import Shops from "./shops";
import Users from "./users";
import Orders from "./orders";
import Sessions from "./sessions";

const db = {
  CartProducts,
  Carts,
  Products,
  Shops,
  Users,
  Orders,
  Sessions
};

Object.values(db).forEach(model => {
  if (model.associate) {
    // @ts-expect-error: Model association method expects a different type signature
    model.associate(db);
  }
});

export default db;