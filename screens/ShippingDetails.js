import React, { useContext, useState } from "react";
import { Block, Button, Input, Text } from "galio-framework";
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Linking,
	View,
} from "react-native";
import CountryPicker from "react-native-country-picker-modal";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "../components";
import { argonTheme } from "../constants";
import ArButton from "../components/Button";
import functions from "@react-native-firebase/functions";
import firestore from "@react-native-firebase/firestore";
// import {
// 	requestOneTimePayment,
// 	requestBillingAgreement,
// } from "react-native-paypal";
import { AuthContext } from "../providers/AuthProvider";
import { showMessage } from "react-native-flash-message";
import { CartContext } from "../providers/CartProvider";
import Modal from "react-native-modal";
import WebView from "react-native-webview";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
	CreditCardInput,
	LiteCreditCardInput,
} from "react-native-credit-card-input";
import stripe from "tipsi-stripe";

stripe.setOptions({
	publishableKey:
		"pk_live_51HYwOeECZhHspUzfV9fCh678vZ3TYc0sq5DJVV7c1pQjPE18ouaMAazbOBEkLtnLZ0E4pCLm2lJWqSkgjC1utIow003FdXg8eG",
});

export default function ShippingDetails({ navigation, route }) {
	const { total } = route.params;
	const [shippingAddress, setShippingAddress] = useState({
		country: "Zimbabwe",
	});
	const [card, setCard] = useState({});
	const [processing, setProcessing] = useState(false);
	const authContext = useContext(AuthContext);
	const { user } = authContext;
	const cartContext = useContext(CartContext);
	const { cart, clearCart } = cartContext;
	const [order, setOrder] = useState({});
	const [showApproveModal, setShowApproveModal] = useState(false);
	const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
	const [isFormValid, setIsFormValid] = useState(false);

	const handleTextChange = (value, name) => {
		setShippingAddress({ ...shippingAddress, [name]: value });
	};

	// const makePayment = async (token, total) => {
	// 	try {
	// 		const {
	// 			nonce,
	// 			payerId,
	// 			email,
	// 			firstName,
	// 			lastName,
	// 			phone,
	// 		} = await requestOneTimePayment(token, {
	// 			amount: String(total), // required
	// 			// any PayPal supported currency (see here: https://developer.paypal.com/docs/integration/direct/rest/currency-codes/#paypal-account-payments)
	// 			currency: "GBP",
	// 			// any PayPal supported locale (see here: https://braintree.github.io/braintree_ios/Classes/BTPayPalRequest.html#/c:objc(cs)BTPayPalRequest(py)localeCode)
	// 			localeCode: "en_GB",
	// 			shippingAddressRequired: false,
	// 			userAction: "commit", // display 'Pay Now' on the PayPal review page
	// 			// one of 'authorize', 'sale', 'order'. defaults to 'authorize'. see details here: https://developer.paypal.com/docs/api/payments/v1/#payment-create-request-body
	// 			intent: "sale",
	// 		});
	// 		functions()
	// 			.httpsCallable("makeTransaction")({
	// 				nonce,
	// 				amount: total,
	// 				name: user?.displayName,
	// 				shippingAddress,
	// 				email: user?.email,
	// 				items: cart,
	// 			})
	// 			.then((response) => {
	// 				const {
	// 					data: { success },
	// 				} = response;
	// 				if (success) {
	// 					setProcessing(false);
	// 					clearCart();
	// 					showMessage({
	// 						message: "Order placed successfully",
	// 						description:
	// 							"You'll receive further information about the progression of this order on your email.",
	// 						type: "info",
	// 					});
	// 					setTimeout(() => {
	// 						navigation.navigate("Home");
	// 					}, 2000);
	// 				}
	// 			});
	// 	} catch (error) {
	// 		setProcessing(false);
	// 		console.log("error" + JSON.stringify(error));
	// 	}
	// };

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
				addOrderToFirestore("paypal");
			}
		} catch (error) {
			console.log(error);
		}
	};

	const addOrderToFirestore = (type) => {
		firestore()
			.collection("orders")
			.add({
				name: user?.displayName,
				shippingAddress,
				amount: total,
				email: user?.email,
				items: cart,
				paymentMethod: type,
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
	};

	const handleCreditCardInput = (form) => {
		if (form.valid) {
			setIsFormValid(true);
		} else {
			setIsFormValid(false);
		}
		setCard({ ...form });
		console.log(form);
	};

	const makePaymentByCard = async () => {
		const token = await stripe.createTokenWithCard({
			...card.values,
			number: card.values.number,
			expMonth: Number(card.values.expiry.split("/")[0]),
			expYear: Number(card.values.expiry.split("/")[1]),
		});
		console.log(token);
		functions()
			.httpsCallable("makeCardPayment")({
				amount: total,
				token: token.tokenId,
			})
			.then((res) => {
				setShowPaymentMethodModal(false);
				addOrderToFirestore("card");
			})
			.catch((err) => console.log(err));
	};

	return (
		<SafeAreaView>
			<KeyboardAwareScrollView
				enableAutomaticScroll
				enableOnAndroid
				style={{ paddingHorizontal: 20 }}
			>
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
						placeholder="Name"
						onChangeText={(value) => {
							handleTextChange(value, "name");
						}}
					></Input>
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
							setShowPaymentMethodModal(true);
							// createOrder();
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
			</KeyboardAwareScrollView>
			<Modal
				animationIn="bounceInDown"
				animationOut="bounceOutUp"
				isVisible={showPaymentMethodModal}
				style={{ justifyContent: "flex-start", margin: 0 }}
				onBackdropPress={() => {
					setShowPaymentMethodModal(false);
					setProcessing(false);
				}}
			>
				<View
					style={{
						// height: heightPercentageToDP("45%"),
						paddingTop: 50,
						backgroundColor: "white",
						borderBottomEndRadius: 25,
						borderBottomStartRadius: 25,
						alignItems: "center",
						paddingBottom: 40,
						paddingHorizontal: 20,
					}}
				>
					<Text h5 style={{ paddingVertical: 20 }}>
						Pay by card
					</Text>
					{/* <Input
						placeholderTextColor="grey"
						placeholder="Card holder name"
						onChangeText={(value) => {
							handleTextChange(value, "cardName");
						}}
					></Input> */}
					<View style={{ height: heightPercentageToDP("32%") }}>
						<CreditCardInput
							requiresName
							allowScroll
							onChange={handleCreditCardInput}
						/>
					</View>
					<Text h6 style={{ paddingVertical: 10 }}>
						Powered by stripe
					</Text>
					<ArButton
						color="button_color"
						enabled={isFormValid}
						onPress={() => {
							makePaymentByCard();
						}}
					>
						<Text h5 color={argonTheme.COLORS.SECONDARY} bold>
							Submit
						</Text>
					</ArButton>
					<Text h5 style={{ paddingVertical: 20 }}>
						Or
					</Text>
					<ArButton
						onPress={() => {
							setShowPaymentMethodModal(false);
							createOrder();
						}}
						color="button_color"
					>
						<Text h5 color={argonTheme.COLORS.SECONDARY} bold>
							Use Paypal
						</Text>
					</ArButton>
				</View>
			</Modal>
			<Modal
				animationIn="bounceInUp"
				animationOut="bounceOutDown"
				isVisible={showApproveModal}
				style={{ justifyContent: "flex-end", margin: 0 }}
				onBackdropPress={() => {
					setShowApproveModal(false);
					setProcessing(false);
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
