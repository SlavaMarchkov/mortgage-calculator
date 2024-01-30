import * as Model from './model.js';
import updateResultsView from './view/updateResultsView.js';
import programs from './view/radioPrograms.js';
import { updateMinPercent } from './view/utils.js';

import costInput from './view/costInput.js';
import costRange from './view/costRange.js';

import paymentInput from './view/paymentInput.js';
import paymentRange from './view/paymentRange.js';

import timeInput from './view/timeInput.js';
import timeRange from './view/timeRange.js';

window.onload = function () {
	const getData = Model.getData;

	// Init mortgage programs
	programs( getData );

	// Init cost input
	const cleaveCost = costInput( getData );
	// Init cost range slider
	const sliderCost = costRange( getData );

	// Init payment input
	const cleavePayment = paymentInput( getData );
	// Init payment range slider
	const sliderPayment = paymentRange( getData );

	// Init time input
	const cleaveTime = timeInput( getData );
	// Init time range slider
	const sliderTime = timeRange( getData );

	// Launch data recalculation to display initial data
	Model.setData( {} );
	const results = Model.getResults();
	updateResultsView( results );

	// Listen to Custom Event
	document.addEventListener( 'updateForm', ( evt ) => {
		// Update data in the Model
		Model.setData( evt.detail );

		const data = Model.getData();
		const results = Model.getResults();

		// Update all form views based on model data
		updateFormAndSliders( data );

		// Update results block
		updateResultsView( results );
	} );

	function updateFormAndSliders( data ) {
		// on update radio buttons
		if ( data.onUpdate === 'radioProgram' ) {
			updateMinPercent( data );

			// update payment slider
			sliderPayment.noUiSlider.updateOptions( {
				range: {
					min: data.minPaymentPercent * 100,
					max: data.maxPaymentPercent * 100,
				},
			}, true );
		}

		// on moving property price slider
		if ( data.onUpdate !== 'inputCost' ) {
			cleaveCost.setRawValue( data.cost );
		}

		// on manually entering property cost into input field
		if ( data.onUpdate !== 'costSlider' ) {
			sliderCost.noUiSlider.set( data.cost );
		}

		// payment input in comparison to property price
		if ( data.onUpdate !== 'inputPayment' ) {
			cleavePayment.setRawValue( data.payment );
		}

		// on manually entering initial downpayment into input field
		if ( data.onUpdate !== 'paymentSlider' ) {
			sliderPayment.noUiSlider.set( data.paymentPercent * 100 );
		}

		// on moving time term slider
		if ( data.onUpdate !== 'inputTime' ) {
			cleaveTime.setRawValue( data.time );
		}

		// on manually entering time term into input field
		if ( data.onUpdate !== 'timeSlider' ) {
			sliderTime.noUiSlider.set( data.time );
		}
	}

	// Order form handler
	const openFormBtn = document.querySelector( '#openFormBtn' );
	const orderForm = document.querySelector( '#orderForm' );
	const submitFormBtn = document.querySelector( '#submitFormBtn' );

	openFormBtn.addEventListener( 'click', function () {
		orderForm.classList.remove( 'none' );
		openFormBtn.classList.add( 'none' );
	} );

	orderForm.addEventListener( 'submit', function ( evt ) {
		evt.preventDefault();

		// Gather all data from form inputs
		const formData = new FormData( orderForm );

		// Disable inputs
		submitFormBtn.setAttribute( 'disabled', 'disabled' );
		submitFormBtn.innerText = 'Заявка отправляется...';

		orderForm.querySelectorAll( 'input' ).forEach( ( input ) => {
			input.setAttribute( 'disabled', 'disabled' );
		} );

		fetchData().then( result => {
			submitFormBtn.removeAttribute( 'disabled' );
			submitFormBtn.innerText = 'Оставить заявку';

			orderForm.querySelectorAll( 'input' ).forEach( ( input ) => {
				input.removeAttribute( 'disabled' );
			} );
			orderForm.reset();
			orderForm.classList.add( 'none' );

			if ( result === 'SUCCESS' ) {
				document.getElementById( 'success' ).classList.remove( 'none' );
			} else {
				document.getElementById( 'error' ).classList.remove( 'none' );
			}
		} );

		async function fetchData() {
			const data = Model.getData();
			const results = Model.getResults();

			let url = checkOnUrl( document.location.href );

			const response = await fetch( url + 'mail.php', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json; charset=utf-8',
				},
				body: JSON.stringify( {
					form: {
						name: formData.get( 'name' ),
						email: formData.get( 'email' ),
						phone: formData.get( 'phone' ),
					},
					data,
					results,
				} ),
			} );

			return response.text();
		}

	} );
};

function checkOnUrl( url ) {
	let urlArrayDot = url.split( '?' )[0].split( '/' );
	urlArrayDot = urlArrayDot.filter( ( el ) => {
		return (el !== 'index.html');
	} );
	urlArrayDot = urlArrayDot.join( '/' );
	return !urlArrayDot.endsWith( '/' )
		   ? urlArrayDot + '/'
		   : urlArrayDot;
}
