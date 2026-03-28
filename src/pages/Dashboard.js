import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { walletAPI } from '../services/api';
import { formatRupiah, formatDate } from '../utils/helpers';
import Navbar from '../components/Navbar';
import AlertMessage from '../components/AlertMessage';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateUserBalance } = useAuth();
  
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });
  
  const [topupAmount, setTopupAmount] = useState('');
  const [transferTarget, setTransferTarget] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  
  const [topupError, setTopupError] = useState('');
  const [transferError, setTransferError] = useState('');

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [balanceRes, transactionsRes] = await Promise.all([
        walletAPI.getBalance(),
        walletAPI.getTransactions(),
      ]);
      
      setBalance(balanceRes.data.balance);
      setTransactions(transactionsRes.data.transactions || []);
      updateUserBalance(balanceRes.data.balance);
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Gagal memuat data.',
      });
    } finally {
      setLoading(false);
    }
  }, [updateUserBalance]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated, fetchDashboardData]);

  const clearAlert = () => {
    setAlert({ type: '', message: '' });
  };

  const validateTopup = (amount) => {
    if (!amount || amount === '') return 'Nominal tidak boleh kosong.';
    if (isNaN(amount) || !Number.isInteger(Number(amount))) return 'Nominal harus berupa angka.';
    if (Number(amount) <= 0) return 'Nominal tidak boleh negatif atau nol.';
    if (Number(amount) > 10000000) return 'Nominal melebihi batas maksimum transaksi.';
    return '';
  };

  const validateTransfer = (target, amount) => {
    if (!target || target === '') return 'Target penerima tidak boleh kosong.';
    if (!amount || amount === '') return 'Nominal tidak boleh kosong.';
    if (isNaN(amount) || !Number.isInteger(Number(amount))) return 'Nominal harus berupa angka.';
    if (Number(amount) <= 0) return 'Nominal tidak boleh negatif atau nol.';
    if (Number(amount) > 10000000) return 'Nominal melebihi batas maksimum transaksi.';
    if (balance !== null && Number(amount) > balance) return 'Saldo tidak mencukupi.';
    return '';
  };

  const handleTopup = async (e) => {
    e.preventDefault();
    setTopupError('');
    const validationError = validateTopup(topupAmount);
    if (validationError) {
      setTopupError(validationError);
      return;
    }
    setProcessing(true);
    try {
      const response = await walletAPI.topup(Number(topupAmount));
      setBalance(response.data.new_balance);
      updateUserBalance(response.data.new_balance);
      setAlert({ type: 'success', message: response.data.message || 'Top up berhasil!' });
      setTopupAmount('');
      fetchDashboardData();
    } catch (error) {
      const errorMsg = error.response?.data?.errors?.amount?.[0] || error.response?.data?.message || 'Top up gagal.';
      setTopupError(errorMsg);
      setAlert({ type: 'error', message: errorMsg });
    } finally {
      setProcessing(false);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setTransferError('');
    const validationError = validateTransfer(transferTarget, transferAmount);
    if (validationError) {
      setTransferError(validationError);
      return;
    }
    setProcessing(true);
    try {
      const response = await walletAPI.transfer(transferTarget, Number(transferAmount));
      setBalance(response.data.remaining_balance);
      updateUserBalance(response.data.remaining_balance);
      setAlert({ type: 'success', message: response.data.message || 'Transfer berhasil!' });
      setTransferTarget('');
      setTransferAmount('');
      fetchDashboardData();
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.errors?.amount?.[0] || 'Transfer gagal.';
      setTransferError(errorMsg);
      setAlert({ type: 'error', message: errorMsg });
    } finally {
      setProcessing(false);
    }
  };

  if (!isAuthenticated) {
    return <LoadingSpinner text="Mengalihkan ke login..." fullScreen />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center pt-20">
          <LoadingSpinner text="Memuat data dashboard..." size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {alert.message && (
          <AlertMessage
            type={alert.type}
            message={alert.message}
            onClose={clearAlert}
          />
        )}

        {/* POLES: Added card-hover class */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl shadow-xl p-8 mb-8 text-white card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm font-medium mb-2">Saldo Anda</p>
              <div className="flex items-center">
                <h1 className="text-4xl sm:text-5xl font-bold">
                  {formatRupiah(balance)}
                </h1>
                {/* POLES: Tombol Refresh Manual */}
                <button 
                  onClick={fetchDashboardData} 
                  disabled={loading || processing}
                  className="ml-4 p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                  title="Perbarui Saldo"
                >
                  <svg className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="bg-white bg-opacity-20 rounded-full p-4">
                <span className="text-4xl">💰</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* POLES: Added card-hover class to Top Up Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover">
            <div className="bg-gradient-to-r from-success-500 to-success-600 px-6 py-4">
              <h3 className="text-white font-semibold text-lg flex items-center">
                <span className="mr-2">💵</span>
                Top Up Saldo
              </h3>
            </div>
            <div className="p-6">
              <form onSubmit={handleTopup}>
                <div className="mb-4">
                  <label htmlFor="topupAmount" className="block text-sm font-medium text-gray-700 mb-2">
                    Nominal Top Up
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                      Rp
                    </span>
                    <input
                      type="number"
                      id="topupAmount"
                      value={topupAmount}
                      onChange={(e) => setTopupAmount(e.target.value)}
                      disabled={processing}
                      className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-success-500 focus:border-success-500 transition-all duration-200 ${
                        topupError ? 'border-danger-500 bg-danger-50' : 'border-gray-300'
                      }`}
                      placeholder="Masukkan nominal"
                    />
                  </div>
                  {topupError && (
                    <p className="mt-2 text-sm text-danger-600 flex items-center">
                      <span className="mr-1">⚠</span>
                      {topupError}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={processing || !topupAmount}
                  className="w-full bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {processing ? (
                    <LoadingSpinner size="small" text="Memproses..." />
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Top Up Sekarang
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* POLES: Added card-hover class to Transfer Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover">
            <div className="bg-gradient-to-r from-warning-500 to-warning-600 px-6 py-4">
              <h3 className="text-white font-semibold text-lg flex items-center">
                <span className="mr-2">💸</span>
                Transfer Saldo
              </h3>
            </div>
            <div className="p-6">
              <form onSubmit={handleTransfer}>
                <div className="mb-4">
                  <label htmlFor="transferTarget" className="block text-sm font-medium text-gray-700 mb-2">
                    Email / Nomor HP Penerima
                  </label>
                  <input
                    type="text"
                    id="transferTarget"
                    value={transferTarget}
                    onChange={(e) => setTransferTarget(e.target.value)}
                    disabled={processing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-warning-500 focus:border-warning-500 transition-all duration-200"
                    placeholder="email@contoh.com atau 08123456789"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="transferAmount" className="block text-sm font-medium text-gray-700 mb-2">
                    Nominal Transfer
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                      Rp
                    </span>
                    <input
                      type="number"
                      id="transferAmount"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      disabled={processing}
                      className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-warning-500 focus:border-warning-500 transition-all duration-200 ${
                        transferError ? 'border-danger-500 bg-danger-50' : 'border-gray-300'
                      }`}
                      placeholder="Masukkan nominal"
                    />
                  </div>
                  {transferError && (
                    <p className="mt-2 text-sm text-danger-600 flex items-center">
                      <span className="mr-1">⚠</span>
                      {transferError}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={processing || !transferTarget || !transferAmount}
                  className="w-full bg-gradient-to-r from-warning-500 to-warning-600 hover:from-warning-600 hover:to-warning-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {processing ? (
                    <LoadingSpinner size="small" text="Memproses..." />
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Transfer Sekarang
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* POLES: Added card-hover class to History Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
            <h3 className="text-white font-semibold text-lg flex items-center">
              <span className="mr-2">📋</span>
              Riwayat Transaksi
            </h3>
          </div>
          <div className="p-6">
            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-500 text-lg font-medium">Belum ada riwayat transaksi</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipe</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keterangan</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((trx) => (
                      <tr key={trx.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(trx.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${trx.type === 'credit' ? 'bg-success-50 text-success-600' : 'bg-danger-50 text-danger-600'}`}>
                            {trx.type === 'credit' ? '↑ Masuk' : '↓ Keluar'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{trx.description}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${trx.type === 'credit' ? 'text-success-600' : 'text-danger-600'}`}>
                          {trx.type === 'credit' ? '+' : '-'}{formatRupiah(trx.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;