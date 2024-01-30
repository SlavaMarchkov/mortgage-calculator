import updateModel from './../utils/updateModel.js';

function init( getData ) {
	const slider = document.querySelector( '#slider-downpayment' );

	noUiSlider.create( slider, {
		start: getData().paymentPercent * 100, // стартовое значение при инициализации слайдера
		connect: 'lower',
		tooltips: true,
		step: 1, // шаг 1%
		range: {
			min: getData().minPaymentPercent * 100,
			max: getData().maxPaymentPercent * 100,
		},
		format: wNumb( {
			decimals: 0,
			thousand: ' ',
			suffix: '',
		} ),
	} );

	// прослушка событий слайдера
	slider.noUiSlider.on( 'slide', function () {
		let sliderValue = slider.noUiSlider.get();
		sliderValue = sliderValue.split('.')[0];
		sliderValue = parseInt(String(sliderValue).replace(/\s/g, ''));

		updateModel( slider, {
			paymentPercent: sliderValue,
			onUpdate: 'paymentSlider',
		} );
	} );

	return slider;
}

export default init;
