import updateModel from './../utils/updateModel.js';

// инициализация радио-кнопок, чтобы в них подставлялись значения из модели
function init( getData ) {
	const radioButtons = document.querySelectorAll( 'input[name="program"]' );
	const { base, gov, it, zero } = getData().programs;

	// set program rates in radio-buttons
	document.querySelector( '#base-value' ).value = base;
	document.querySelector( '#it-value' ).value = it;
	document.querySelector( '#gov-value' ).value = gov;
	document.querySelector( '#zero-value' ).value = zero;

	// show program rates on page
	document.querySelector( '#base-text' ).innerText = base * 100 + '%';
	document.querySelector( '#it-text' ).innerText = it * 100 + '%';
	document.querySelector( '#gov-text' ).innerText = gov * 100 + '%';
	document.querySelector( '#zero-text' ).innerText = zero * 100 + '%';

	// навешиваем прослушку клика по радио-кнопкам
	radioButtons.forEach( function ( radioBtn ) {
		radioBtn.addEventListener( 'change', function () {
			updateModel( this, {
				selectedProgram: parseFloat( this.value ),
				onUpdate: 'radioProgram',
				id: this.id,
			} );
		} );
	} );
}

export default init;
