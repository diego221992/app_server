import { useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
const url = "http://192.168.1.100:3000/autoremove/remove"; // Cambia esto por tu URL real del backend

const ModalUsers = ({
    error,
    isOpen,
    toggleModal,
    title,
    subTitle,
    contentBody
}) => {

   

    // Contenido del Modal que será teletransportado al final del <body>
    const modalContent = (
        <div className="fixed inset-0 flex items-center justify-center p-5 overflow-y-auto z-[99999]">
            {/* Backdrop (Fondo oscuro/desenfocado) */}
            <div
                onClick={() => {
                    toggleModal(false)
                    resetStates();
                }}
                className="fixed inset-0 h-full w-full bg-gray-900/50 backdrop-blur-sm transition-opacity"
            ></div>

            {/* Contenido del Modal */}
            <div className="no-scrollbar relative w-full max-w-[700px] max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11 shadow-2xl z-[100000]">
                {/* Botón Cerrar */}

                <div className="px-2 pr-14 text-left">
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                        {title}
                    </h4>
                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                        {subTitle}
                    </p>
                </div>


                {error && (
                    <div className="p-3 mb-4 text-sm text-white-600 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-white-400">
                        {error}
                    </div>
                )}
                {contentBody}


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

export default ModalUsers;