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
	/* PASARLO al state */
	render() {
		this.shadow.innerHTML = `
        <custom-header></custom-header>
        <div class="content-container">
            <custom-text variant="title">Bienvenido</custom-text>
            <form class="home-form">
                <label> <custom-text>Email:</custom-text> <input type="email" class="fieldset-input email" required> </label>
                <label> <custom-text>Nombre:</custom-text> <input type="text" class="fieldset-input name" required> </label>
                <label> 
                   <custom-text>Room:</custom-text> 
                   <select name="room-type" class="select-room">
                      <option value="Nueva Room">Nueva Room</option>
                      <option value="Room existente">Room existente</option>
                   </select> 
                </label>
                <label class="room-id-label disabled"> <custom-text>Room id:</custom-text> <input type="text" class="fieldset-input room-id-input" placeholder="ABC123" required disabled> </label>
                <button class="submit-button"><custom-text variant="large">Comenzar</custom-text></button>
            </form>
            <button class="submit-button sign-up-button"><custom-text variant="large">Registrarse</custom-text></button>
        </div>
        `;
		/* No puedo usar los componentes button y fieldset porque no se lleva bien con el form */
		/* Para el button podría hacer un custom event que cuando haga click en el componente se dispare el submit del form, pero para el fieldset no se me ocurriria como */

		const selectEl = this.shadow.querySelector('.select-room') as HTMLSelectElement;
		const roomIdLabel = this.shadow.querySelector('.room-id-label') as HTMLLabelElement;

		selectEl.addEventListener('change', () => {
			roomIdLabel.classList.toggle('disabled');
			roomIdLabel.querySelector('.room-id-input').toggleAttribute('disabled');
		});

		const formEl = this.shadow.querySelector('.home-form');
		const nameEl = formEl.querySelector('.name') as HTMLInputElement;
		const emailEl = formEl.querySelector('.email') as HTMLInputElement;

		formEl.addEventListener('submit', (e) => {
			e.preventDefault();
			const name = nameEl.value;
			const email = emailEl.value;

			state.signIn(name, email).then((data) => {
				// Si hay un mensaje es porque se encontró el usuario, significa que está en la db
				// Por ende setear el mail y el name en el estado
				if (data.message) {
					const userId = data.id;
					state.setName(name);
					state.setEmail(email);
					state.setUserId(userId);

					if (roomIdLabel.classList.contains('disabled'))
						state.createRoom().then((data) => {
							if (data.roomId) {
								state.setRoomId(data.roomId.toString());
								Router.go('/chat');
							} else {
								alert('Error al crear la sala');
							}
						});
					else {
						// Unirse a room existente
						const roomId = roomIdLabel.querySelector('.room-id-input') as HTMLInputElement;
						state.setRoomId(roomId.value);
						Router.go('/chat');
					}
				} else {
					// Si no hay mensaje es porque no se encontró el usuario
					// Significa que no está en la db, por ende que se registre
					alert('Usuario no encontrado, verifique que haya colocado bien el email y el nombre, o por favor regístrese');
				}
			});
		});

		const signUpButton = this.shadow.querySelector('.sign-up-button');
		signUpButton.addEventListener('click', () => Router.go('/signup'));

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
        .sign-up-button {
            margin-top: 15px;
            background-color: #FBA834;
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
        .room-id-label.disabled {
            display: none;
        }
        `;

		this.shadow.appendChild(style);
	}
}
customElements.define('home-page', HomePage);
