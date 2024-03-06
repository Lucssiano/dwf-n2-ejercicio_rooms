import * as lodash from 'lodash';
import { rtdb } from './rtdb';
import { ref, onValue } from 'firebase/database';

// type Message = {
// 	from: string;
// 	message: string;
// };

const API_BASE_URL = 'http://localhost:3000';

export const state = {
	data: {
		name: '',
		messages: [],
	},
	listeners: [],
	init() {
		// localStorage.removeItem('name');
		const chatroomsRef = ref(rtdb, '/chatroom/messages');
		onValue(
			chatroomsRef,
			(snapshot) => {
				const data = snapshot.val();
				const dataArray = lodash.map(data);

				const currentState = this.getState();
				currentState.messages = dataArray;
				this.setState(currentState);
			},
			(error) => {
				console.error('Error al escuchar cambios en la base de datos:', error);
			},
		);
	},
	getState() {
		return this.data;
	},
	setState(newState) {
		this.data = newState;
		this.listeners.forEach((callback) => callback());
		console.log('nueva data', this.data);
	},
	setName(name: string) {
		const currentState = this.getState();
		currentState.name = name;
		// localStorage.setItem('name', name);
		this.setState(currentState);
	},
	pushMessage(message: string) {
		const currentState = this.getState();
		fetch(`${API_BASE_URL}/messages`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ from: currentState.name, message: message }),
		});
	},
	subscribe(callback: (any) => any) {
		this.listeners.push(callback);
	},
};
