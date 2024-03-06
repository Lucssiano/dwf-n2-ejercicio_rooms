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
