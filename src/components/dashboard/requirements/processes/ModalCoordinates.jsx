import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';


const ModalCoordinates = ({
    isOpen,
    setIsOpen,
    toggleModal,
    user,
    setRefreshTrigger,
    setLatitude,
    setLongitude
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const mapRef = useRef(null);
    const resetStates = () => {
        setIsLoading(false);
    }

    const viewMaps = () => {
        if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
        }
        // Inicializa el mapa y asigna la instancia a mapRef.current
        mapRef.current = L.map("maps").setView([0, 0], 2);
        L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
            maxZoom: 100,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        }).addTo(mapRef.current);

        let geocoder = L.Control.geocoder({
            position: 'topleft',
            collapsed: true,
            placeholder: 'Buscar ubicación',
            defaultMarkGeocode: true,
            errorMessage: 'Ubicación no encontrada'
        }).on('markgeocode', function (event) {
            console.log(event.geocode)
            setLatitude(event.geocode.center.lat || '');
            setLongitude(event.geocode.center.lng || '');
            /*setLatitudeProcess(event.geocode.center.lat || '');
            setLongitudeProcess(event.geocode.center.lng || '');
            setCityProcess(event.geocode.properties.address.city || '');
            setMunicipalityProcess(event.geocode.properties.address.municipality || '');
            setCountryProcess(event.geocode.properties.address.country || '');
            setCountryCodeProcess(event.geocode.properties.address.country_code || '');
            setStateProcess(event.geocode.properties.address.state || '');
            setZipCodeProcess(event.geocode.properties.address.postcode || '');*/

            L.marker(event.geocode.center).addTo(mapRef.current);
        }).addTo(mapRef.current);

        const popup = L.popup();
        const onMapClick = (e) => {
            popup
                .setLatLng(e.latlng)
                .setContent(e.latlng.toString())
                .openOn(mapRef.current);
        };
        mapRef.current.on('click', onMapClick);
    };

    useEffect(() => {
        if (isOpen) {
            viewMaps();
        }
    }, [isOpen]);


    // Contenido del Modal que será teletransportado al final del <body>
    const modalContent = (
        <div className="fixed inset-0 flex items-center justify-center p-5 overflow-y-auto z-[99999]">
            {/* Backdrop (Fondo oscuro/desenfocado) */}
            <div
                onClick={() => { }}
                className="fixed inset-0 h-full w-full bg-gray-900/50 backdrop-blur-sm transition-opacity"
            ></div>

            {/* Contenido del Modal */}
            <div className="no-scrollbar relative w-full max-w-[700px] max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11 shadow-2xl z-[100000]">
                {/* Botón Cerrar */}

                <div className="px-2 pr-14 text-left">
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Geolocalización de Dispositivos
                    </h4>
                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                        Por favor ingrese la ubicación del dispositivo para mostrar su posición en el mapa. Puede buscar una ubicación específica o hacer clic directamente en el mapa para obtener las coordenadas.
                    </p>
                </div>

                <div id="maps" className="h-[400px] w-full">
                </div>
                <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                    <button
                        onClick={() => {
                            if (window.confirm("¿Estás seguro de que deseas cerrar el modal?")) {
                                toggleModal(false);
                                resetStates();
                            }
                        }}
                        type="button"
                        className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Si isOpen es true, enviamos el modal al <body> */}
            {isOpen && createPortal(modalContent, document.body)}
        </>
    );
};

export default ModalCoordinates;