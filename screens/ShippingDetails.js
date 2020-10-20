import React, { useContext, useState } from "react";
import { Block, Input, Text } from "galio-framework";
import { ActivityIndicator, Linking, View } from "react-native";
import CountryPicker from "react-native-country-picker-modal";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "../components";
import { argonTheme } from "../constants";
import ArButton from "../components/Button";
import functions from "@react-native-firebase/functions";
import firestore from "@react-native-firebase/firestore";
import {
	requestOneTimePayment,
	requestBillingAgreement,
} from "react-native-paypal";
import { AuthContext } from "../providers/AuthProvider";
import { showMessage } from "react-native-flash-message";
import { CartContext } from "../providers/CartProvider";
import Modal from "react-native-modal";
import WebView from "react-native-webview";
import { heightPercentageToDP } from "react-native-responsive-screen";

export default function ShippingDetails({ navigation, route }) {
	const { total } = route.params;
	const [shippingAddress, setShippingAddress] = useState({
		country: "Zimbabwe",
	});
	const [processing, setProcessing] = useState(false);
	const authContext = useContext(AuthContext);
	const { user } = authContext;
	const cartContext = useContext(CartContext);
	const { cart, clearCart } = cartContext;
	const [order, setOrder] = useState({});
	const [showApproveModal, setShowApproveModal] = useState(false);

	const handleTextChange = (value, name) => {
		setShippingAddress({ ...shippingAddress, [name]: value });
	};

	const makePayment = async (token, total) => {
		try {
			const {
				nonce,
				payerId,
				email,
				firstName,
				lastName,
				phone,
			} = await requestOneTimePayment(token, {
				amount: String(total), // required
				// any PayPal supported currency (see here: https://developer.paypal.com/docs/integration/direct/rest/currency-codes/#paypal-account-payments)
				currency: "GBP",
				// any PayPal supported locale (see here: https://braintree.github.io/braintree_ios/Classes/BTPayPalRequest.html#/c:objc(cs)BTPayPalRequest(py)localeCode)
				localeCode: "en_GB",
				shippingAddressRequired: false,
				userAction: "commit", // display 'Pay Now' on the PayPal review page
				// one of 'authorize', 'sale', 'order'. defaults to 'authorize'. see details here: https://developer.paypal.com/docs/api/payments/v1/#payment-create-request-body
				intent: "sale",
			});
			functions()
				.httpsCallable("makeTransaction")({
					nonce,
					amount: total,
					name: user?.displayName,
					shippingAddress,
					email: user?.email,
					items: cart,
				})
				.then((response) => {
					const {
						data: { success },
					} = response;
					if (success) {
						setProcessing(false);
						clearCart();
						showMessage({
							message: "Order placed successfully",
							description:
								"You'll receive further information about the progression of this order on your email.",
							type: "info",
						});
						setTimeout(() => {
							navigation.navigate("Home");
						}, 2000);
					}
				});
		} catch (error) {
			setProcessing(false);
			console.log("error" + JSON.stringify(error));
		}
	};

	const createOrder = async () => {
		try {
			const response = await functions().httpsCallable("createOrder")({
				amount: Number(total),
				items: cart,
				email: user?.email,
				name: user?.displayName,
				shippingAddress,
			});
			console.log(response.data.result);
			setOrder(response.data.result);
			setShowApproveModal(true);
		} catch (error) {
			console.log(error);
		}
	};

	const checkOrderStatus = async () => {
		try {
			const response = await functions().httpsCallable("checkOrderStatus")({
				id: order?.id,
			});
			console.log(response.data.result);
			if (response.data.result.status === "APPROVED") {
				setShowApproveModal(false);
				captureOrder();
			}
		} catch (error) {
			console.log(error);
		}
	};

	const captureOrder = async () => {
		try {
			const response = await functions().httpsCallable("captureOrder")({
				id: order?.id,
			});
			console.log(response.data.result);
			if (response.data.result.status === "COMPLETED") {
				firestore()
					.collection("orders")
					.add({
						name: user?.displayName,
						shippingAddress,
						amount: total,
						email: user?.email,
						items: cart,
					})
					.then(() => {
						setProcessing(false);

						clearCart();
						showMessage({
							message: "Order placed successfully",
							description:
								"You'll receive further information about the progression of this order on your email.",
							type: "info",
						});
						setTimeout(() => {
							navigation.navigate("Home");
						}, 2000);
					});
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<SafeAreaView>
			<ScrollView style={{ paddingHorizontal: 20, paddingTop: 20 }}>
				<Block>
					<Icon
						onPress={() => {
							navigation.pop();
						}}
						style={{ marginBottom: 20 }}
						name="arrow-back"
						family="Ionicons"
						size={30}
						color={argonTheme.COLORS.MUTED}
					></Icon>
					<Text h3 bold style={{ marginBottom: 10 }}>
						Delivery Address
					</Text>
					<Input
						placeholderTextColor="grey"
						placeholder="Address"
						onChangeText={(value) => {
							handleTextChange(value, "address");
						}}
					></Input>
					<Input
						placeholderTextColor="grey"
						placeholder="Apt, suite, etc (optional)"
						onChangeText={(value) => {
							handleTextChange(value, "apt");
						}}
					></Input>
					<Input
						placeholderTextColor="grey"
						placeholder="City"
						onChangeText={(value) => {
							handleTextChange(value, "city");
						}}
					></Input>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							flex: 1,
							borderColor: "rgba(0,0,0,0.3)",
							borderWidth: 1,
							marginVertical: 10,
							backgroundColor: "white",
							borderRadius: 10,
						}}
					>
						<Text
							style={{
								flex: 1,
								marginLeft: 20,
								color: argonTheme.COLORS.PLACEHOLDER,
								paddingVertical: 12,
							}}
						>
							{shippingAddress.country ? shippingAddress.country : "Country"}
						</Text>
						{/* <CountryPicker
							withCountryNameButton
							withFlag={false}
							visible={false}
							containerButtonStyle={{
								paddingVertical: 11,
								paddingHorizontal: 10,
							}}
							// onSelect={(country) => {
							// 	handleTextChange(country.name, "country");
							// }}
						/> */}
					</View>
					<Input
						placeholderTextColor="grey"
						placeholder="Zip Code"
						onChangeText={(value) => {
							handleTextChange(value, "zipcode");
						}}
					></Input>
					<Input
						placeholderTextColor="grey"
						placeholder="Phone"
						onChangeText={(value) => {
							handleTextChange(value, "phone");
						}}
					></Input>
					<ArButton
						color="button_color"
						style={{ marginTop: 20 }}
						onPress={() => {
							setProcessing(true);
							// functions()
							// 	.httpsCallable("createClientToken")()
							// 	.then((response) => {
							// 		makePayment(response.data.clientToken, total);
							// 	})
							// 	.catch((error) => {
							// 		console.log(JSON.stringify(error));
							// 	});
							createOrder();
						}}
						// disabled={
						// 	!shippingAddress.address &&
						// 	!shippingAddress.city &&
						// 	!shippingAddress.country &&
						// 	!shippingAddress.zipcode &&
						// 	!shippingAddress.phone
						// }
					>
						{!processing ? (
							<Text h5 color={argonTheme.COLORS.SECONDARY} bold>
								Continue
							</Text>
						) : (
							<ActivityIndicator color="white"></ActivityIndicator>
						)}
					</ArButton>
				</Block>
			</ScrollView>
			<Modal
				isVisible={showApproveModal}
				style={{ justifyContent: "flex-end", margin: 0 }}
				onBackdropPress={() => {
					setShowApproveModal(false);
				}}
			>
				<View
					style={{
						height: heightPercentageToDP("80%"),
						paddingBottom: 25,
						backgroundColor: "white",
						borderTopEndRadius: 25,
						borderTopStartRadius: 25,
					}}
				>
					<WebView
						onNavigationStateChange={(data) => {
							checkOrderStatus();
						}}
						style={{ borderTopEndRadius: 25, borderTopStartRadius: 25 }}
						source={{ uri: showApproveModal ? order?.links[1]?.href : "" }}
					></WebView>
				</View>
			</Modal>
		</SafeAreaView>
	);
}
