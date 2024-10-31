import { hydrate } from 'react-dom';
import Button from './components/Button';
window.onload = () => {
	const elements = document.querySelectorAll( '.wp-block-create-block-nalp' );

	if ( elements.length ) {
		elements.forEach( ( element ) => {
			const attributes = JSON.parse(
				element.getAttribute( 'data-nalp' )
			);
			hydrate( <Button { ...attributes } />, element );
		} );
	}
};
