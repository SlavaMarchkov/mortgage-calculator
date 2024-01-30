import updateModel from './../utils/updateModel.js';

function init( getData ) {
	const data = getData();
	const slider = document.querySelector( '#slider-cost' );

	noUiSlider.create( slider, {
		start: data.cost,
		connect: 'lower',
		tooltips: true,
		step: 100_000,
		range: {
			min: data.minPrice,
			'1%': [ 400_000, 100_000 ],
			'50%': [ 10_000_000, 500_000 ],
			max: data.maxPrice,
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
			cost: sliderValue,
			onUpdate: 'costSlider',
		} );
	} );

	return slider;
}

export default init;
