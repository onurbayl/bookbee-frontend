import React, { useState } from "react";
import "./ShoppingCartPage.css";
import { FiShoppingCart } from "react-icons/fi";
import { TbCirclePlus, TbCircleMinus } from "react-icons/tb";
import { MdOutlineDiscount } from "react-icons/md";

const initialCartItems = [
    {
        id: 1,
        name: "Pride and Prejudice",
        writer: "Jane Austen",
        quantity: 1,
        normalPrice: 40,
        discountPercentage: 10,
        finalPrice: 36,
    },
    {
        id: 2,
        name: "The Picture of Dorian Gray",
        writer: "Oscar Wilde",
        quantity: 3,
        normalPrice: 50,
        discountPercentage: 0,
        finalPrice: 50,
    },
    {
        id: 3,
        name: "Anna Karenina",
        writer: "Leo Tolstoy",
        quantity: 2,
        normalPrice: 20,
        discountPercentage: 10,
        finalPrice: 18,
    },
];

const coupons = [
    {
        id: 1,
        discountPercentage: 10
    },
    {
        id: 2,
        discountPercentage: 15
    }
];

const ShoppingCartPage = () => {
    const [cartItems, setCartItems] = useState(initialCartItems);
    const [selectedCoupon, setSelectedCoupon] = useState(null);

    const handleIncreaseQuantity = (id) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const handleDecreaseQuantity = (id) => {
        setCartItems((prevItems) =>
            prevItems
                .map((item) =>
                    item.id === id ? { ...item, quantity: item.quantity - 1 } : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const originalTotalPrice = cartItems.reduce(
        (sum, item) => sum + item.finalPrice * item.quantity,
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
                            <div className="placeholder-image"></div>
                            <div className="item-details">
                                <h2 className="item-title">{item.name}</h2>
                                <p className="item-author">{item.writer}</p>
                            </div>
                            <div className="item-quantity">
                                <div className="circle" onClick={() => handleDecreaseQuantity(item.id)}> <TbCircleMinus /> </div>
                                <span> <strong> {item.quantity} </strong> </span>
                                <div className="circle" onClick={() => handleIncreaseQuantity(item.id)}> <TbCirclePlus /> </div>
                            </div>
                            <div className="item-price">
                                {item.discountPercentage > 0 ? (
                                    <>
                                        <div className="item-normal-price">
                                            <strong> <del>${(item.normalPrice * item.quantity).toFixed(2)}</del> </strong>
                                        </div>
                                        <div className="item-discount"> -{item.discountPercentage}% </div>
                                    </>
                                ) : null}
                                <div className="item-final-price">
                                    <strong>${(item.finalPrice * item.quantity).toFixed(2)}</strong>
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