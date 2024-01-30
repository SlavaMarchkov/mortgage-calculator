function updateMinPercent( data ) {
	document.querySelector( '#percents-from' ).innerText = data.minPaymentPercent * 100 + '%';
}

export { updateMinPercent };
