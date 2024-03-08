import * as lodash from 'lodash';
import { rtdb } from './rtdb';
import { ref, onValue } from 'firebase/database';

const API_BASE_URL = 'http://localhost:3000';

export const state = {
	data: {
		name: '',
		email: '',
		messages: [],
		roomId: '',
		roomOwnerName: '',
	},
	listeners: [],
	// No se si llamarle init o de otra manera, pq en realidad no está al principio del todo
	init() {
		// localStorage.removeItem('name');
		const currentState = this.getState();
		fetch(`${API_BASE_URL}/rooms/${currentState.roomId}`)
			.then((res) => res.json())
			.then((data) => {
				const rtdbRoomId = data.rtdbRoomId;
				// state.setRoomOwnerName(rtdbRoomId); // Ver donde ponerlo
				const chatroomsRef = ref(rtdb, `/chatroom/rooms/${rtdbRoomId}/messages`);

				// const ownerRef = ref(rtdb, `/chatroom/rooms/${rtdbRoomId}/owner`);
				// leerlo una vez
				// tendria que obtener el id del usuario y comparar si es igual con el del owner

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
			});
	},
	getState() {
		return this.data;
	},
	setState(newState) {
		this.data = newState;
		this.listeners.forEach((callback) => callback());
		console.log('nueva data', this.data);
	},
	// setRoomOwnerName(roomId: string) {
	// 	const currentState = this.getState();
	// },
	setName(name: string) {
		const currentState = this.getState();
		currentState.name = name;
		this.setState(currentState);
	},
	setEmail(email: string) {
		const currentState = this.getState();
		currentState.email = email;
		this.setState(currentState);
	},
	setRoomId(roomId: string) {
		const currentState = this.getState();
		currentState.roomId = roomId;
		this.setState(currentState);
	},
	pushMessage(message: string) {
		const currentState = this.getState();
		fetch(`${API_BASE_URL}/rooms/${currentState.roomId}`)
			.then((res) => res.json())
			.then((data) => {
				const rtdbRoomId = data.rtdbRoomId;
				fetch(`${API_BASE_URL}/messages/${rtdbRoomId}`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ from: currentState.name, message }),
				});
			});

		// fetch(`${API_BASE_URL}/messages`, {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 	},
		// 	body: JSON.stringify({ from: currentState.name, message: message }),
		// });
	},
	subscribe(callback: (any) => any) {
		this.listeners.push(callback);
	},
};
