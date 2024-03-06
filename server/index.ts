import express from 'express';
import { realTimeDB, firestoreDB } from './db';
import cors from 'cors';
import { nanoid } from 'nanoid';

const port = 3000;

const app = express();
app.use(express.json());
app.use(cors());

const usersCollection = firestoreDB.collection('users');
const roomsCollection = firestoreDB.collection('rooms');

/* ### SignUp and Authentication (FIRESTORE DB) ### */
/* SignUp */
app.post('/signup', (req, res) => {
	const { email, name } = req.body;
	usersCollection
		.where('email', '==', email)
		.get()
		.then((snapshot) => {
			if (snapshot.empty) usersCollection.add({ email, name }).then((newUserRef) => res.json({ id: newUserRef.id }));
			else res.status(400).json({ error: 'User already exists' });
		});
});

/* Auth o login*/
app.post('/auth', (req, res) => {
	const { email } = req.body;
	usersCollection
		.where('email', '==', email)
		.get()
		.then((snapshot) => {
			if (snapshot.empty) res.status(400).json({ error: 'User not found' });
			else res.json({ message: 'User found', id: snapshot.docs[0].id });
		});
});

/* ### Rooms (REALTIME DB y FIRESTORE DB) ### */
app.post('/rooms', (req, res) => {
	const { userId } = req.body;
	usersCollection
		.doc(userId.toString())
		.get()
		.then((user) => {
			if (user.exists) {
				const roomRef = realTimeDB.ref(`chatroom/rooms/${nanoid()}`);
				roomRef.set({ messages: [], owner: userId }).then((rtdbRes) => {
					const roomLongId = roomRef.key;
					const roomId = 1000 + Math.floor(Math.random() * 999);
					roomsCollection
						.doc(roomId.toString())
						.set({ rtdbRoomId: roomLongId })
						.then(() => {
							res.json({ message: 'Room created', roomId: roomId.toString() });
						});
				});
			} else {
				res.status(401).json({ error: 'User does not exists' });
			}
		});
});

app.get('/rooms/:roomId', (req, res) => {
	const { userId } = req.query;
	const { roomId } = req.params;

	usersCollection
		.doc(userId.toString())
		.get()
		.then((user) => {
			if (user.exists) {
				roomsCollection
					.doc(roomId)
					.get()
					.then((room) => {
						if (room.exists) res.json(room.data());
						else res.status(401).json({ error: 'Room does not exists' });
					});
			} else {
				res.status(401).json({ error: 'User does not exists' });
			}
		});
});

app.listen(port, () => console.log(`-------- Server is running on port ${3000} -------- `));
