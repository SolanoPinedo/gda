import { useState, useEffect } from 'react';
import './App.css';
import { DataTable } from './DataTable';
import type { ColumnDef } from '@tanstack/react-table';
import Chart from './Chart';

// Define the type for a single row of data
interface DataRow {
  'CENTRO DE MANTENIMIENTO': string;
  CLLI_REAL: string;
  EDIFICIO: string;
  'A.- Cob': number;
  'B.- NC': number;
  'C.- OC':number;
  'D.- INC': number;
  'E.- TNP': number;
  'F.- Intentos': number;
  Paso: number;
  Bloi: number;
  Bloe: number;
  FTS: number;
  FTE: number;
  OPR: number;
  Vacantes: number;
  'Falla Tecnica': number;
  TIPO: string;
  TECNOLOGIA: string;
  NOMBRE: string;
  year: string;
  month: string;
}

const columns: ColumnDef<DataRow>[] = [
  {
    accessorKey: 'CLLI_REAL',
    header: 'Building',
  },
  {
    accessorKey: 'EDIFICIO',
    header: 'Edificio',
  },
  {
    accessorKey: 'month',
    header: 'Month',
  },
  {
    accessorKey: 'year',
    header: 'Year',
  },
  {
    accessorKey: 'Bloi',
    header: 'Bloi',
  },
  {
    accessorKey: 'FTE',
    header: 'FTE',
  },
];

const numericColumns = [
  'A.- Cob', 'B.- NC', 'C.- OC', 'D.- INC', 'E.- TNP', 'F.- Intentos', 'Paso',
  'Bloi', 'Bloe', 'FTS', 'FTE', 'OPR', 'Vacantes', 'Falla Tecnica'
].sort();

function App() {
  const [data, setData] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCentro, setSelectedCentro] = useState<string>('All');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('All');
  const [selectedEdificio, setSelectedEdificio] = useState<string>('All');
  const [selectedColumn, setSelectedColumn] = useState<string>(numericColumns[0]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const fileNames = Array.from({ length: 12 }, (_, i) => {
          const month = (i + 1).toString().padStart(2, '0');
          return `Q25${month}`;
        });

        const allData: DataRow[] = [];
        for (const fileName of fileNames) {
          const response = await fetch(`/data/${fileName}.json`);
          if (!response.ok) {
            console.warn(`File not found: ${fileName}.json`);
            continue;
          }
          const jsonData: DataRow[] = await response.json();
          allData.push(...jsonData);
        }
        
        setData(allData);
      } catch (e) {
        setError('Failed to fetch data.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Reset child filters when parent changes
  useEffect(() => {
    setSelectedBuilding('All');
    setSelectedEdificio('All');
  }, [selectedCentro]);

  useEffect(() => {
    setSelectedEdificio('All');
  }, [selectedBuilding]);

  // Derivations for filters
  const centros = ['All', ...Array.from(new Set(data.map(item => item['CENTRO DE MANTENIMIENTO']))).filter(Boolean).sort()];

  const centroFilteredData = data.filter(item =>
    selectedCentro === 'All' || item['CENTRO DE MANTENIMIENTO'] === selectedCentro
  );

  const buildings = ['All', ...Array.from(new Set(centroFilteredData.map(item => item.CLLI_REAL))).filter(Boolean).sort()];
  
  const clliFilteredData = centroFilteredData.filter(item => 
    selectedBuilding === 'All' || item.CLLI_REAL === selectedBuilding
  );

  const edificios = ['All', ...Array.from(new Set(clliFilteredData.map(item => item.EDIFICIO))).filter(Boolean).sort()];

  const filteredData = clliFilteredData.filter(item =>
    selectedEdificio === 'All' || item.EDIFICIO === selectedEdificio
  );

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <header className="p-4">
        <h1 className="text-3xl font-bold">Dashboard de Análisis de Datos</h1>
      </header>
      <main className="p-4">
        {loading && <p>Loading data...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 bg-gray-800 p-4 rounded">
              <h2 className="text-xl font-semibold mb-2">Filtros</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="centro-filter" className="block mb-2 text-sm font-medium">Filter by Centro de Mantenimiento</label>
                  <select 
                    id="centro-filter"
                    value={selectedCentro}
                    onChange={(e) => setSelectedCentro(e.target.value)}
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  >
                    {centros.map(centro => (
                      <option key={centro} value={centro}>{centro}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="building-filter" className="block mb-2 text-sm font-medium">Filter by Building (CLLI_REAL)</label>
                  <select 
                    id="building-filter"
                    value={selectedBuilding}
                    onChange={(e) => setSelectedBuilding(e.target.value)}
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  >
                    {buildings.map(building => (
                      <option key={building} value={building}>{building}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="edificio-filter" className="block mb-2 text-sm font-medium">Filter by Edificio</label>
                  <select 
                    id="edificio-filter"
                    value={selectedEdificio}
                    onChange={(e) => setSelectedEdificio(e.target.value)}
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  >
                    {edificios.map(edificio => (
                      <option key={edificio} value={edificio}>{edificio}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="column-filter" className="block mb-2 text-sm font-medium">Select Column to Plot</label>
                  <select 
                    id="column-filter"
                    value={selectedColumn}
                    onChange={(e) => setSelectedColumn(e.target.value)}
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  >
                    {numericColumns.map(col => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="md:col-span-2 space-y-4">
              <div className="bg-gray-800 p-4 rounded">
                <h2 className="text-xl font-semibold mb-2">Visualización</h2>
                <Chart data={filteredData} column={selectedColumn} />
              </div>
              <div className="bg-gray-800 p-4 rounded">
                <h2 className="text-xl font-semibold mb-2">Datos</h2>
                <DataTable columns={columns} data={filteredData} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;