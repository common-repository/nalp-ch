const { Component, createRef } = wp.element;
import iFrameResize from 'iframe-resizer/js/iframeResizer';

/**
 * The Button component
 */
export default class Button extends Component {
	constructor( props ) {
		super( props );
		this.state = { isOpen: false };
		this.iframe = createRef();
	}

	componentDidMount() {
		iFrameResize(
			{
				log: true,
				resizeFrom: 'child',
				tolerance: 20,
				heightCalculationMethod: 'bodyScroll',
			},
			this.iframe.current
		);
	}

	componentDidUpdate() {
		if ( this.state.isOpen ) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
	}

	render() {
		const { label, vendor, selectedService, duration } = this.props;
		const { isOpen } = this.state;
		const openModal = () => this.setState( () => ( { isOpen: true } ) );
		const closeModal = () => this.setState( () => ( { isOpen: false } ) );
		const getUrl = ( slug, service, d ) => {
			if ( service && d ) {
				return `https://${ slug }.nalp.ch/book/${ service.id }/?duration=${ d }&iframe=true`;
			}
			return `https://${ slug }.nalp.ch/?iframe=true`;
		};

		return [
			vendor && (
				<div
					key="iframe"
					className="lightbox"
					style={ { display: isOpen ? 'inherit' : 'none' } }
				>
					<div className="backdrop" onClick={ closeModal }></div>
					<div className="content" onClick={ closeModal }>
						<div className="iframe">
							<button className="close" onClick={ closeModal }>
								<svg
									className="icon"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 512 512"
								>
									<path
										fill="none"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="32"
										d="M368 368L144 144M368 144L144 368"
									/>
								</svg>
								Schliessen
							</button>
							<iframe
								ref={ this.iframe }
								src={ getUrl(
									vendor.slug,
									selectedService,
									duration
								) }
								style={ { width: '1px', minWidth: '100%' } }
							/>
						</div>
					</div>
				</div>
			),
			<button key="button" onClick={ openModal }>
				{ label }
			</button>,
		];
	}
}
