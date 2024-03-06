import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import * as lodash from 'lodash';

const firebaseConfig = {
	apiKey: 'dXdC7ZJh1KyRK3QkYXRqqMhzbO4RiLaPVEPbourD',
	projectId: 'apx-dwf-m6-56070',
	databaseURL: 'https://apx-dwf-m6-56070-default-rtdb.firebaseio.com',
	authDomain: 'apx-dwf-m6-56070.firebaseapp.com',
};

const app = initializeApp(firebaseConfig);

const rtdb = getDatabase(app);

export { rtdb };

// const chatroomsRef = ref(database, '/chatroom/messages');
// onValue(
// 	chatroomsRef,
// 	(snapshot) => {
// 		const data = snapshot.val();
// 		const dataArray = lodash.map(data);
// 		document.querySelector('.root').querySelector('chat-page').shadowRoot.querySelector('.chat-container').innerHTML = `
// 						${dataArray
// 							.map((el) => {
// 								return `<p>${el.from}: ${el.message}</p>`;
// 								/* Ver de hacer un <custom-text> */
// 							})
// 							.join('')}
// 					`;
// 	},
// 	(error) => {
// 		console.error('Error al escuchar cambios en la base de datos:', error);
// 	},
// );
