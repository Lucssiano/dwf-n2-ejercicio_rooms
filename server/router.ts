import { Router } from '@vaadin/router';

(function () {
	const rootEl = document.querySelector('.root');
	const router = new Router(rootEl);
	router.setRoutes([
		{ path: '/', redirect: '/home' },
		{ path: '/home', component: 'home-page' },
		{ path: '/signup', component: 'sign-up-page' },
		{ path: '/chat', component: 'chat-page' },
	]);
})();
