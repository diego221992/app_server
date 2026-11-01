import React, { useState, useEffect } from 'react';
import DataTableComponent from 'react-data-table-component';

// Estilos mínimos para que la tabla sea transparente y use la tipografía de Tailwind
const customStyles = {
    table: {
        style: {
            backgroundColor: 'transparent',
        },
    },
    noData: {
        style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            backgroundColor: 'transparent',
            color: 'inherit',
        },
    },
    pagination: {
        style: {
            backgroundColor: 'transparent',
            borderTop: 'none',
            color: 'inherit',
        },
    },
};

const DataTable = ({ columns, responseHttps }) => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchDataTable = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await responseHttps();
            if (response) {
                setData(response);
                setFilteredData(response);
            }
        } catch (err) {
            setError('Error al obtener los datos.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchText(value);
        const filtered = data.filter((item) =>
            Object.values(item).some((field) =>
                String(field).toLowerCase().includes(value.toLowerCase())
            )
        );
        setFilteredData(filtered);
    };

    useEffect(() => {
        fetchDataTable();
    }, []);

    return (
        <div className="w-full">
            {/* Buscador Estilo Tailwind */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchText}
                    onChange={handleSearch}
                    className="w-full md:w-72 px-4 py-2 text-sm text-gray-800 bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 outline-none transition-all dark:bg-gray-900 dark:border-gray-800 dark:text-white/90"
                />
            </div>

            {/* Contenedor de la Tabla */}
            <div className="rounded-xl border border-gray-200 bg-transparent dark:border-gray-800">
                <DataTableComponent
                    columns={columns}
                    data={filteredData}
                    customStyles={customStyles}
                    persistTableHead
                    pagination
                    responsive
                    progressPending={loading}
                    noDataComponent={
                        <div className="py-10 text-gray-500 dark:text-gray-400">
                            No hay datos disponibles en la tabla
                        </div>
                    }
                />
            </div>
            
            {error && (
                <p className="mt-2 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
};

export default DataTable;