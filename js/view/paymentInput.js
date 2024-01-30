import updateModel from './../utils/updateModel.js';

function init( getData ) {
	const input = document.querySelector( '#input-downpayment' );

	const settings = {
		numeral: true,
		numeralThousandsGroupStyle: 'thousand',
		delimiter: ' ',
	};

	const cleaveInput = new Cleave( input, settings );
	cleaveInput.setRawValue( getData().payment ); // исходная цена при первоначалке 50%

	// Слежка за вводом суммы первоначального взноса пользователем
	input.addEventListener( 'input', function () {
		const value = +cleaveInput.getRawValue();

		// Проверка на мин. и макс. сумму первоначального взноса
		if ( value < getData().getMinPayment() || value > getData().getMaxPayment() ) {
			input.closest( '.param__details' ).classList.add( 'param__details--error' );
		}

		if ( value >= getData().getMinPayment() && value <= getData().getMaxPayment() ) {
			input.closest( '.param__details' ).classList.remove( 'param__details--error' );
		}

		updateModel( input, {
			payment: value,
			onUpdate: 'inputPayment',
		} );
	} );

	// Слежка за выходом из поля ввода суммы первоначального взноса
	input.addEventListener( 'change', function () {
		const value = +cleaveInput.getRawValue();

		if ( value > getData().getMaxPayment() ) {
			input.closest( '.param__details' ).classList.remove( 'param__details--error' );
			cleaveInput.setRawValue( getData().getMaxPayment() ); // макс. сумма первоначального взноса
		}

		if ( value < getData().getMinPayment() ) {
			input.closest( '.param__details' ).classList.remove( 'param__details--error' );
			cleaveInput.setRawValue( getData().getMinPayment() ); // мин. сумма первоначального взноса
		}

		updateModel( input, {
			// payment: +cleaveInput.getRawValue(),
			payment: value,
			onUpdate: 'inputPayment',
		} );
	} );

	return cleaveInput;
}

export default init;
