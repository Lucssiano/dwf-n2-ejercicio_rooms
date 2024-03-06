import { Router } from '@vaadin/router';
import { state } from '../../state';

type Message = {
	from: string;
	message: string;
};

class ChatPage extends HTMLElement {
	shadow: ShadowRoot;
	messages: Message[];
	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: 'open' });
	}
	connectedCallback() {
		state.subscribe(() => {
			const currentState = state.getState();
			this.messages = currentState.messages;
			this.render();
			// this.addTypeOfMessage();
		});
		this.render();
		state.init();
		// this.addTypeOfMessage();
	}
	// addTypeOfMessage() {
	// 	console.log(state.getState().name);
	// 	if (state.getState().name == 'pepe') {
	// 		console.log(document.querySelector('.message-text-container'));
	// 		document.querySelector('.message-text-container')?.classList.add('other');
	// 	}
	// }
	render() {
		this.shadow.innerHTML = `
            <custom-header></custom-header>
            <div class="content-container">
                <custom-text variant="title">Chat</custom-text>
                <div class="chat-container">
                ${
									this.messages
										?.map(
											(el) => `
                <div class="message-container">
                    <span class="message-from ${el.from.toLowerCase() == 'lucho' ? 'mine' : ''}">${el.from}</span>
                    <div class="message-text-container ${el.from.toLowerCase() == 'lucho' ? 'mine' : ''}">
                        <p class="message-text">${el.message}</p>
                    </div>
                </div>`,
										)
										.join('') || ''
								}   
                </div>
                <form class="chat-form">
                    <input type="text" class="fieldset-input" required>
                    <button class="submit-button"><custom-text variant="large">Enviar</custom-text></button>
                </form>
            </div>
        `;
		/* Los mensajes de "lucho" siempre se ven en verde y cualquier otro mensaje se ve en gris y el nombre arriba */

		/* No puedo usar los componentes button y fieldset porque no se lleva bien con el form */
		/* Ver como hacer para que se vea como un mensaje mio o de otro */
		/* Para el button podría hacer un custom event que cuando haga click en el componente se dispare el submit del form, pero para el fieldset no se me ocurriria como */
		const formEl = this.shadow.querySelector('.chat-form');
		formEl.addEventListener('submit', (e) => {
			e.preventDefault();
			if (state.getState().name) {
				const form = e.target as HTMLFormElement;
				const inputValue = (form.querySelector('.fieldset-input') as HTMLInputElement).value;
				state.pushMessage(inputValue);
				form.reset();
			} else {
				alert('No se asignó un nombre para el chat, se te redirigirá al Home para que indiques tu nombre');
				Router.go('/home');
			}
		});

		const style = document.createElement('style');
		style.innerHTML = `
        * {
            box-sizing: border-box;
        }
        .content-container{
            padding: 15px 30px;
            height: 90vh;
            max-width: 600px;
            margin: 0 auto;
        }
        .chat-container {
            margin-top: 10px;
            height: 60%;
            overflow: auto;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        .message-container {
            display: flex;
            flex-direction: column;
        }
        .message-from {
            color: #A5A5A5;
            font-family: 'Roboto', sans-serif;
            font-size: 14px;
        }
        .message-from.mine {
            display: none;
        }
        .message-text-container {
            margin-top: 3px;
            background-color: #D8D8D8;
            border-radius: 4px;
            width: fit-content;
        }
        .message-text-container.mine {
            background-color: #B9E97C;
            align-self: flex-end;
            margin-right: 15px;
        }
        .message-text {
            margin: 0;
            padding: 10px;
            font-family: 'Roboto', sans-serif; 
            font-size: 18px;
        }
        .chat-form {
            margin-top: 10px;
            display: flex;
            flex-direction: column;
            gap: 10px;
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
            height: 30px;
            border: 1px solid #000;
            border-radius: 4px;
            width: 100%;
        }
        `;

		this.shadow.appendChild(style);
	}
}
customElements.define('chat-page', ChatPage);

//    ${
// 								${dataArray
// 									.map((el) => {
// 										return `<p>${el.from}: ${el.message}</p>`;
// 										/* Ver de hacer un <custom-text> */
// 									})
// 									.join('')}
// 							;}
