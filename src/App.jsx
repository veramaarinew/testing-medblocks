import React from "react";
import { PGliteWorker } from "@electric-sql/pglite/worker";
import { PGliteProvider } from "@electric-sql/pglite-react";
import { live } from "@electric-sql/pglite/live";
import { UserPlusIcon, UserGroupIcon, CommandLineIcon, SunIcon, MoonIcon, TableCellsIcon } from "@heroicons/react/24/outline";
import { Tooltip } from 'react-tooltip';
import { Toaster } from 'react-hot-toast';
import { useTheme } from './ThemeContext';
import PatientRegistration from "./PatientRegistration";
import PatientList from "./PatientList";
import SqlQuery from "./SqlQuery";
import PatientTable from "./components/PatientTable";

function App() {
  const [pg, setPg] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [activeTab, setActiveTab] = React.useState("main");
  const { isDark, toggleTheme } = useTheme();

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  React.useEffect(() => {
    const initPg = async () => {
      try {
        const worker = new Worker(
          new URL("./pglite-worker.js", import.meta.url),
          { type: "module" }
        );
        const pgInstance = await PGliteWorker.create(worker, {
          dataDir: "idb://patient-db",
          extensions: { live },
        });
        await pgInstance.waitReady;
        setPg(pgInstance);
      } catch (err) {
        console.error("Failed to initialize PGliteWorker:", err);
        setError(err.message);
      }
    };
    initPg();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-100 p-4 rounded-lg">
          Error initializing database: {error}
        </div>
      </div>
    );
  }

  if (!pg) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="animate-pulse text-gray-600 dark:text-gray-300">Loading database...</div>
      </div>
    );
  }

  return (
    <PGliteProvider db={pg}>
      <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${isDark ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        <Toaster position="top-right" toastOptions={{
          className: '',
          style: {
            background: isDark ? '#1F2937' : '#FFFFFF',
            color: isDark ? '#F3F4F6' : '#1F2937',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: 'white',
            },
          },
        }} />
        
        <button
          onClick={toggleTheme}
          className="theme-toggle"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <SunIcon className="w-6 h-6 text-yellow-400" />
          ) : (
            <MoonIcon className="w-6 h-6 text-gray-600" />
          )}
        </button>

        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              Medblocks Patient Management
            </h1>
          </div>

          <div className="flex justify-center mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-full shadow-sm p-1">
              <div className="flex space-x-2">
                <button
                  data-tooltip-id="nav-tooltip"
                  data-tooltip-content="Patient Management"
                  className={`p-3 rounded-full transition-all duration-200 ${
                    activeTab === "main"
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setActiveTab("main")}
                >
                  <UserGroupIcon className="w-6 h-6" />
                </button>
                <button
                  data-tooltip-id="nav-tooltip"
                  data-tooltip-content="Patient Table"
                  className={`p-3 rounded-full transition-all duration-200 ${
                    activeTab === "table"
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setActiveTab("table")}
                >
                  <TableCellsIcon className="w-6 h-6" />
                </button>
                <button
                  data-tooltip-id="nav-tooltip"
                  data-tooltip-content="SQL Console"
                  className={`p-3 rounded-full transition-all duration-200 ${
                    activeTab === "sql"
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setActiveTab("sql")}
                >
                  <CommandLineIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {activeTab === "main" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="card">
                <PatientRegistration />
              </div>
              <div className="card">
                <PatientList />
              </div>
            </div>
          )}

          {activeTab === "table" && (
            <div className="card">
              <PatientTable />
            </div>
          )}

          {activeTab === "sql" && (
            <div className="card">
              <SqlQuery />
            </div>
          )}
        </div>
      </div>
      <Tooltip id="nav-tooltip" />
    </PGliteProvider>
  );
}

export default App;