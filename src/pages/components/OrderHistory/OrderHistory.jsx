import React, { useState, useEffect } from 'react';
import axios from "axios";
import './OrderHistory.css';
import { getFirebaseToken } from "../firebase/getFirebaseToken";
import { Link } from "react-router-dom";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      setLoading(true);
      try {
        const token = await getFirebaseToken();
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/order/get-history`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const sortedOrders = response.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        setOrders(sortedOrders);
      } catch (error) {
        console.error("Error fetching order history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  const handleViewDetails = async (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      return;
    }

    try {
      const token = await getFirebaseToken();
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/order/get-history/${orderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrderDetails(response.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }

    setExpandedOrderId(orderId);
  };

  return (
    <div className="order-history-page">
      <h2>Order History</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        orders.length > 0 ?
          (<div className="order-list">
            {orders.map((order) => (
              <div key={order.id} className="order-container">
                <div className="order-summary">
                  <div className="order-summary-text">
                    <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
                    <p><strong>Total Price:</strong> ${parseFloat(order.totalPrice).toFixed(2)}</p>
                    <p><strong>Address:</strong> {order.address.addressInfo}</p>
                  </div>
                  <div>
                    <button
                      onClick={() => handleViewDetails(order.id)}
                      className="view-details-button"
                    >
                      {expandedOrderId === order.id ? "Hide Details" : "View Details"}
                    </button>
                  </div>
                </div>
                {expandedOrderId === order.id && (
                  <div className="order-details">
                    {orderDetails.orderItems.map((item) => (
                      <Link key={item.id} to={`/book/${item.book.id}`} className="order-book">
                        <div className="order-book-image">
                          <img src={`${process.env.PUBLIC_URL}/${item.book.imagePath}`} alt={item.book.name} />
                        </div>
                        <div className="order-book-details">
                          <div className="order-book-details-first">
                            <h2 className="order-book-title">{item.book.name}</h2>
                            <p className="order-book-author">{item.book.writer}</p>
                          </div>
                        </div>
                        <div className="other-book-info">
                          <p>{item.book.pageNumber} Pages</p>
                          <p>{item.book.language}</p>
                          <p>{item.book.datePublished}</p>
                          <p>{item.book.bookDimension}</p>
                          <p>{item.book.isbn}</p>
                          <p>Edition {item.book.editionNumber}</p>
                        </div>
                        <div className="order-book-pricing">
                          <p> <strong>Quantity:</strong> {item.quantity} </p>
                          {item.discountPercentage > 0 ? (
                            <><p className="order-normal-price"><strong><del>${parseFloat(item.unitPrice).toFixed(2)}</del></strong>
                            </p><p className="order-discount-percentage"> -{item.discountPercentage}% </p></>
                          ) : null}
                          <p className="order-final-price"> <strong>${parseFloat(item.discountedPrice).toFixed(2)}</strong> </p>
                        </div>
                      </Link>
                    ))}
                    <div>
                      <div className="order-final-book-pricing">
                        {orderDetails.couponDiscountPercentage > 0 ? (
                          <><p className="order-normal-price"> <strong><del>${parseFloat(orderDetails.subtotal).toFixed(2)}</del></strong>
                          </p><p className="order-discount-percentage"> Used Coupon: -{orderDetails.couponDiscountPercentage}% </p></>
                        ) : null}
                        <p className="order-final-price"> Total Price: <strong>${parseFloat(orderDetails.totalPrice).toFixed(2)}</strong> </p>
                      </div>
                    </div>
                  </div>)
                }
              </div>
            ))}
          </div>) : <p> No orders found!</p>
      )
      }
    </div >
  );
};

export default OrderHistory;
