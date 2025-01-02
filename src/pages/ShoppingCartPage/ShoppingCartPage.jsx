import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ShoppingCartPage.css";
import { FiShoppingCart } from "react-icons/fi";
import { TbCirclePlus, TbCircleMinus } from "react-icons/tb";
import { MdOutlineDiscount, MdOutlinePayments } from "react-icons/md";
import { getFirebaseToken } from "../components/firebase/getFirebaseToken";
import axiost from "../../axiosConfig.js";
import { toast } from "react-toastify";

const ShoppingCartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [currentBalance, setCurrentBalance] = useState(0);
    const [currentAddress, setCurrentAddress] = useState("");
    const [newAddress, setNewAddress] = useState("");
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await getFirebaseToken();

                const cartResponse = await axiost.get(`${process.env.REACT_APP_API_BASE_URL}/cart-item/get-items`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const sortedCartItems = cartResponse.data.sort((a, b) => a.id - b.id);
                setCartItems(sortedCartItems);

                const couponResponse = await axiost.get(`${process.env.REACT_APP_API_BASE_URL}/coupon/get-coupons`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCoupons(couponResponse.data);

                const userResponse = await axiost.get(`${process.env.REACT_APP_API_BASE_URL}/user/bytoken`, {
                    headers: { Authorization: `Bearer ${token}` }
                }
                );
                setCurrentBalance(parseFloat(userResponse.data.balance));
            } catch (error) {
                console.error("Error fetching cart data:", error);
            }
        };

        fetchData();
    }, [refresh]);

    const fetchAddress = async () => {
        try {
            const token = await getFirebaseToken();
            const response = await axiost.get(
                `${process.env.REACT_APP_API_BASE_URL}/customerAddress/get-address`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCurrentAddress(response.data.addressInfo || "");
            setNewAddress(response.data.addressInfo || "");
        } catch (error) {
            console.error("Error fetching address:", error);
        }
    };

    const handleIncreaseQuantity = async (bookId) => {
        try {
            const token = await getFirebaseToken();
            await axiost.patch(`${process.env.REACT_APP_API_BASE_URL}/cart-item/add-item/${bookId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.book.id === bookId ? { ...item, quantity: item.quantity + 1 } : item
                )
            );
            setRefresh((prev) => !prev);
        } catch (error) {
            console.error("Error increasing item quantity:", error);
        }
    };

    const handleDecreaseQuantity = async (bookId) => {
        try {
            const token = await getFirebaseToken();
            await axiost.patch(`${process.env.REACT_APP_API_BASE_URL}/cart-item/remove-item/${bookId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setCartItems((prevItems) =>
                prevItems
                    .map((item) =>
                        item.book.id === bookId ? { ...item, quantity: item.quantity - 1 } : item
                    )
                    .filter((item) => item.quantity > 0)
            );
            setRefresh((prev) => !prev);
        } catch (error) {
            console.error("Error decreasing item quantity:", error);
        }
    };

    const handleCompletePurchase = async () => {
        try {
            const token = await getFirebaseToken();
            if (newAddress !== currentAddress) {
                await axiost.post(
                    `${process.env.REACT_APP_API_BASE_URL}/customerAddress/add-address`,
                    { addressInfo: newAddress },
                    { headers: { Authorization: `Bearer ${token}` }}
                );
                toast.success("Address updated successfully!", {
                    position: "top-right",
                    autoClose: 2000,
                });
            }
            const requestBody = {
                couponId: selectedCoupon?.id || null,
            };
            await axiost.post(
                `${process.env.REACT_APP_API_BASE_URL}/order/complete-purchase`,
                requestBody,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            toast.success("Purchase completed successfully!", {
                position: "top-right",
                autoClose: 2000,
            });
            setShowModal(false);
            navigate("/user");
        } catch (error) {
            console.error("Error completing purchase:", error);
            toast.error(error.response.data.message, {
                position: "top-right",
                autoClose: 2000,
            });
            setRefresh((prev) => !prev);
        }
    };

    const handlePayNow = async () => {
        const discountedTotalPrice = calculateDiscountedTotalPrice();
        if (currentBalance < discountedTotalPrice) {
            toast.error(`Insufficient balance to complete the purchase. Your current balance is $${currentBalance.toFixed(2)}.`, {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }
        await fetchAddress();
        setShowModal(true);
    };

    const calculateOriginalTotalPrice = () =>
        cartItems.reduce((sum, item) => sum + item.finalPrice, 0);

    const calculateDiscountedTotalPrice = () => {
        const originalTotalPrice = calculateOriginalTotalPrice();
        return selectedCoupon
            ? originalTotalPrice * (1 - selectedCoupon.discountPercentage / 100)
            : originalTotalPrice;
    };

    const handleCouponClick = (coupon) => {
        if (selectedCoupon && selectedCoupon.id === coupon.id) {
            setSelectedCoupon(null);
        }
        else {
            setSelectedCoupon(coupon);
        }
    };

    return (
        <div className="shopping-cart">
            <div className="cart-header">
                <p><FiShoppingCart /> </p>
                <h1> My Shopping Cart </h1>
            </div>
            {cartItems.length > 0 ? (
                <div className="cart-items">
                    {cartItems.map((item) => (
                        <div key={item.id} className="cart-item">
                            <div className="item-image">
                                <img src={`${process.env.PUBLIC_URL}/${item.book.imagePath}`} alt={item.book.name} />
                            </div>
                            <div className="item-details">
                                <h2 className="item-title">{item.book.name}</h2>
                                <p className="item-author">{item.book.writer}</p>
                            </div>
                            <div className="item-quantity">
                                <div className="circle" onClick={() => handleDecreaseQuantity(item.book.id)}> <TbCircleMinus /> </div>
                                <span> <strong> {item.quantity} </strong> </span>
                                <div className="circle" onClick={() => handleIncreaseQuantity(item.book.id)}> <TbCirclePlus /> </div>
                            </div>
                            <div className="item-price">
                                {item.discountPercentage > 0 ? (
                                    <>
                                        <div className="item-normal-price">
                                            <strong> <del>${item.normalPrice.toFixed(2)}</del> </strong>
                                        </div>
                                        <div className="item-discount"> -{item.discountPercentage}% </div>
                                    </>
                                ) : null}
                                <div className="item-final-price">
                                    <strong>${item.finalPrice.toFixed(2)}</strong>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : <p className="no-cart">Your shopping cart is empty!</p>}
            <div className="coupons">
                <div className="coupon-header">
                    <p><MdOutlineDiscount /> </p>
                    <h3> Coupons </h3>
                </div>
                {coupons.length > 0 ? (
                    <div className="coupon-items">
                        {coupons.map((coupon) => (
                            <div
                                key={coupon.id}
                                className={`coupon-item ${cartItems.length <= 0 ? "disabled" : ""} 
                                ${selectedCoupon?.id === coupon.id ? "selected" : ""}`}
                                onClick={() => handleCouponClick(coupon)}
                            >
                                <div className="discount"> -{coupon.discountPercentage}% </div>
                            </div>
                        ))}
                    </div>
                ) : <p className="no-coupon">No coupons avaliable for your account</p>}
            </div>
            {cartItems.length > 0 && (
                <><div className="cart-summary">
                    <div className="total">
                        <p className="total-text">
                            <strong>Total:</strong>
                        </p>
                        <p className={`total-amount ${selectedCoupon ? "old" : ""}`}>
                            <strong>${calculateOriginalTotalPrice().toFixed(2)}</strong>
                        </p>
                        {selectedCoupon && (
                            <>
                                <p className="coupon-discount"> -{selectedCoupon.discountPercentage}%</p>
                                <p className="total-discounted"><strong>${calculateDiscountedTotalPrice().toFixed(2)}</strong></p>
                            </>
                        )}
                    </div>
                </div>
                    <div className="pay-now">
                        <button className="pay-btn" onClick={handlePayNow}>Pay Now</button>
                    </div>
                </>
            )}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2> <p className="payment-icon"> <MdOutlinePayments /></p> Payment Details</h2>
                        <p>
                            <strong>Current Balance:</strong> <del>${currentBalance.toFixed(2)}</del>
                        </p>
                        <p>
                            <strong>Total Price:</strong> ${calculateDiscountedTotalPrice().toFixed(2)}
                        </p>
                        <p>
                            <strong>Remaining Balance:</strong>{" "}
                            ${(currentBalance - calculateDiscountedTotalPrice()).toFixed(2)}
                        </p>
                        <div className="address-section">
                            <h3>Shipping Address</h3>
                            <textarea
                                value={newAddress}
                                onChange={(e) => setNewAddress(e.target.value)}
                            ></textarea>
                        </div>
                        <div className="modal-buttons">
                            <button
                                className="modal-cancel"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="modal-confirm"
                                onClick={handleCompletePurchase}
                                disabled={!newAddress.trim()}
                            >
                                Complete Purchase
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShoppingCartPage;