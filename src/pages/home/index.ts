import { Router } from '@vaadin/router';
import { state } from '../../state';

class HomePage extends HTMLElement {
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
            <form class="home-form">
                <label> <custom-text>Email:</custom-text> <input type="email" class="fieldset-input" required> </label>
                <label> <custom-text>Nombre:</custom-text> <input type="text" class="fieldset-input" required> </label>
                <label> 
                   <custom-text>Room:</custom-text> 
                   <select name="room-type" class="select-room">
                      <option value="Nueva Room">Nueva Room</option>
                      <option value="Room existente">Room existente</option>
                   </select> 
                </label>
                <label class="room-id-label"> <custom-text>Room id:</custom-text> <input type="text" class="fieldset-input" placeholder="ABC123" required> </label>
                <button class="submit-button"><custom-text variant="large">Comenzar</custom-text></button>
            </form>
        </div>
        `;
		/* No puedo usar los componentes button y fieldset porque no se lleva bien con el form */
		/* Para el button podría hacer un custom event que cuando haga click en el componente se dispare el submit del form, pero para el fieldset no se me ocurriria como */

		const selectEl = this.shadow.querySelector('.select-room') as HTMLSelectElement;
		const roomIdLabel = this.shadow.querySelector('.room-id-label') as HTMLLabelElement;

		selectEl.addEventListener('change', () => roomIdLabel.classList.toggle('room-id-label'));

		const formEl = this.shadow.querySelector('.home-form');
		formEl.addEventListener('submit', (e) => {
			e.preventDefault();
			const form = e.target as HTMLFormElement;
			const inputValue = (form.querySelector('.fieldset-input') as HTMLInputElement).value;
			state.setName(inputValue);
			Router.go('/chat');
		});

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
        .home-form{
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
        .select-room, .fieldset-input {
            width: 100%;
            height: 30px;
            border: 1px solid #000;
            border-radius: 4px;
            padding: 10px;
        }
        .select-room {
            padding: 5px;
        }
        .room-id-label {
            display: none;
        }
        `;

		this.shadow.appendChild(style);
	}
}
customElements.define('home-page', HomePage);
