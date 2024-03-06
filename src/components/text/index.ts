class TextComponent extends HTMLElement {
	shadow: ShadowRoot;
	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: 'open' });
	}
	connectedCallback() {
		this.render();
	}
	render() {
		const variant = this.getAttribute('variant') || 'body';

		const div = document.createElement('div');
		div.textContent = this.textContent;
		div.className = variant;

		const style = document.createElement('style');
		style.textContent = `
						.body {
								font-family: 'Roboto', sans-serif;
								font-size: 18px;
						}
						.title {
								font-family: 'Roboto', sans-serif;
								font-size: 35px;
								font-weight: 700;
						}
						.large {
								font-family: 'Roboto', sans-serif;
								font-size: 22px;
								font-weight: 500;
						}
						`;

		this.shadow.appendChild(div);
		this.shadow.appendChild(style);
	}
}
customElements.define('custom-text', TextComponent);
