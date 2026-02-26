import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders } from "../../store/features/OrderSlice";
import { useParams } from "react-router-dom";

const Order = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.order.orderItems);
  const loading = useSelector((state) => state.order.loading);
  const error = useSelector((state) => state.order.errorMessage);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserOrders(userId));
    }
  }, [dispatch, userId]);

  if (loading) {
    return (
      <div className="orders-page">
        <div className="container py-4 text-center">
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <div className="container py-4 text-center">
          <p className="text-danger">{error}</p>
        </div>
      </div>
    );
  }

  if (!Array.isArray(orders) || orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="container py-4 text-center">
          <h2 className="genre-heading mb-4">My Orders</h2>
          <p>You have no orders yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container py-4">
        <h2 className="genre-heading text-center mb-4">My Orders</h2>

        {orders.map((order) => {
          if (!order) return null;

          const safeItems = Array.isArray(order.items)
            ? order.items
            : [];

          return (
            <div
              key={order.id}
              className="order-card mb-4 p-3 shadow-sm rounded"
            >
              {/* ORDER HEADER */}
              <div className="order-header d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="mb-1">Order #{order.id}</h5>
                  <p className="order-date mb-0">
                    Placed on{" "}
                    {order.orderDate
                      ? new Date(order.orderDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>

                {order.status && (
                  <div className="order-status">
                    <span
                      className={`status-pill ${order.status.toLowerCase()}`}
                    >
                      {order.status}
                    </span>
                  </div>
                )}
              </div>

              {/* ORDER ITEMS */}
              {safeItems.map((item) => (
                <div
                  key={item.bookId}
                  className="order-item d-flex align-items-center py-2"
                >
                  <div className="ms-3 flex-grow-1">
                    <h6 className="mb-1">{item.title}</h6>
                    <p className="mb-1 text-muted">{item.author}</p>
                    <p className="mb-0">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>

                  <div className="order-item-total">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}

              <hr />

              {/* ORDER FOOTER */}
              <div className="d-flex justify-content-between align-items-center">
                <span className="order-user">
                  User ID: {order.userId}
                </span>
                <strong className="order-total">
                  Total: ₹{order.totalAmount ?? 0}
                </strong>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Order;
