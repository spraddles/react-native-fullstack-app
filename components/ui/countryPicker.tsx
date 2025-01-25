import React, { useState } from 'react'
import {
	View,
	Text,
	Modal,
	TouchableOpacity,
	FlatList,
	TextInput,
	StyleSheet,
	SafeAreaView
} from 'react-native'

import countries from '@/assets/data/countries.json'

interface Props {
	onSelect: void
	selectedCountry: object
	error?: boolean
	errorText?: string
}

export const CountryPicker = ({ onSelect, selectedCountry, error = false, errorText }): Props => {
	const [modalVisible, setModalVisible] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')

	const filteredCountries = countries.filter((country) =>
		country.name.toLowerCase().includes(searchQuery.toLowerCase())
	)

	const handleSelect = (country) => {
		onSelect(country)
		setModalVisible(false)
		setSearchQuery('')
	}

	const renderCountry = ({ item }) => (
		<TouchableOpacity style={styles.countryItem} onPress={() => handleSelect(item)}>
			<Text style={styles.flag}>{item.flag}</Text>
			<Text style={styles.countryName}>{item.name}</Text>
		</TouchableOpacity>
	)

	return (
		<View style={styles.container}>
			<Text style={styles.label}>Nationality</Text>
			<TouchableOpacity
				style={[styles.pickerButton, error && styles.errorInput]}
				onPress={() => setModalVisible(true)}
			>
				<Text style={styles.flag}>{selectedCountry ? selectedCountry.flag : '🌎'}</Text>
				{selectedCountry && <Text style={styles.selectedText}>{selectedCountry.name}</Text>}
				{!selectedCountry && <Text style={styles.placeholder}>Select</Text>}
			</TouchableOpacity>
			{error && errorText && <Text style={styles.errorText}>{errorText}</Text>}

			<Modal visible={modalVisible} animationType="slide" transparent={true}>
				<SafeAreaView style={styles.modalContainer}>
					<View style={styles.header}>
						<TouchableOpacity
							onPress={() => {
								setModalVisible(false)
								setSearchQuery('')
							}}
							style={styles.closeButton}
						>
							<Text style={styles.closeButtonText}>Close</Text>
						</TouchableOpacity>
						<Text style={styles.title}>Select Country</Text>
					</View>

					<View style={styles.searchContainer}>
						<TextInput
							style={styles.searchInput}
							placeholder="Search countries..."
							value={searchQuery}
							onChangeText={setSearchQuery}
							autoCorrect={false}
							clearButtonMode="while-editing"
						/>
					</View>

					<FlatList
						data={filteredCountries}
						renderItem={renderCountry}
						keyExtractor={(item) => item.code}
						keyboardShouldPersistTaps="handled"
					/>
				</SafeAreaView>
			</Modal>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		marginBottom: 16
	},
	pickerButton: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 12,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#ddd',
		backgroundColor: '#fff'
	},
	flag: {
		fontSize: 20,
		marginRight: 10
	},
	label: {
		fontSize: 13,
		marginBottom: 8,
		color: '#333'
	},
	selectedText: {
		fontSize: 16,
		color: '#000'
	},
	placeholder: {
		fontSize: 18,
		color: '#aaa'
	},
	errorInput: {
		borderColor: '#ff3333'
	},
	errorText: {
		color: '#ff3333',
		fontSize: 14,
		marginTop: 4
	},
	modalContainer: {
		flex: 1,
		backgroundColor: '#fff'
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#eee'
	},
	closeButton: {
		position: 'absolute',
		left: 16,
		zIndex: 1
	},
	closeButtonText: {
		color: '#007AFF',
		fontSize: 16
	},
	title: {
		flex: 1,
		textAlign: 'center',
		fontSize: 17,
		fontWeight: '600'
	},
	searchContainer: {
		padding: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#eee'
	},
	searchInput: {
		height: 40,
		backgroundColor: '#f1f1f1',
		paddingHorizontal: 12,
		borderRadius: 8
	},
	countryItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 12,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: '#ccc'
	},
	countryName: {
		fontSize: 16,
		color: '#333'
	}
})
