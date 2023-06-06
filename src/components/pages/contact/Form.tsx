'use client';

import * as React from 'react';
import styles from './Form.module.scss';
import Overlay from './Overlay';
import Loader from './Loader';
import Alert from './Alert';
import Button from './Button';

declare global {
	interface Window {
		grecaptcha: any;
	}
}

interface formFeedback {
	type: '' | 'error' | 'success' | 'sending';
	message: string;
}

let API_HOST = 'http://localhost:5000';
if (import.meta.env.MODE === 'production') API_HOST = 'https://api.jace.info';

const RECAPTCHA_ERROR_MESSAGE = 'Captcha could not be verified. Please try again.';
const SENDING_ERROR_MESSAGE =
	'There was a problem sending your message, please try again. If the problem perists please email info@jace.info.';
const SENDING_SUCCESS_MESSAGE = 'Your message was sent successfully.';
const SENDING_MESSAGE = 'Sending';

export default function Contact() {
	const [inputs, setInputs] = React.useState({
		name: '',
		email: '',
		message: ''
	});
	const [formFeedback, setFormFeedback] = React.useState<formFeedback>({
		type: '',
		message: ''
	});

	function handleChange(element: { target: { id: any; value: any } }) {
		setInputs((prev) => ({
			...prev,
			[element.target.id]: element.target.value
		}));
	}

	async function checkRecaptcha(token: string) {
		const response = await fetch(`${API_HOST}/api/verify`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				gRecaptchaResponse: token
			})
		}).catch((error) => {
			console.log(error);
		});

		return response;
	}

	async function onSubmitForm(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setFormFeedback({ type: 'sending', message: SENDING_MESSAGE });

		window.grecaptcha.ready(() => {
			window.grecaptcha
				.execute('6LfjPjsfAAAAAPQllouwQrnZ_mTdJjAacliDMDQ4', { action: 'contactSubmit' })
				.then(async (token: string) => {
					const response = await checkRecaptcha(token);

					const { status } = await response?.json();

					console.log(status);

					if (status !== 200) {
						setFormFeedback({ type: 'error', message: RECAPTCHA_ERROR_MESSAGE });
					} else {
						sendMessage();
					}
				});
		});
	}

	async function sendMessage() {
		if (inputs.name && inputs.email && inputs.message) {
			try {
				const response = await fetch(`${API_HOST}/api/send`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(inputs)
				});

				const { status } = await response.json();

				if (status !== 200) {
					setFormFeedback({ type: 'error', message: SENDING_ERROR_MESSAGE });
					return;
				}

				setFormFeedback({ type: 'success', message: SENDING_SUCCESS_MESSAGE });

				setInputs({
					name: '',
					email: '',
					message: ''
				});
			} catch (error) {
				setFormFeedback({ type: 'error', message: SENDING_ERROR_MESSAGE });
			}
		}
	}

	return (
		<>
			{formFeedback.type === 'sending' && (
				<Overlay>
					<Loader>{formFeedback.message}</Loader>
				</Overlay>
			)}

			{(formFeedback.type === 'error' || formFeedback.type === 'success') && (
				<Alert type={formFeedback.type}>{formFeedback.message}</Alert>
			)}

			<form onSubmit={(event) => onSubmitForm(event)} className={styles.form}>
				<div className={styles.row}>
					<label htmlFor="name" className={styles.label}>
						Your name <span className={styles.required}>(required)</span>
					</label>
					<input
						id="name"
						type="text"
						value={inputs.name}
						className={styles.input}
						onChange={handleChange}
						required
					/>
				</div>

				<div className={styles.row}>
					<label htmlFor="email" className={styles.label}>
						Your email address <span className={styles.required}>(required)</span>
					</label>
					<input
						id="email"
						type="email"
						className={styles.input}
						value={inputs.email}
						onChange={handleChange}
						required
					/>
				</div>

				<div className={styles.row}>
					<label htmlFor="message" className={styles.label}>
						Your message <span className={styles.required}>(required)</span>
					</label>
					<textarea
						id="message"
						className={styles.input}
						value={inputs.message}
						onChange={handleChange}
						rows={5}
						required
					/>
				</div>

				<Button>Send your message</Button>
			</form>
		</>
	);
}
