import updateModel from './../utils/updateModel.js';

function init( getData ) {
	const data = getData();
	const slider = document.querySelector( '#slider-term' );

	noUiSlider.create( slider, {
		start: data.time,
		connect: 'lower',
		tooltips: true,
		step: 1,
		range: {
			min: data.minYears,
			max: data.maxYears,
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
			time: sliderValue,
			onUpdate: 'timeSlider',
		} );
	} );

	return slider;
}

export default init;
