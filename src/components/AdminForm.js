import React from 'react';
import { __ } from '@wordpress/i18n';
import axios from 'axios';
const { InspectorControls } = wp.editor;
const { PanelBody, RadioControl, TextControl } = wp.components;
import { useState, Fragment } from '@wordpress/element';

export default ( { attributes, setAttributes } ) => {
	const { label, slug, vendor, selectedService, duration } = attributes;
	const [ isLoading, setIsLoading ] = useState( false );
	const [ cancelToken, setCancelToken ] = useState( false );

	const changeSlug = ( s ) => {
		setAttributes( { slug: s, vendor: null } );

		if ( cancelToken ) cancelToken.cancel();

		if (!s) return null

		setIsLoading( true );
		const cancelTokenSource = axios.CancelToken.source();
		setCancelToken( cancelTokenSource );
		axios
			.get( `https://api.nalp.ch/api/v2/vendors/${ s }`, {
				cancelToken: cancelTokenSource.token,
			} )
			.then( ( { data } ) => {
				setAttributes( { vendor: data } );
			} )
			.catch( () => {
				setAttributes( { vendor: null } );
			} )
			.finally( () => {
				setIsLoading( false );
			} );
	};

	const vendorOverview = ( v ) =>
		v ? (
			<div style={ { paddingBottom: '20px' } }>
				Name: <b>{ v.name }</b>
				<br />
				Url: <b>{ v.slug }</b>.nalp.ch
			</div>
		) : (
			'nicht gefunden'
		);

	const serviceSelect = ( v, selService ) => {
		console.log({ v })
		if (!v) return null;

		const services = v.serviceGroups.flatMap(
			( serviceGroup ) => serviceGroup.services
		);
		return (
			<div>
				<RadioControl
					label="Vor-Ausgewählte Dienstleistung"
					selected={ selService ? selService.id : null }
					options={ [
						{
							label: __(
								'Alle Dienstleistungen',
								'jsforwphowto'
							),
							value: null,
						},
						...services.map( ( service ) => ( {
							label: service.name,
							value: service.id,
						} ) ),
					] }
					onChange={ ( serviceId ) =>
						setAttributes( {
							selectedService: services.find(
								( service ) => service.id == serviceId
							),
						} )
					}
				/>
				{ selService && (
					<RadioControl
						label="Vor-Ausgewählte Dauer"
						selected={ duration }
						options={ selService.durations.map( ( d ) => ( {
							label: d.duration + ' Minuten',
							value: d.duration,
						} ) ) }
						onChange={ ( d ) =>
							setAttributes( { duration: parseInt( d, 10 ) } )
						}
					/>
				) }
			</div>
		);
	};

	return (
		<Fragment>
			{ !slug && <div><b>&middot; Slug fehlt</b></div>}
			{ !vendor && <div><b>&middot; Dienstleister nicht gefunden</b></div>}
			<InspectorControls key="inspector">
				<PanelBody title={ __( 'Nalp Einstellungen', 'jsforwphowto' ) }>
					<TextControl
						label="Label"
						value={ label || '' }
						onChange={ ( l ) => setAttributes( { label: l } ) }
					/>
					<TextControl
						label="Slug"
						value={ slug || '' }
						onChange={ ( s ) => changeSlug( s ) }
					/>
					<div>{ isLoading ? 'Laden...' : vendorOverview( vendor ) }</div>

					{ vendor && serviceSelect( vendor, selectedService ) }
				</PanelBody>
			</InspectorControls>
		</Fragment>
	);
};
