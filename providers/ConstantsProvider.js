import React, { useState, createContext } from "react";
import firestore from "@react-native-firebase/firestore";
import _ from "lodash";

export const ConstantsContext = createContext();

export function ConstantsProvider(props) {
	const [deliveryCharges, setDeliveryCharges] = useState(0);
	const [tax, setTax] = useState(0);

	async function getConstants() {
		firestore()
			.collection("staticData")
			.doc("charges")
			.get()
			.then((snapshot) => {
				setDeliveryCharges(Number(snapshot.data().deliveryCharges));
				setTax(Number(snapshot.data().tax / 100));
			});
	}

	return (
		<ConstantsContext.Provider value={{ deliveryCharges, tax, getConstants }}>
			{props.children}
		</ConstantsContext.Provider>
	);
}
