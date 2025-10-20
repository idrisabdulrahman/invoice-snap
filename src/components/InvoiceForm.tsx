import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInvoices } from '../hooks/useInvoices'
import {Plus, Minus, Save, Send, ArrowLeft} from 'lucide-react'
import { Link } from 'react-router-dom'

interface LineItem {
  description: string
  quantity: number
  rate: number
  amount: number
}

export const InvoiceForm: React.FC = () => {
  const navigate = useNavigate()
  const { createInvoice, generateInvoiceNumber } = useInvoices()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    invoiceNumber: generateInvoiceNumber(),
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    currency: 'USD',
    dueDate: '',
    notes: '',
    customization: {
      template: 'professional',
      primaryColor: '#000000',
      showTax: false
    }
  })

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: '', quantity: 1, rate: 0, amount: 0 }
  ])

  const addLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: 1, rate: 0, amount: 0 }])
  }

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index))
    }
  }

  const updateLineItem = (index: number, field: keyof LineItem, value: string | number) => {
    const updatedItems = [...lineItems]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    
    if (field === 'quantity' || field === 'rate') {
      updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].rate
    }
    
    setLineItems(updatedItems)
  }

  const totalAmount = lineItems.reduce((sum, item) => sum + item.amount, 0)

  const handleSubmit = async (status: 'draft' | 'sent') => {
    if (!formData.clientName || !formData.clientEmail || lineItems.some(item => !item.description)) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const invoiceData = {
        ...formData,
        amount: totalAmount,
        status,
        lineItems: lineItems.filter(item => item.description.trim() !== ''),
        ...(status === 'sent' && { sentAt: new Date().toISOString() })
      }

      await createInvoice(invoiceData)
      navigate('/invoices')
    } catch (error) {
      console.error('Failed to create invoice:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b-4 border-foreground bg-background p-6">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link
            to="/dashboard"
            className="border-2 border-foreground p-2 hover:bg-foreground hover:text-background transition-none"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-black">CREATE INVOICE</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <div className="border-4 border-foreground bg-background">
          {/* Invoice Header */}
          <div className="border-b-2 border-foreground p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-black mb-2">INVOICE NUMBER</label>
                <input
                  type="text"
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                  className="w-full p-3 border-2 border-foreground font-bold bg-background"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-black mb-2">DUE DATE</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full p-3 border-2 border-foreground font-bold bg-background"
                  required
                />
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div className="border-b-2 border-foreground p-6">
            <h2 className="text-xl font-black mb-4">CLIENT INFORMATION</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-black mb-2">CLIENT NAME *</label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full p-3 border-2 border-foreground font-bold bg-background"
                  placeholder="Company or Person Name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-black mb-2">EMAIL ADDRESS *</label>
                <input
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                  className="w-full p-3 border-2 border-foreground font-bold bg-background"
                  placeholder="client@example.com"
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-black mb-2">BILLING ADDRESS</label>
              <textarea
                value={formData.clientAddress}
                onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
                className="w-full p-3 border-2 border-foreground font-bold bg-background"
                rows={3}
                placeholder="Street Address&#10;City, State ZIP&#10;Country"
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="border-b-2 border-foreground p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-black">LINE ITEMS</h2>
              <button
                onClick={addLineItem}
                className="bg-foreground text-background px-4 py-2 font-black hover:bg-background hover:text-foreground border-2 border-foreground transition-none flex items-center gap-2"
              >
                <Plus size={16} />
                ADD ITEM
              </button>
            </div>

            <div className="space-y-4">
              {lineItems.map((item, index) => (
                <div key={index} className="border-2 border-foreground p-4">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-5">
                      <label className="block text-sm font-black mb-2">DESCRIPTION *</label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                        className="w-full p-2 border-2 border-foreground font-bold bg-background"
                        placeholder="Service or product description"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-black mb-2">QTY</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateLineItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-full p-2 border-2 border-foreground font-bold bg-background"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-black mb-2">RATE</label>
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => updateLineItem(index, 'rate', parseFloat(e.target.value) || 0)}
                        className="w-full p-2 border-2 border-foreground font-bold bg-background"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-black mb-2">AMOUNT</label>
                      <div className="p-2 border-2 border-foreground bg-gray-100 dark:bg-gray-900 font-black">
                        ${item.amount.toFixed(2)}
                      </div>
                    </div>
                    <div className="md:col-span-1">
                      {lineItems.length > 1 && (
                        <button
                          onClick={() => removeLineItem(index)}
                          className="w-full p-2 border-2 border-danger text-danger hover:bg-danger hover:text-background transition-none"
                        >
                          <Minus size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-right">
              <div className="inline-block border-4 border-foreground p-6 bg-foreground text-background">
                <p className="text-sm font-black">TOTAL AMOUNT</p>
                <p className="text-3xl font-black">${totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="border-b-2 border-foreground p-6">
            <label className="block text-sm font-black mb-2">NOTES</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-3 border-2 border-foreground font-bold bg-background"
              rows={3}
              placeholder="Payment terms, thank you message, or additional notes..."
            />
          </div>

          {/* Customization */}
          <div className="border-b-2 border-foreground p-6">
            <h2 className="text-xl font-black mb-4">CUSTOMIZATION</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-black mb-2">TEMPLATE</label>
                <select
                  value={formData.customization.template}
                  onChange={(e) => setFormData({
                    ...formData,
                    customization: { ...formData.customization, template: e.target.value }
                  })}
                  className="w-full p-3 border-2 border-foreground font-bold bg-background"
                >
                  <option value="minimal">Minimal</option>
                  <option value="professional">Professional</option>
                  <option value="modern">Modern</option>
                  <option value="classic">Classic</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-black mb-2">PRIMARY COLOR</label>
                <input
                  type="color"
                  value={formData.customization.primaryColor}
                  onChange={(e) => setFormData({
                    ...formData,
                    customization: { ...formData.customization, primaryColor: e.target.value }
                  })}
                  className="w-full p-1 border-2 border-foreground h-12"
                />
              </div>
              <div>
                <label className="block text-sm font-black mb-2">CURRENCY</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full p-3 border-2 border-foreground font-bold bg-background"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CNY">CNY (¥)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6">
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => handleSubmit('draft')}
                disabled={loading}
                className="border-2 border-foreground px-6 py-3 font-black hover:bg-foreground hover:text-background transition-none flex items-center gap-2 disabled:opacity-50"
              >
                <Save size={20} />
                SAVE AS DRAFT
              </button>
              <button
                onClick={() => handleSubmit('sent')}
                disabled={loading}
                className="bg-foreground text-background px-6 py-3 font-black hover:bg-background hover:text-foreground border-2 border-foreground transition-none flex items-center gap-2 disabled:opacity-50"
              >
                <Send size={20} />
                CREATE & SEND
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoiceForm
