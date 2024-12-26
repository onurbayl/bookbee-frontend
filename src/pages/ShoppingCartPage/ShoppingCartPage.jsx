import React, { useState, useEffect } from "react";
import "./ShoppingCartPage.css";
import { FiShoppingCart } from "react-icons/fi";
import { TbCirclePlus, TbCircleMinus } from "react-icons/tb";
import { MdOutlineDiscount } from "react-icons/md";
import { getFirebaseToken } from "../components/firebase/getFirebaseToken";
import axios from "axios";

const ShoppingCartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await getFirebaseToken();

                const cartResponse = await axios.get("http://localhost:3000/api/v1/cart-item/get-items", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const sortedCartItems = cartResponse.data.sort((a, b) => a.id - b.id);
                setCartItems(sortedCartItems);

                const couponResponse = await axios.get("http://localhost:3000/api/v1/coupon/get-coupons", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCoupons(couponResponse.data);
            } catch (error) {
                console.error("Error fetching cart data:", error);
            }
        };

        fetchData();
    }, [refresh]);

    const handleIncreaseQuantity = async (bookId) => {
        try {
            const token = await getFirebaseToken();
            await axios.patch(`http://localhost:3000/api/v1/cart-item/add-item/${bookId}`, {}, {
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
            await axios.patch(`http://localhost:3000/api/v1/cart-item/remove-item/${bookId}`, {}, {
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

    const originalTotalPrice = cartItems.reduce(
        (sum, item) => sum + item.finalPrice,
        0
    );

    const discountedTotalPrice = selectedCoupon
        ? originalTotalPrice * (1 - selectedCoupon.discountPercentage / 100)
        : originalTotalPrice;

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
                            <strong>${originalTotalPrice.toFixed(2)}</strong>
                        </p>
                        {selectedCoupon && (
                            <>
                                <p className="coupon-discount"> -{selectedCoupon.discountPercentage}%</p>
                                <p className="total-discounted"><strong>${discountedTotalPrice.toFixed(2)}</strong></p>
                            </>
                        )}
                    </div>
                </div>
                    <div className="pay-now">
                        <button className="pay-btn">Pay Now </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ShoppingCartPage;