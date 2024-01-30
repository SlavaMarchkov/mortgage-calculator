function updateModel( element, data ) {
	// создаем пользовательское событие
	element.dispatchEvent( new CustomEvent( 'updateForm', {
		bubbles: true,
		detail: { ...data },
	} ) );
}

export default updateModel;
