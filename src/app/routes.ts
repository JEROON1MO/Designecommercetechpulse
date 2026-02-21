import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { CategoryPage } from "./pages/CategoryPage";
import { ProductPage } from "./pages/ProductPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { OrderConfirmation } from "./pages/OrderConfirmation";
import { WishlistPage } from "./pages/WishlistPage";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "categoria/:slug", Component: CategoryPage },
      { path: "produto/:id", Component: ProductPage },
      { path: "carrinho", Component: CartPage },
      { path: "checkout", Component: CheckoutPage },
      { path: "confirmacao", Component: OrderConfirmation },
      { path: "favoritos", Component: WishlistPage },
      { path: "*", Component: NotFound },
    ],
  },
]);
