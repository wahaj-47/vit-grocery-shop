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
			setTotal(total + hamper.price);
			return [...cart, hamper];
		});
	}

	function removeFromCart(hamper) {
		setCart(() => {
			setTotal(total - hamper.price);
			return cart.filter((item) => item !== hamper);
		});
	}

	return (
		<CartContext.Provider value={{ cart, addToCart, total, removeFromCart }}>
			{props.children}
		</CartContext.Provider>
	);
}
