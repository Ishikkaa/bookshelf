import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  getUserCart,
  updateQuantity,
  removeItemFromCart,
} from "../../store/features/CartSlice";
import BookImage from "../utils/BookImage";
import { toast, ToastContainer } from "react-toastify";

const Cart = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const cartId = cart.cartId;
  console.log("cart from jsx: ", cart)

  useEffect(() => {
    if (userId) {
      dispatch(getUserCart(userId));
    }
  }, [dispatch, userId]);

  if (!cart || !Array.isArray(cart.items)) {
    return (
      <div className="cart-page">
        <div className="container py-4 text-center">
          <p>Loading cart...</p>
        </div>
      </div>
    );
  }

  const handleIncreaseQuantity = (bookId) => {
    const item = cart.items.find((i) => i.book.id === bookId);
    if (!item || !cartId) return;

    if (item.quantity >= item.book.inventory) {
      toast.error(`Only ${item.book.inventory} items available`);
      return;
    }

    dispatch(
      updateQuantity({
        cartId,
        bookId,
        newQuantity: item.quantity + 1,
      })
    );
  };

  const handleDecreaseQuantity = (bookId) => {
    const item = cart.items.find((i) => i.book.id === bookId);
    if (!item || item.quantity <= 1 || !cartId) return;

    dispatch(
      updateQuantity({
        cartId,
        bookId,
        newQuantity: item.quantity - 1,
      })
    );
  };

  const handleRemoveItem = (bookId) => {
    if (!cartId) return;

    dispatch(removeItemFromCart({ cartId, bookId }))
      .unwrap()
      .then(() => toast.success("Item removed from cart"))
      .catch((err) => toast.error(err?.message || "Failed to remove item"));
  };

  const handleCheckout = async () => {
    navigate(`/user/${userId}/checkout`);
  }

  return (
    <div className="cart-page">
      <ToastContainer />
      <div className="container py-4">
        <h2 className="genre-heading text-center mb-4">Shopping Cart</h2>

        {/* EMPTY CART */}
        {cart.items.length === 0 && (
          <p className="text-center mt-4">Your cart is empty.</p>
        )}

        <div className="row">
          {/* CART ITEMS */}
          <div className="col-md-8">
            {cart.items.map((item) => {
              if (!item.book) return null;
              return (
                <div
                  key={item.itemId}
                  className="d-flex align-items-center mb-3 p-3 shadow-sm rounded cart-item-card"
                >
                  {/* Image */}
                  <div className="cart-img-wrapper">
                    <BookImage
                      bookId={item.book?.images?.[0]?.id}
                      className="book-card-img"
                    />
                  </div>

                  {/* Book Info */}
                  <div className="ms-3 flex-grow-1">
                    <div className="cart-title-row">
                      <h5 className="mb-1">{item.book.title}</h5>

                      <div className="d-flex justify-content-end">
                        <div className="quantity-box">
                          <button
                            className="qty-btn"
                            disabled={item.quantity <= 1}
                            onClick={() =>
                              handleDecreaseQuantity(item.book.id)
                            }
                          >
                            −
                          </button>

                          <span className="qty-number">{item.quantity}</span>

                          <button
                            className="qty-btn"
                            disabled={
                              item.quantity >= item.book.inventory
                            }
                            onClick={() =>
                              handleIncreaseQuantity(item.book.id)
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <p className="mb-1 text-muted">{item.book.author}</p>

                    <p className="mb-1">
                      <strong>₹{item.unitPrice}</strong> × {item.quantity}
                    </p>

                    <p className="mb-0">
                      <strong>Total: ₹{item.totalPrice}</strong>
                    </p>

                    <p
                      className="remove-text"
                      onClick={() => handleRemoveItem(item.book.id)}
                    >
                      Remove Book
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CART SUMMARY */}
          <div className="col-md-4">
            <div className="p-3 shadow-sm rounded cart-item-card">
              <h4 className="mb-3">Summary</h4>

              <div className="d-flex justify-content-between">
                <span>Subtotal:</span>
                <strong>₹{cart.totalAmount ?? 0}</strong>
              </div>

              <hr />

              <div className="d-grid mt-3">
                <button
                  className="btn custom-checkout-btn"
                  onClick={handleCheckout}
                  disabled={!cart.items.length}
                >
                  Proceed to Checkout
                </button>
              </div>

              <div className="d-grid mt-3">
                <button
                  className="btn custom-checkout-btn"
                  onClick={() => navigate("/library")}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
