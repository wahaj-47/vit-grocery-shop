import React from "react";
import { withNavigation } from "@react-navigation/compat";
import PropTypes from "prop-types";
import {
	StyleSheet,
	Dimensions,
	Image,
	TouchableWithoutFeedback,
} from "react-native";
import { Block, Text, theme } from "galio-framework";
import { SharedElement } from "react-navigation-shared-element";
import _ from "lodash";

import { argonTheme } from "../constants";

class Card extends React.Component {
	render() {
		const {
			navigation,
			item,
			horizontal,
			full,
			style,
			ctaColor,
			imageStyle,
			onPress,
		} = this.props;

		const imageStyles = [
			full ? styles.fullImage : styles.horizontalImage,
			imageStyle,
		];
		const cardContainer = [styles.card, styles.shadow, style];
		const imgContainer = [
			styles.imageContainer,
			horizontal ? styles.horizontalStyles : styles.verticalStyles,
			styles.shadow,
		];

		return (
			<Block row={horizontal} card flex style={cardContainer}>
				<TouchableWithoutFeedback onPress={onPress}>
					<Block flex style={imgContainer}>
						<SharedElement id={`item.${item.id}.image`}>
							<Image
								source={{
									uri: item.products[0].image,
								}}
								style={imageStyles}
							/>
						</SharedElement>
					</Block>
				</TouchableWithoutFeedback>
				<TouchableWithoutFeedback onPress={onPress}>
					<Block flex space="between" style={styles.cardDescription}>
						<Block flex row space="between">
							<SharedElement id={`item.${item.id}.title`}>
								<Text bold h3 style={styles.cardTitle}>
									{item.title}
								</Text>
							</SharedElement>
							<SharedElement id={`item.${item.id}.price`}>
								<Text h3 style={styles.cardTitle}>
									${item.price}
								</Text>
							</SharedElement>
						</Block>
						<SharedElement id={`item.${item.id}.description`}>
							<Text size={12} muted={!ctaColor} color={ctaColor} bold>
								{item.description}
							</Text>
						</SharedElement>
					</Block>
				</TouchableWithoutFeedback>
			</Block>
		);
	}
}

Card.propTypes = {
	item: PropTypes.object,
	horizontal: PropTypes.bool,
	full: PropTypes.bool,
	ctaColor: PropTypes.string,
	imageStyle: PropTypes.any,
};

const styles = StyleSheet.create({
	card: {
		backgroundColor: theme.COLORS.WHITE,
		marginVertical: theme.SIZES.BASE,
		borderWidth: 0,
		minHeight: 114,
		marginBottom: 16,
	},
	cardTitle: {
		flex: 1,
		flexWrap: "wrap",
		paddingBottom: 6,
	},
	cardDescription: {
		padding: theme.SIZES.BASE / 2,
	},
	imageContainer: {
		borderRadius: 3,
		elevation: 1,
		overflow: "hidden",
	},
	image: {
		// borderRadius: 3,
	},
	horizontalImage: {
		height: 122,
		width: "auto",
	},
	horizontalStyles: {
		borderTopRightRadius: 0,
		borderBottomRightRadius: 0,
	},
	verticalStyles: {
		borderBottomRightRadius: 0,
		borderBottomLeftRadius: 0,
	},
	fullImage: {
		height: 215,
	},
	shadow: {
		shadowColor: theme.COLORS.BLACK,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 4,
		shadowOpacity: 0.1,
		elevation: 2,
	},
});

export default withNavigation(Card);
