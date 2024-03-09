import { Router } from '@vaadin/router';
import { state } from '../../state';
const API_BASE_URL = 'http://localhost:3000';

class SignUpPage extends HTMLElement {
	shadow: ShadowRoot;
	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: 'open' });
	}
	connectedCallback() {
		this.render();
	}
	render() {
		this.shadow.innerHTML = `
        <custom-header></custom-header>
        <div class="content-container">
            <custom-text variant="title">Bienvenido</custom-text>
            <form class="sign-up-form">
                <label> <custom-text>Email:</custom-text> <input type="email" class="fieldset-input email" required> </label>
                <label> <custom-text>Nombre:</custom-text> <input type="text" class="fieldset-input name" required> </label>
                <button class="submit-button"><custom-text variant="large">Confirmar Registro</custom-text></button>
            </form>
            <button class="submit-button home-button"><custom-text variant="large">Volver a la Home</custom-text></button>
        </div>
        `;

		const formEl = this.shadow.querySelector('.sign-up-form');
		const nameEl = formEl.querySelector('.name') as HTMLInputElement;
		const emailEl = formEl.querySelector('.email') as HTMLInputElement;
		formEl.addEventListener('submit', (e) => {
			e.preventDefault();
			const name = nameEl.value;
			const email = emailEl.value;

			state.signUp(name, email).then((data) => {
				if (data.message) {
					// Poner por un tiempo un cartel que diga que se registró correctamente y que se está volviendo a la home
					alert(data.message + ' ,se volvera a la Home');
					Router.go('/home');
				} else {
					alert('Error al registrarse, este usuario ya existe, volve a la home y logueate');
				}
			});
		});

		const homeButton = this.shadow.querySelector('.home-button');
		homeButton.addEventListener('click', () => Router.go('/home'));

		const style = document.createElement('style');
		style.innerHTML = `
        * {
            box-sizing: border-box;
        }
        .content-container{
            max-width: 350px;
            padding: 30px;
            margin: 0 auto;
        }
        .sign-up-form{
            margin-top: 10px;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        .submit-button {
            cursor: pointer;
            border: none;
            border-radius: 4px;
            padding: 15px 0;		
            text-align: center;		
            width: 100%;
            background-color:#9CBBE9;		
        }
        .fieldset-input {
            width: 100%;
            height: 30px;
            border: 1px solid #000;
            border-radius: 4px;
            padding: 10px;
        }
        .home-button {
            margin-top: 15px;
            background-color: #FBA834;
        }
        `;

		this.shadow.appendChild(style);
	}
}
customElements.define('sign-up-page', SignUpPage);
