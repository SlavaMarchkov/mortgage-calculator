import updateModel from './../utils/updateModel.js';

function init( getData ) {
	const data = getData();
	const input = document.querySelector( '#input-term' );

	const settings = {
		numeral: true,
		numeralThousandsGroupStyle: 'thousand',
		delimiter: ' ',
	};

	const cleaveInput = new Cleave( input, settings );
	cleaveInput.setRawValue( data.time ); // исходный срок ипотеки

	// Слежка за вводом срока ипотеки пользователем
	input.addEventListener( 'input', function () {
		const value = +cleaveInput.getRawValue();

		// Проверка на мин. и макс. срок ипотеки
		if ( value < data.minYears || value > data.maxYears ) {
			input.closest( '.param__details' ).classList.add( 'param__details--error' );
		}

		if ( value >= data.minYears && value <= data.maxYears ) {
			input.closest( '.param__details' ).classList.remove( 'param__details--error' );
		}

		updateModel( input, {
			time: value,
			onUpdate: 'inputTime',
		} );
	} );

	// Слежка за выходом из поля ввода цены
	input.addEventListener( 'change', function () {
		const value = +cleaveInput.getRawValue();

		if ( value > data.maxYears ) {
			input.closest( '.param__details' ).classList.remove( 'param__details--error' );
			cleaveInput.setRawValue( data.maxYears ); // макс. срок ипотеки
		}

		if ( value < data.minYears ) {
			input.closest( '.param__details' ).classList.remove( 'param__details--error' );
			cleaveInput.setRawValue( data.minYears ); // мин. срок ипотеки
		}

		updateModel( input, {
			time: +cleaveInput.getRawValue(),
			onUpdate: 'inputTime',
		} );
	} );

	return cleaveInput;
}

export default init;
