import React, { useState } from 'react'
import { useInvoices } from '../hooks/useInvoices'
import { Link } from 'react-router-dom'
import {ArrowLeft, Edit, Trash2, Eye,  Search, Plus} from 'lucide-react'
import toast from 'react-hot-toast'

export const InvoiceList: React.FC = () => {
  const { invoices, loading, deleteInvoice, updateInvoice } = useInvoices()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')

  const filteredInvoices = invoices
    .filter(invoice => {
      const matchesSearch = invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === 'amount') return b.amount - a.amount
      if (sortBy === 'dueDate') return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      return new Date(b.created).getTime() - new Date(a.created).getTime()
    })

  const handleStatusChange = async (invoiceId: string, newStatus: string) => {
    try {
      const updates: any = { status: newStatus }
      if (newStatus === 'sent' && !invoices.find(inv => inv.id === invoiceId)?.sentAt) {
        updates.sentAt = new Date().toISOString()
      }
      if (newStatus === 'paid') {
        updates.paidAt = new Date().toISOString()
      }
      await updateInvoice(invoiceId, updates)
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const handleDelete = async (invoiceId: string, invoiceNumber: string) => {
    if (confirm(`Are you sure you want to delete invoice ${invoiceNumber}? This action cannot be undone.`)) {
      try {
        await deleteInvoice(invoiceId)
      } catch (error) {
        console.error('Failed to delete invoice:', error)
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-success text-background'
      case 'sent': return 'bg-info text-background'
      case 'overdue': return 'bg-danger text-background'
      case 'draft': return 'bg-gray-500 text-white'
      case 'cancelled': return 'bg-danger text-background'
      default: return 'bg-foreground text-background'
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
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="border-2 border-foreground p-2 hover:bg-foreground hover:text-background transition-none"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-3xl font-black">ALL INVOICES</h1>
          </div>
          <Link
            to="/create-invoice"
            className="bg-foreground text-background px-6 py-3 font-black hover:bg-background hover:text-foreground border-2 border-foreground transition-none flex items-center gap-2"
          >
            <Plus size={20} />
            NEW INVOICE
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Filters */}
        <div className="border-4 border-foreground bg-background mb-6">
          <div className="border-b-2 border-foreground p-4">
            <h2 className="text-xl font-black">FILTERS</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-black mb-2">SEARCH</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3" size={16} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search invoices..."
                    className="w-full pl-10 p-3 border-2 border-foreground font-bold bg-background"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-black mb-2">STATUS</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full p-3 border-2 border-foreground font-bold bg-background"
                >
                  <option value="all">ALL STATUSES</option>
                  <option value="draft">DRAFT</option>
                  <option value="sent">SENT</option>
                  <option value="paid">PAID</option>
                  <option value="overdue">OVERDUE</option>
                  <option value="cancelled">CANCELLED</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-black mb-2">SORT BY</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-3 border-2 border-foreground font-bold bg-background"
                >
                  <option value="createdAt">DATE CREATED</option>
                  <option value="dueDate">DUE DATE</option>
                  <option value="amount">AMOUNT</option>
                </select>
              </div>
              <div className="flex items-end">
                <div className="text-sm font-black">
                  SHOWING {filteredInvoices.length} OF {invoices.length} INVOICES
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice List */}
        <div className="border-4 border-foreground bg-background">
          {filteredInvoices.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-xl font-black text-gray-600 dark:text-gray-400 mb-4">NO INVOICES FOUND</p>
              <p className="font-bold text-gray-500 mb-6">
                {invoices.length === 0 ? 'Create your first invoice to get started' : 'Try adjusting your filters'}
              </p>
              <Link
                to="/create-invoice"
                className="bg-foreground text-background px-6 py-3 font-black hover:bg-background hover:text-foreground border-2 border-foreground transition-none inline-block"
              >
                CREATE INVOICE
              </Link>
            </div>
          ) : (
            <div className="divide-y-2 divide-foreground">
              {filteredInvoices.map((invoice) => (
                <div key={invoice.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className={`px-3 py-1 font-black text-sm ${getStatusColor(invoice.status)}`}>
                        {invoice.status.toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-black text-lg">{invoice.invoiceNumber}</h3>
                        <p className="font-bold text-gray-600 dark:text-gray-400">{invoice.clientName}</p>
                        <p className="font-bold text-gray-500 text-sm">{invoice.clientEmail}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-black text-xl">${invoice.amount.toFixed(2)}</p>
                        <p className="font-bold text-gray-600 dark:text-gray-400 text-sm">
                          Due: {new Date(invoice.dueDate).toLocaleDateString()}
                        </p>
                        <p className="font-bold text-gray-500 text-xs">
                          Created: {new Date(invoice.created).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* Status Change */}
                        <select
                          value={invoice.status}
                          onChange={(e) => handleStatusChange(invoice.id, e.target.value)}
                          className="p-2 border-2 border-foreground font-bold text-sm bg-background"
                        >
                          <option value="draft">DRAFT</option>
                          <option value="sent">SENT</option>
                          <option value="paid">PAID</option>
                          <option value="overdue">OVERDUE</option>
                          <option value="cancelled">CANCELLED</option>
                        </select>
                        
                        {/* Actions */}
                        <button
                          onClick={() => toast.success('Invoice preview feature coming soon!')}
                          className="p-2 border-2 border-info text-info hover:bg-info hover:text-background transition-none"
                          title="Preview Invoice"
                        >
                          <Eye size={16} />
                        </button>
                        
                        <button
                          onClick={() => toast.success('Invoice editing feature coming soon!')}
                          className="p-2 border-2 border-success text-success hover:bg-success hover:text-background transition-none"
                          title="Edit Invoice"
                        >
                          <Edit size={16} />
                        </button>
                        
                        <button
                          onClick={() => handleDelete(invoice.id, invoice.invoiceNumber)}
                          className="p-2 border-2 border-danger text-danger hover:bg-danger hover:text-background transition-none"
                          title="Delete Invoice"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Line Items Preview */}
                  {invoice.lineItems && invoice.lineItems.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-black text-gray-600 dark:text-gray-400 mb-2">LINE ITEMS:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {invoice.lineItems.slice(0, 3).map((item, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-bold">{item.description}</span>
                            <span className="text-gray-500"> - {item.quantity} × ${item.rate} = ${item.amount}</span>
                          </div>
                        ))}
                        {invoice.lineItems.length > 3 && (
                          <div className="text-sm text-gray-500 font-bold">
                            +{invoice.lineItems.length - 3} more items
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InvoiceList
