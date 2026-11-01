import { useState, useEffect } from "react"; // Eliminado 'use' que no se usaba
import { useAuth } from '../../../context/AuthContext';
import ButtonTabs from './tabs/ButtonTabs';
import TabConfig from "./tabs/TabConfig";
import TabTemplates from "./tabs/TabTemplates";
import DataTable from "../../packages/DataTable";
import smsApisServices from "../../../api/http/smsapis/smsApis";
import smsTemplatesServices from "../../../api/http/smsapis/smsTemplates";
const SmsApi = () => {
    const { user } = useAuth();
    const pageName = "SMS Apis";
    const [activeTab, setActiveTab] = useState("config"); // Estado para las pestañas
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
   

   
    const [columns, setColumns] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    return (
        <>
            <div>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                        {pageName}
                    </h2>
                    <nav>
                        <ol className="flex items-center gap-1.5">
                            <li>
                                <a className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400" href="#">
                                    Dashboard
                                    <svg className="stroke-current" width="17" height="16" viewBox="0 0 17 16" fill="none">
                                        <path d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </a>
                            </li>
                            <li className="text-sm text-gray-800 dark:text-white/90">{pageName}</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">

                <ButtonTabs
                    setActiveTab={setActiveTab}
                    activeTab={activeTab}
                />

                {/* CAMBIO AQUÍ: Eliminamos el max-w-[630px] y usamos w-full */}
                <div className="mx-auto w-full max-w-full mt-6">

                    {activeTab === "config" && (
                        <TabConfig
                            smsApisServices={smsApisServices}
                            columns={columns}
                            setColumns={setColumns}
                            DataTable={DataTable}
                            refreshTrigger={refreshTrigger}
                            setRefreshTrigger={setRefreshTrigger}
                        />
                    )}

                    {activeTab === "templates" && (
                        <TabTemplates
                            smsTemplatesServices={smsTemplatesServices}
                            error={error}
                            setError={setError}
                            columns={columns}
                            setColumns={setColumns}
                            DataTable={DataTable}
                            refreshTrigger={refreshTrigger}
                            setRefreshTrigger={setRefreshTrigger}
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default SmsApi;