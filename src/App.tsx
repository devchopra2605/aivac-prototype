import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Thermometer, Droplets, Users, Wind, Fan, Gauge, Cpu, Sun, FileText, LogOut } from 'lucide-react';

interface EnergyData {
  time: string;
  savings: number;
}

interface User {
  email: string;
}

// Simulated users database
const USERS = [
  { email: 'demo@example.com', password: 'demo123' }
];

function App() {
  const [isAIEnabled, setIsAIEnabled] = useState(false);
  const [temperature, setTemperature] = useState(22);
  const [humidity, setHumidity] = useState(45);
  const [occupancy, setOccupancy] = useState(3);
  const [energyData, setEnergyData] = useState<EnergyData[]>([]);
  const [ventilationScore, setVentilationScore] = useState(85);
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ambientTemp, setAmbientTemp] = useState(20);
  const [reports, setReports] = useState<string[]>([]);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (isAIEnabled && user) {
      const interval = setInterval(() => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString();

        // Energy Savings: small fluctuation around a realistic average
        setEnergyData(prev => {
          const last = prev[prev.length - 1]?.savings || 25;
          const next = Math.max(18, Math.min(30, last + (Math.random() - 0.5)));
          const newData = [...prev, { time: timeStr, savings: next }];
          return newData.slice(-20);
        });

        // Humidity: between 35% and 65%, slow variation
        setHumidity(prev => {
          const next = prev + (Math.random() - 0.5) * 0.8;
          return Math.max(35, Math.min(65, next));
        });

        // Occupancy: integer steps between 0 and 10
        setOccupancy(prev => {
          const change = Math.random() < 0.1 ? (Math.random() < 0.5 ? 1 : -1) : 0;
          return Math.max(0, Math.min(10, prev + change));
        });

        // Ventilation Score: smooth between 70 and 95
        setVentilationScore(prev => {
          const next = prev + (Math.random() - 0.5) * 1.5;
          return Math.max(70, Math.min(95, next));
        });

        // Ambient Temp: smooth changes between 20°C and 28°C
        setAmbientTemp(prev => {
          const next = prev + (Math.random() - 0.5) * 0.4;
          return Math.max(20, Math.min(28, next));
        });

        // System Reports
        if (Math.random() > 0.85) {
          setReports(prev => [
            `${timeStr}: ${Math.random() > 0.5 ? 'Optimized temperature for energy savings' : 'Adjusted ventilation based on occupancy'}`,
            ...prev.slice(0, 4)
          ]);
        }

      }, 3000); // Slow down interval slightly for realism

      return () => clearInterval(interval);
    }
  }, [isAIEnabled, user]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const foundUser = USERS.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
    } else {
      alert('Invalid credentials');
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (USERS.some(u => u.email === email)) {
      alert('User already exists');
    } else {
      const newUser = { email, password };
      USERS.push(newUser);
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const CircularProgress = ({ value, max, icon: Icon, label }: { value: number, max: number, icon: React.ElementType, label: string }) => (
    <div className="flex flex-col items-center p-4">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90">
          <circle
            className="text-gray-700"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="40"
            cx="48"
            cy="48"
          />
          <circle
            className="text-blue-500"
            strokeWidth="8"
            strokeDasharray={251.2}
            strokeDashoffset={251.2 - (value / max) * 251.2}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="40"
            cx="48"
            cy="48"
          />
        </svg>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <Icon className="w-8 h-8 text-blue-500" />
        </div>
      </div>
      <div className="mt-2 text-center">
        <div className="text-sm font-medium text-gray-400">{label}</div>
        <div className="text-xl font-semibold text-white">{Math.round(value)}</div>
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700 w-full max-w-md">
          <div className="flex items-center justify-center mb-8">
            <Cpu className="w-12 h-12 text-blue-500 mr-3" />
            <h1 className="text-3xl font-bold text-white">AIVAC</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-700 text-white rounded p-2 border border-gray-600"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-700 text-white rounded p-2 border border-gray-600"
              />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white rounded p-2 hover:bg-blue-600">
              Login
            </button>
            <button
              type="button"
              onClick={handleSignUp}
              className="w-full bg-gray-700 text-white rounded p-2 hover:bg-gray-600"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80')"
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-wrap items-center space-x-3">
            <Cpu className="w-10 h-10 text-blue-500" />
            <h1 className="text-3xl font-bold text-white">AIVAC</h1>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
            <div className="text-green-300 text-center sm:text-left">Welcome {user.email}</div>

            <div className="flex justify-center sm:justify-start">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                <LogOut className="w-4 h-4 text-gray-300" />
                <span className="text-gray-300">Logout</span>
              </button>
            </div>

            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <span className="text-gray-300">AI Optimization</span>
              <button
                onClick={() => setIsAIEnabled(!isAIEnabled)}
                className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors duration-300 ${isAIEnabled ? 'bg-blue-500' : 'bg-gray-700'
                  }`}
              >
                <span
                  className={`inline-block h-8 w-8 transform rounded-full bg-white transition-transform duration-300 ${isAIEnabled ? 'translate-x-11' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
            <div className="flex items-center space-x-2 mb-4">
              <Gauge className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-white">Energy Savings</h2>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={energyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      color: '#fff'
                    }}
                  />
                  <Line type="monotone" dataKey="savings" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
            <div className="flex items-center space-x-2 mb-4">
              <Sun className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-white">Ambient Temperature</h2>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-6xl font-bold text-white">{ambientTemp.toFixed(1)}°C</div>
            </div>
            <div className="mt-4 text-center text-gray-400">
              Current Outside Temperature
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
            <div className="flex items-center space-x-2 mb-4">
              <Fan className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-white">System Metrics</h2>
            </div>
            <div className="flex flex-wrap justify-around">
              <CircularProgress value={temperature} max={30} icon={Thermometer} label="Temperature °C" />
              <CircularProgress value={humidity} max={100} icon={Droplets} label="Humidity %" />
              <CircularProgress value={occupancy} max={10} icon={Users} label="Occupancy" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
            <div className="flex items-center space-x-2 mb-4">
              <Thermometer className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-white">Suggested Temperature</h2>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="16"
                max="30"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xl font-semibold text-white">{temperature}°C</span>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
            <div className="flex items-center space-x-2 mb-4">
              <Wind className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-white">Ventilation Status</h2>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg text-gray-300">Air Quality Score</span>
              </div>
              <div className="text-2xl font-bold text-blue-500">{Math.round(ventilationScore)}%</div>
            </div>
            <div className="mt-4 h-4 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${ventilationScore}%` }}
              />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-white">Live Reports</h2>
            </div>
            <div className="space-y-3">
              {reports.map((report, index) => (
                <div key={index} className="text-gray-300 p-3 bg-gray-700 rounded-lg">
                  {report}
                </div>
              ))}
            </div>
          </div>
        </div>

        <footer className="mt-8 text-center text-gray-400">
          <p>© 2025 Dev Chopra. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;