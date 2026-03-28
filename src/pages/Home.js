import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect ke dashboard jika sudah login
  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl mr-2">💰</span>
              <span className="text-xl font-bold text-gray-900">Mini Wallet</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Daftar
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="text-8xl mb-6">💰</div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Kelola Keuangan Anda dengan Mudah
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Mini Wallet membantu Anda mengelola saldo, melakukan top up, transfer, 
            dan melacak riwayat transaksi dengan aman dan cepat.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate('/login')}
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              Masuk Sekarang
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-white hover:bg-gray-50 text-primary-600 border-2 border-primary-600 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              Daftar Gratis
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Fitur Unggulan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-5xl mb-4">💵</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Top Up Mudah</h3>
            <p className="text-gray-600">
              Tambah saldo kapan saja dengan proses yang cepat dan aman
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-5xl mb-4">💸</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Transfer Instan</h3>
            <p className="text-gray-600">
              Kirim saldo ke user lain dengan email atau nomor HP
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Riwayat Lengkap</h3>
            <p className="text-gray-600">
              Pantau semua transaksi masuk dan keluar dalam satu tempat
            </p>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Keamanan Terjamin
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start space-x-4">
                <div className="text-3xl">🔒</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Authentication dengan Sanctum
                  </h3>
                  <p className="text-gray-600">
                    Token-based authentication untuk keamanan maksimal
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="text-3xl">🛡️</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Database Transaction
                  </h3>
                  <p className="text-gray-600">
                    Rollback otomatis jika transfer gagal untuk integritas data
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">
            © 2024 Mini Wallet. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Built with Laravel 8 & React 19
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;