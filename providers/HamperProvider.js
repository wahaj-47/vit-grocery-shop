import React, { useState, createContext } from "react";
import firestore from "@react-native-firebase/firestore";
import _ from "lodash";

export const HamperContext = createContext();

export function HamperProvider(props) {
	const [hampers, setHampers] = useState([]);

	async function getHampers() {
		const documentSnapshot = await firestore()
			.collection("hampers")
			.orderBy("price")
			.get();
		const arr = [];
		documentSnapshot.forEach((doc) => {
			arr.push({ id: doc.id, ...doc.data() });
		});
		setHampers(arr);
	}

	return (
		<HamperContext.Provider value={{ hampers, getHampers }}>
			{props.children}
		</HamperContext.Provider>
	);
}
