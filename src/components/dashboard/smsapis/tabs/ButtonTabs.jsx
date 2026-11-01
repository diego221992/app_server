const ButtonTabs = ({
    setActiveTab,
    activeTab

}) => {
    return (
        <>
          <div className="mb-8 border-b border-gray-200 dark:border-gray-800">
                    <ul className="flex flex-wrap -mb-px text-sm font-medium text-center gap-8">
                        <li>
                            <button
                                onClick={() => setActiveTab("config")}
                                className={`inline-block pb-4 rounded-t-lg border-b-2 transition-colors ${
                                    activeTab === "config"
                                        ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                                        : "text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                                }`}
                            >
                                Configuración General
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab("templates")}
                                className={`inline-block pb-4 rounded-t-lg border-b-2 transition-colors ${
                                    activeTab === "templates"
                                        ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                                        : "text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                                }`}
                            >
                                Plantillas
                            </button>
                        </li>
                    </ul>
                </div>
        </>
    )
}

export default ButtonTabs;