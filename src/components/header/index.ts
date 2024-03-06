class Header extends HTMLElement {
		constructor() {
			super();
			this.render();
		}
		render() {
			const shadow = this.attachShadow({ mode: 'open' });

			const divRoot = document.createElement('header');
			divRoot.classList.add('header');

			const style = document.createElement('style');
			style.innerHTML = `
					.header {
						height: 60px;
						width: 100%;
						background-color: #FF8282;
					}
			`;

			shadow.appendChild(style);
			shadow.appendChild(divRoot);
		}
	}
customElements.define('custom-header', Header);
