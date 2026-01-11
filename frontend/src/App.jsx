import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import RootLayout from "./component/layout/RootLayout";
import LandingLayout from "./component/layout/LandingLayout";
import Home from "./component/home/Home";
import LandingPage from "./component/landingPage/LandingPage";
import BrowseLibrary from "./component/browseLibrary/BrowseLibrary"
import BookDetails from "./component/bookDetailsPage/BookDetails";
import Cart from "./component/cart/Cart";
import Checkout from "./component/checkout/Checkout.jsx";
import Order from "./component/order/Order";
import AddBook from "./component/manage/AddBook"
import BookUpdate from "./component/manage/BookUpdate.jsx";
import UserProfile from "./component/userProfile/UserProfile.jsx";
import ProtectedRoute from "./component/landingPage/ProtectedRoute.jsx"

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
      <Route path='/' element={<LandingLayout />}>
        <Route index element={<LandingPage />} />
      </Route>
      
      <Route element={<RootLayout />}>
        <Route element={
            <ProtectedRoute
              useOutlet={true}
              allowedRoles={["ROLE_ADMIN", "ROLE_USER"]}
            />}>
          <Route path='/home' element={<Home />} />
          <Route path='/library' element={<BrowseLibrary/>} />
          <Route path="/library/books/:title" element={<BookDetails />} />
          <Route path="/user/:userId/cart" element={<Cart />} />
          <Route path="/user/:userId/checkout" element={<Checkout />} />
          <Route path="/user/:userId/my-orders" element={<Order />} />
          <Route path="/user/:userId/my-profile" element={<UserProfile />} />
        </Route>

        <Route element={
            <ProtectedRoute
              useOutlet={true}
              allowedRoles={["ROLE_ADMIN"]}
            />}>
          <Route path="/user/:userId/manage" element={<AddBook />} />
          <Route path="/manage/books/:bookId/edit" element={<BookUpdate />} />
        </Route>
      </Route>
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
