import React, { useEffect } from 'react'
import { Text, StyleSheet, Animated } from 'react-native'

type ToastProps = {
	message: string
	visible: boolean
	onHide: () => void
}

export function Toast({ message, visible, onHide }: ToastProps) {
	const opacity = new Animated.Value(0)

	useEffect(() => {
		if (visible) {
			// fade in
			Animated.timing(opacity, {
				toValue: 1,
				duration: 300,
				useNativeDriver: true
			}).start()
			// auto hide after X seconds
			const timer = setTimeout(() => {
				Animated.timing(opacity, {
					toValue: 0,
					duration: 300,
					useNativeDriver: true
				}).start(() => onHide())
			}, 3000)
			return () => clearTimeout(timer)
		}
	}, [visible])

	if (!visible) {
		return null
	}

	return (
		<Animated.View style={[styles.container, { opacity }]}>
			<Text style={styles.text}>{message}</Text>
		</Animated.View>
	)
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 50,
		left: 20,
		right: 20,
		backgroundColor: 'rgba(0,0,0,0.8)',
		padding: 15,
		borderRadius: 8,
		zIndex: 999
	},
	text: {
		color: '#fff',
		fontSize: 16,
		textAlign: 'center'
	}
})
