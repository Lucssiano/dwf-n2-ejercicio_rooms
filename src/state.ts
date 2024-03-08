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
		roomOwnerId: '',
		userId: '',
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
				const messagesRef = ref(rtdb, `/chatroom/rooms/${rtdbRoomId}/messages`);

				onValue(
					messagesRef,
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
				
				const ownerRef = ref(rtdb, `/chatroom/rooms/${rtdbRoomId}/owner`)
				onValue(ownerRef, (snapshot) => {
					const data = snapshot.val();
					state.setRoomOwnerId(data);					
				},
				(error) => {
					console.error('Error al escuchar cambios en la base de datos:', error);
				},
			    {
					onlyOnce : true
				});
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
	setRoomOwnerId(userId: string) {
		const currentState = this.getState();
		currentState.roomOwnerId = userId;
		this.setState(currentState);
	},
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
	setUserId(userId: string) {
		const currentState = this.getState();
		currentState.userId = userId;
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
