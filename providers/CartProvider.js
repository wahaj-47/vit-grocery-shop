import React, { useState, createContext } from "react";
import firestore from "@react-native-firebase/firestore";
import _ from "lodash";
import { showMessage } from "react-native-flash-message";

export const CartContext = createContext();

export function CartProvider(props) {
	const [cart, setCart] = useState([]);
	const [total, setTotal] = useState(0);

	function addToCart(hamper) {
		setCart(() => {
			showMessage({ message: "Added to cart", type: "success" });
			setTotal(parseFloat((total + Number(hamper.price)).toFixed(2)));
			return [...cart, hamper];
		});
	}

	function removeFromCart(hamper) {
		setCart(() => {
			setTotal(parseFloat((total - Number(hamper.price)).toFixed(2)));
			return cart.filter((item) => item !== hamper);
		});
	}

	function clearCart() {
		setCart([]);
	}

	return (
		<CartContext.Provider
			value={{ cart, addToCart, total, removeFromCart, clearCart }}
		>
			{props.children}
		</CartContext.Provider>
	);
}
