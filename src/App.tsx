import React, { useState, useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type ColumnDef
} from '@tanstack/react-table'
import { useEmployeeDealsData, type EmployeeDeal } from './data.tsx'
import { RefreshCw, BarChart3, PlusCircle } from 'lucide-react'
import DealForm from './DealForm'
import ConfigForm from './ConfigForm'
import './App.css'

const columnHelper = createColumnHelper<EmployeeDeal>()

function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'form' | 'config'>('dashboard')
  const [globalFilter, setGlobalFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const { data: mockData, loading, error, refetch } = useEmployeeDealsData()

  const columns = useMemo<ColumnDef<EmployeeDeal, any>[]>(
    () => [
      columnHelper.accessor('id', {
        header: '#ID',
        cell: info => <span>{info.getValue()}</span>,
        size: 60,
      }),
      columnHelper.accessor('employeeName', {
        header: 'اسم الموظف',
        cell: info => <span>{info.getValue()}</span>,
        size: 120,
      }),
      columnHelper.accessor('date', {
        header: 'التاريخ',
        cell: info => <span>{info.getValue()}</span>,
        size: 100,
      }),
      columnHelper.accessor('dailyAmountSum', {
        header: 'مجموع المبالغ اليومية',
        cell: info => <span>{info.getValue()?.toLocaleString() || 0}</span>,
        size: 150,
      }),
      columnHelper.accessor('monthlyAmountSum', {
        header: 'مجموع المبالغ الشهرية',
        cell: info => <span>{info.getValue()?.toLocaleString('en-US') || 0}</span>,
        size: 150,
      }),
      columnHelper.accessor('dailyDealsCount', {
        header: 'عدد الصفقات اليومية',
        cell: info => <span>{info.getValue()}</span>,
        size: 120,
      }),
      columnHelper.accessor('monthlyDealsCount', {
        header: 'عدد الصفقات الشهرية',
        cell: info => <span>{info.getValue()}</span>,
        size: 120,
      }),
      columnHelper.accessor('dealsPerEmployeeDaily', {
        header: 'عدد الصفقات لكل موظف (اليوم)',
        cell: info => <span>{info.getValue()}</span>,
        size: 200,
      }),
      columnHelper.accessor('dealsPerEmployeeMonthly', {
        header: 'عدد الصفقات لكل موظف (الشهر)',
        cell: info => <span>{info.getValue()}</span>,
        size: 200,
      }),
    ],
    []
  )

  const filteredData = useMemo(() => {
    if (!globalFilter && !dateFilter) return mockData

    return mockData.filter((item: EmployeeDeal) => {
      const matchesSearch = !globalFilter ||
        item.employeeName.toLowerCase().includes(globalFilter.toLowerCase())
      const matchesDate = !dateFilter || item.date === dateFilter
      return matchesSearch && matchesDate
    })
  }, [mockData,globalFilter, dateFilter])

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: 'includesString',
  })

  const summaryData = useMemo(() => {
    const totalDailyAmount = filteredData.reduce((sum: number, item: EmployeeDeal) =>  (item.dailyAmountSum || 0), 0)
    const totalMonthlyAmount = filteredData.reduce((sum: number, item: EmployeeDeal) =>  (item.monthlyAmountSum || 0), 0)
    const totalDailyDeals = filteredData.reduce((sum: number, item: EmployeeDeal) =>  (item.dailyDealsCount || 0), 0)
    const totalMonthlyDeals = filteredData.reduce((sum: number, item: EmployeeDeal) =>  (item.monthlyDealsCount || 0), 0)
    return { totalDailyAmount, totalMonthlyAmount, totalDailyDeals, totalMonthlyDeals }
  }, [filteredData])/*

  const summaryData = useMemo(() => {
  const today = new Date().toISOString().split("T")[0] // تاريخ اليوم YYYY-MM-DD
  const todayData = filteredData.find((item: EmployeeDeal) => item.date === today)

  // إذا في بيانات لليوم → استخدمها
  const totalDailyAmount = todayData ? (todayData.dailyAmountSum || 0) : 0
  const totalDailyDeals = todayData ? (todayData.dailyDealsCount || 0) : 0

  // الشهرية تتجمع عادي (من كل التواريخ)
  const totalMonthlyAmount = filteredData.reduce(
    (sum: number, item: EmployeeDeal) => (item.monthlyAmountSum || 0),
    0
  )
  const totalMonthlyDeals = filteredData.reduce(
    (sum: number, item: EmployeeDeal) => (item.monthlyDealsCount || 0),
    0
  )

  return { totalDailyAmount, totalMonthlyAmount, totalDailyDeals, totalMonthlyDeals }
}, [filteredData])
*/
  const chartData = useMemo(() => {
    const employeeDailyMap = new Map<string, number>()
    const employeeMonthlyMap = new Map<string, number>()
    const dateAmountMap = new Map<string, number>()

    filteredData.forEach((item: EmployeeDeal) => {
      // Daily deals per employee
      const dailyKey = item.employeeName
      employeeDailyMap.set(dailyKey, (employeeDailyMap.get(dailyKey) || 0) + (item.dealsPerEmployeeDaily || 0))

      // Monthly deals per employee
      const monthlyKey = item.employeeName
      employeeMonthlyMap.set(monthlyKey, (employeeMonthlyMap.get(monthlyKey) || 0) + (item.dealsPerEmployeeMonthly || 0))

      // Daily amounts over time
      const dateKey = item.date
      dateAmountMap.set(dateKey, (dateAmountMap.get(dateKey) || 0) + (item.dailyAmountSum || 0))
    })

    return {
      dailyDeals: Array.from(employeeDailyMap.entries()).map(([name, value]) => ({ name, value })),
      monthlyDeals: Array.from(employeeMonthlyMap.entries()).map(([name, value]) => ({ name, value })),
      dailyAmounts: Array.from(dateAmountMap.entries())
        .map(([date, amount]) => ({ date, amount }))
        .sort((a, b) => a.date.localeCompare(b.date))
    }
  }, [filteredData])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow Arabic letters, spaces, numbers, and empty string
    if (/^[\u0600-\u06FF\s0-9]*$/.test(value) || value === '') {
      setGlobalFilter(value)
    }
  }

  if (loading) {
    return (
      <div className="dashboard" dir="rtl">
        <div className="loading">
          <h2>جاري تحميل البيانات...</h2>
        </div>
      </div>
    )
  }

  if (error && mockData.length === 0) {
    return (
      <div className="dashboard" dir="rtl">
        <div className="error">
          <h2>خطأ في تحميل البيانات</h2>
          <p>{error}</p>
          <button onClick={refetch} className="refresh-button" style={{ marginTop: '1rem' }}>
            <RefreshCw size={20} />
            إعادة المحاولة
          </button>
        </div>
      </div>
    )
  }

  if (currentPage === 'form') {
    return (
      <div dir="rtl">
        <nav className="nav-header">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="nav-button"
          >
            <BarChart3 size={20} />
            لوحة التحكم
          </button>
        </nav>
        <DealForm />
      </div>
    )
  } 
  
  if (currentPage === 'config') {
  return (
    <div dir="rtl">
      <nav className="nav-header">
        <button
          onClick={() => setCurrentPage('dashboard')}
          className="nav-button"
        >
          <BarChart3 size={20} />
          لوحة التحكم
        </button>
      </nav>
      <ConfigForm />
    </div>
  )
}


  return (
    <div className="dashboard" dir="rtl">
      <nav className="nav-header">
        <div className="nav-buttons">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className={`nav-button ${currentPage === 'dashboard' ? 'active' : ''}`}
          >
            <BarChart3 size={20} />
            لوحة التحكم
          </button>
          <button
            onClick={() => setCurrentPage('form')}
            className="nav-button"
          >
            <PlusCircle size={20} />
            إدخال صفقة جديدة
          </button>
         

        </div>
        <button
          onClick={refetch}
          disabled={loading}
          className="refresh-button"
          title="تحديث البيانات"
        >
          <RefreshCw size={20} className={loading ? 'spinning' : ''} />
          تحديث
        </button>
      </nav>

      <header className="dashboard-header">
        <h1>لوحة تحكم الصفقات</h1>
      </header>

      <section className="summary-section">
        <div className="summary-cards">
          <div className="card">
            <h3 className="card-title">إجمالي المبالغ اليومية</h3>
            <p className="card-value">{summaryData.totalDailyAmount.toLocaleString('en-US')}</p>
          </div>
          <div className="card">
            <h3 className="card-title">إجمالي المبالغ الشهرية</h3>
            <p className="card-value">{summaryData.totalMonthlyAmount.toLocaleString('en-US')}</p>
          </div>
          <div className="card">
            <h3 className="card-title">إجمالي عدد الصفقات اليومية</h3>
            <p className="card-value">{summaryData.totalDailyDeals.toLocaleString('en-US')}</p>
          </div>
          <div className="card">
            <h3 className="card-title">إجمالي عدد الصفقات الشهرية</h3>
            <p className="card-value">{summaryData.totalMonthlyDeals.toLocaleString('en-US')}</p>
          </div>
        </div>
      </section>

      <section className="charts-section">
        <div className="chart-container">
          <h3>عدد الصفقات لكل موظف (اليوم)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.dailyDeals} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>عدد الصفقات لكل موظف (الشهر)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.monthlyDeals} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container full-width">
          <h3>مجموع المبالغ اليومية عبر التاريخ</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.dailyAmounts} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#ff7300" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="table-section">
        <div className="controls">
          <div className="search-filter">
            <input
              type="text"
              placeholder="البحث في اسم الموظف..."
              value={globalFilter}
              onChange={handleSearchChange}
              className="search-input"
              maxLength={50}
            />
            <select
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">جميع التواريخ</option>
              {Array.from(new Set(mockData.map((item: EmployeeDeal) => item.date)))
                .sort()
                .map((date) => (
                <option key={date as string} value={date as string}>{date as string}</option>
              ))}
            </select>
          </div>

          {filteredData.length === 0 && (globalFilter || dateFilter) && (
            <div className="no-results">
              لم يتم العثور على نتائج للبحث
              {globalFilter && `: "${globalFilter}"`}
              {dateFilter && ` في تاريخ: ${dateFilter}`}
            </div>
          )}

          {filteredData.length === 0 && !globalFilter && !dateFilter && !loading && (
            <div className="no-results">
              لا توجد بيانات متاحة حالياً
              <button onClick={refetch} className="refresh-button" style={{ marginTop: '1rem' }}>
                <RefreshCw size={20} />
                تحديث البيانات
              </button>
            </div>
          )}
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} style={{ width: header.getSize() }}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default App
