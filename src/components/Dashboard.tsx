import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { useInvoices } from '../hooks/useInvoices'
import {Plus, FileText, DollarSign, Clock, CheckCircle, AlertCircle} from 'lucide-react'
import { Link } from 'react-router-dom'

export const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth()
  const { invoices, loading } = useInvoices()

  const stats = {
    total: invoices.length,
    paid: invoices.filter(inv => inv.status === 'paid').length,
    pending: invoices.filter(inv => inv.status === 'sent').length,
    overdue: invoices.filter(inv => inv.status === 'overdue').length,
    totalAmount: invoices.reduce((sum, inv) => sum + inv.amount, 0),
    paidAmount: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0)
  }

  const recentInvoices = invoices.slice(0, 5)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-success text-background'
      case 'sent': return 'bg-info text-background'
      case 'overdue': return 'bg-danger text-background'
      case 'draft': return 'bg-gray-500 text-white'
      default: return 'bg-foreground text-background'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle size={16} />
      case 'sent': return <Clock size={16} />
      case 'overdue': return <AlertCircle size={16} />
      case 'draft': return <FileText size={16} />
      default: return <FileText size={16} />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-foreground"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b-4 border-foreground bg-background p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black">DASHBOARD</h1>
            <p className="text-lg font-bold text-gray-600 dark:text-gray-400">Welcome back, {user?.name}</p>
          </div>
          <div className="flex gap-4">
            <Link
              to="/create-invoice"
              className="bg-foreground text-background px-6 py-3 font-black hover:bg-background hover:text-foreground border-2 border-foreground transition-none flex items-center gap-2"
            >
              <Plus size={20} />
              CREATE INVOICE
            </Link>
            <button
              onClick={signOut}
              className="border-2 border-foreground px-6 py-3 font-black hover:bg-foreground hover:text-background transition-none"
            >
              LOGOUT
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="border-4 border-foreground p-6 bg-background">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-black text-gray-600 dark:text-gray-400">TOTAL INVOICES</p>
                <p className="text-3xl font-black">{stats.total}</p>
              </div>
              <FileText size={32} />
            </div>
          </div>

          <div className="border-4 border-foreground p-6 bg-success text-background">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-black">PAID</p>
                <p className="text-3xl font-black">{stats.paid}</p>
                <p className="text-sm font-bold">${stats.paidAmount.toFixed(2)}</p>
              </div>
              <CheckCircle size={32} />
            </div>
          </div>

          <div className="border-4 border-foreground p-6 bg-info text-background">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-black">PENDING</p>
                <p className="text-3xl font-black">{stats.pending}</p>
              </div>
              <Clock size={32} />
            </div>
          </div>

          <div className="border-4 border-foreground p-6 bg-danger text-background">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-black">OVERDUE</p>
                <p className="text-3xl font-black">{stats.overdue}</p>
              </div>
              <AlertCircle size={32} />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/create-invoice"
            className="border-4 border-foreground p-6 bg-foreground text-background hover:bg-background hover:text-foreground transition-none block"
          >
            <Plus size={32} className="mb-4" />
            <h3 className="text-xl font-black mb-2">CREATE INVOICE</h3>
            <p className="font-bold">Start a new invoice in 90 seconds</p>
          </Link>

          <Link
            to="/invoices"
            className="border-4 border-foreground p-6 bg-background hover:bg-foreground hover:text-background transition-none block"
          >
            <FileText size={32} className="mb-4" />
            <h3 className="text-xl font-black mb-2">VIEW ALL</h3>
            <p className="font-bold">Manage all your invoices</p>
          </Link>

          <Link
            to="/templates"
            className="border-4 border-foreground p-6 bg-gray-100 dark:bg-gray-900 hover:bg-foreground hover:text-background transition-none block"
          >
            <DollarSign size={32} className="mb-4" />
            <h3 className="text-xl font-black mb-2">TEMPLATES</h3>
            <p className="font-bold">Customize invoice designs</p>
          </Link>
        </div>

        {/* Recent Invoices */}
        <div className="border-4 border-foreground bg-background">
          <div className="border-b-2 border-foreground p-6">
            <h2 className="text-2xl font-black">RECENT INVOICES</h2>
          </div>
          <div className="p-6">
            {recentInvoices.length === 0 ? (
              <div className="text-center py-12">
                <FileText size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-xl font-black text-gray-600 dark:text-gray-400">NO INVOICES YET</p>
                <p className="font-bold text-gray-500 mb-6">Create your first invoice to get started</p>
                <Link
                  to="/create-invoice"
                  className="bg-foreground text-background px-6 py-3 font-black hover:bg-background hover:text-foreground border-2 border-foreground transition-none inline-block"
                >
                  CREATE FIRST INVOICE
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentInvoices.map((invoice) => (
                  <div key={invoice.id} className="border-2 border-foreground p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`px-3 py-1 font-black text-sm flex items-center gap-2 ${getStatusColor(invoice.status)}`}>
                        {getStatusIcon(invoice.status)}
                        {invoice.status.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black">{invoice.invoiceNumber}</p>
                        <p className="font-bold text-gray-600 dark:text-gray-400">{invoice.clientName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-xl">${invoice.amount.toFixed(2)}</p>
                      <p className="font-bold text-gray-600 dark:text-gray-400 text-sm">
                        Due: {new Date(invoice.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="pt-4">
                  <Link
                    to="/invoices"
                    className="font-black hover:underline"
                  >
                    VIEW ALL INVOICES →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
