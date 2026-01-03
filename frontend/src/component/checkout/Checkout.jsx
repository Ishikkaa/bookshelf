import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {getUserCart,} from "../../store/features/CartSlice";
import { toast, ToastContainer } from "react-toastify";
import { placeOrder, createPaymentIntent, confirmPayment} from "../../store/features/OrderSlice";

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userId } = useParams();
    const cart = useSelector((state) => state.cart);

    useEffect(() => {
        dispatch(getUserCart(userId));
    }, [dispatch, userId]);

    const handleExpiryChange = (e) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length >= 3) {
            value = value.slice(0, 2) + "/" + value.slice(2, 4);
        }
        e.target.value = value;
    };

    const handlePaymentAndOrder = async (e) => {
        e.preventDefault();

        try {
            const { clientSecret } = await dispatch(
            createPaymentIntent({
                userId,
                amount: cart.totalAmount,
                currency: "inr",
            })
            ).unwrap();
            const response = await dispatch(confirmPayment(clientSecret)).unwrap();
            if(response.data == 1){
                await dispatch(placeOrder(userId)).unwrap();
                toast.success("Payment successful! Your order has been placed.");
                setTimeout(() => {
                navigate(`/user/${userId}/my-orders`);
                }, 2000);
            }
            else{
                toast.error("Payment failed")
            }
            

        } catch (error) {
            toast.error(error?.message || "Payment failed");
        }
    };

  return (
    <section className="manage-page">
      <ToastContainer />

      <div className="container checkout-container">
        <h2 className="genre-heading text-center mb-4">Checkout</h2>

        <div className="checkout-card shadow-sm">
          <form onSubmit={(e) => handlePaymentAndOrder(e)} className="checkout-form">

            {/*USER DETAILS*/}
            <h4 className="checkout-section-title">User Details</h4>

            <div className="checkout-grid-3">
              <div className="form-group">
                <label>First Name</label>
                <input className="form-control" type="text" placeholder="First Name" required/>
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input className="form-control" type="text" placeholder="Last Name" required/>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  required
                />
              </div>
            </div>

            {/*BILLING ADDRESS*/}
            <h4 className="checkout-section-title mt-4">Billing Address</h4>

            <div className="form-group mb-3">
              <label>Address Line</label>
              <input
                className="form-control"
                type="text"
                placeholder="Street / Apartment"
                required
              />
            </div>

            <div className="checkout-grid-3">
              <div className="form-group">
                <label>City</label>
                <input className="form-control" type="text" placeholder="City" required/>
              </div>

              <div className="form-group">
                <label>State</label>
                <input className="form-control" type="text" placeholder="State" required/>
              </div>

              <div className="form-group">
                <label>Country</label>
                <input className="form-control" type="text" placeholder="Country" required/>
              </div>
            </div>

            <div className="checkout-grid-3 mt-3">
              <div className="form-group">
                <label>Postal Code</label>
                <input className="form-control" type="number" maxLength={6} placeholder="Postal Code" required/>
              </div>

              <div className="form-group">
                <label>Address Type</label>
                <select className="form-control" required>
                  <option value="">Select</option>
                  <option value="HOME">Home</option>
                  <option value="OFFICE">Office</option>
                  <option value="SHIPPING">Shipping</option>
                </select>
              </div>
            </div>

            {/*PAYMENT DETAILS*/}
            <h4 className="checkout-section-title mt-4">Card Details</h4>

            <div className="form-group mb-3">
              <label>Card Number</label>
              <input
                type="number"
                className="form-control"
                maxLength={16}
                placeholder="1234 5678 9012 3456"
                required
              />
            </div>

            <div className="checkout-grid-2">
              <div className="form-group">
                <label>Expiry (MM/YY)</label>
                <input className="form-control" maxLength={5}
                onChange={handleExpiryChange} placeholder="MM/YY" required/>
              </div>

              <div className="form-group">
                <label>CVV</label>
                <input className="form-control" type="password" maxLength={3} placeholder="CVV (123)" required/>
              </div>
            </div>

            <div className="d-grid mt-4">
              <button type="submit" className="btn custom-checkout-btn">
                Pay & Place Order
              </button>
            </div>

          </form>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
