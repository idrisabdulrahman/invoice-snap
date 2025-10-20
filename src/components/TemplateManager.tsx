import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {ArrowLeft, Plus, Edit, Trash2, Eye, Save} from 'lucide-react'
import { pb } from '../lib/pocketbase'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'
import type { RecordModel } from 'pocketbase'

interface Template extends RecordModel {
  name: string
  description?: string
  settings: {
    template: string
    primaryColor: string
    secondaryColor?: string
    fontFamily: string
    showTax: boolean
    showDiscount: boolean
    headerText: string
    footerText: string
  }
  isDefault: boolean
  userId: string
}

export const TemplateManager: React.FC = () => {
  const { user } = useAuth()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    settings: {
      template: 'professional',
      primaryColor: '#000000',
      secondaryColor: '#666666',
      fontFamily: 'Arial',
      showTax: false,
      showDiscount: false,
      headerText: 'INVOICE',
      footerText: 'Thank you for your business!'
    },
    isDefault: false
  })

  const fetchTemplates = async () => {
    if (!user) return

    try {
      setLoading(true)
      const records = await pb.collection('invoice_templates').getFullList<Template>({
        filter: `userId = "${user.id}"`,
        sort: '-created'
      })
      setTemplates(records)
    } catch (error) {
      console.error('Failed to fetch templates:', error)
      toast.error('Failed to load templates')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const templateData = {
        ...formData,
        userId: user.id,
      }

      if (editingTemplate) {
        const updated = await pb.collection('invoice_templates').update<Template>(editingTemplate.id, templateData)
        setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? updated : t))
        toast.success('Template updated successfully')
      } else {
        const newTemplate = await pb.collection('invoice_templates').create<Template>(templateData)
        setTemplates(prev => [newTemplate, ...prev])
        toast.success('Template created successfully')
      }

      setShowForm(false)
      setEditingTemplate(null)
      resetForm()
    } catch (error) {
      console.error('Failed to save template:', error)
      toast.error('Failed to save template')
    }
  }

  const handleEdit = (template: Template) => {
    setEditingTemplate(template)
    setFormData({
      name: template.name,
      description: template.description || '',
      settings: {
        ...template.settings,
        secondaryColor: template.settings.secondaryColor ?? '#666666',
      },
      isDefault: template.isDefault
    })
    setShowForm(true)
  }

  const handleDelete = async (templateId: string, templateName: string) => {
    if (confirm(`Are you sure you want to delete template "${templateName}"?`)) {
      try {
        await pb.collection('invoice_templates').delete(templateId)
        setTemplates(prev => prev.filter(t => t.id !== templateId))
        toast.success('Template deleted successfully')
      } catch (error) {
        console.error('Failed to delete template:', error)
        toast.error('Failed to delete template')
      }
    }
  }

  const setAsDefault = async (templateId: string) => {
    try {
      const currentDefault = templates.find(t => t.isDefault)
      if (currentDefault && currentDefault.id !== templateId) {
        await pb.collection('invoice_templates').update(currentDefault.id, { isDefault: false })
      }

      await pb.collection('invoice_templates').update(templateId, { isDefault: true })
      
      setTemplates(prev => prev.map(t => ({
        ...t,
        isDefault: t.id === templateId
      })))
      
      toast.success('Default template updated')
    } catch (error) {
      console.error('Failed to set default template:', error)
      toast.error('Failed to update default template')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      settings: {
        template: 'professional',
        primaryColor: '#000000',
        secondaryColor: '#666666',
        fontFamily: 'Arial',
        showTax: false,
        showDiscount: false,
        headerText: 'INVOICE',
        footerText: 'Thank you for your business!'
      },
      isDefault: false
    })
  }

  useEffect(() => {
    fetchTemplates()
  }, [user])

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
            <h1 className="text-3xl font-black">INVOICE TEMPLATES</h1>
          </div>
          <button
            onClick={() => { setEditingTemplate(null); resetForm(); setShowForm(true) }}
            className="bg-foreground text-background px-6 py-3 font-black hover:bg-background hover:text-foreground border-2 border-foreground transition-none flex items-center gap-2"
          >
            <Plus size={20} />
            NEW TEMPLATE
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {templates.map((template) => (
            <div key={template.id} className="border-4 border-foreground bg-background">
              <div className="border-b-2 border-foreground p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-lg">{template.name}</h3>
                    {template.description && (
                      <p className="text-sm font-bold text-gray-600 dark:text-gray-400">{template.description}</p>
                    )}
                    {template.isDefault && (
                      <span className="inline-block bg-success text-background px-2 py-1 text-xs font-black mt-2">
                        DEFAULT
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Template Preview */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900">
                <div 
                  className="border-2 border-gray-300 dark:border-gray-700 p-4 text-xs"
                  style={{ 
                    borderColor: template.settings.primaryColor,
                    fontFamily: template.settings.fontFamily 
                  }}
                >
                  <div 
                    className="font-black text-center mb-2"
                    style={{ color: template.settings.primaryColor }}
                  >
                    {template.settings.headerText}
                  </div>
                  <div className="mb-2">
                    <div className="font-bold">Invoice #001</div>
                    <div>Client Name</div>
                    <div>$1,000.00</div>
                  </div>
                  <div className="border-t pt-2 text-center text-gray-600 dark:text-gray-400">
                    {template.settings.footerText}
                  </div>
                </div>
              </div>

              {/* Template Actions */}
              <div className="border-t-2 border-foreground p-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => toast.success('Template preview feature coming soon!')}
                    className="flex-1 border-2 border-info text-info p-2 font-black hover:bg-info hover:text-background transition-none flex items-center justify-center gap-2"
                  >
                    <Eye size={16} />
                    PREVIEW
                  </button>
                  <button
                    onClick={() => handleEdit(template)}
                    className="flex-1 border-2 border-success text-success p-2 font-black hover:bg-success hover:text-background transition-none flex items-center justify-center gap-2"
                  >
                    <Edit size={16} />
                    EDIT
                  </button>
                  <button
                    onClick={() => handleDelete(template.id, template.name)}
                    className="border-2 border-danger text-danger p-2 font-black hover:bg-danger hover:text-background transition-none"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                {!template.isDefault && (
                  <button
                    onClick={() => setAsDefault(template.id)}
                    className="w-full mt-2 border-2 border-foreground p-2 font-black hover:bg-foreground hover:text-background transition-none"
                  >
                    SET AS DEFAULT
                  </button>
                )}
              </div>
            </div>
          ))}

          {templates.length === 0 && (
            <div className="col-span-full border-4 border-foreground p-12 text-center">
              <h3 className="text-2xl font-black mb-4">NO TEMPLATES YET</h3>
              <p className="font-bold text-gray-600 dark:text-gray-400 mb-6">Create your first template to customize your invoices</p>
              <button
                onClick={() => { setEditingTemplate(null); resetForm(); setShowForm(true) }}
                className="bg-foreground text-background px-6 py-3 font-black hover:bg-background hover:text-foreground border-2 border-foreground transition-none"
              >
                CREATE FIRST TEMPLATE
              </button>
            </div>
          )}
        </div>

        {/* Template Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-background border-4 border-foreground max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="border-b-2 border-foreground p-4">
                <h2 className="text-2xl font-black">
                  {editingTemplate ? 'EDIT TEMPLATE' : 'CREATE TEMPLATE'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-black mb-2">TEMPLATE NAME *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-3 border-2 border-foreground font-bold bg-background"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black mb-2">TEMPLATE STYLE</label>
                    <select
                      value={formData.settings.template}
                      onChange={(e) => setFormData({
                        ...formData,
                        settings: { ...formData.settings, template: e.target.value }
                      })}
                      className="w-full p-3 border-2 border-foreground font-bold bg-background"
                    >
                      <option value="minimal">Minimal</option>
                      <option value="professional">Professional</option>
                      <option value="modern">Modern</option>
                      <option value="classic">Classic</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-black mb-2">DESCRIPTION</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3 border-2 border-foreground font-bold bg-background"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-black mb-2">PRIMARY COLOR</label>
                    <input
                      type="color"
                      value={formData.settings.primaryColor}
                      onChange={(e) => setFormData({
                        ...formData,
                        settings: { ...formData.settings, primaryColor: e.target.value }
                      })}
                      className="w-full p-1 border-2 border-foreground h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black mb-2">FONT FAMILY</label>
                    <select
                      value={formData.settings.fontFamily}
                      onChange={(e) => setFormData({
                        ...formData,
                        settings: { ...formData.settings, fontFamily: e.target.value }
                      })}
                      className="w-full p-3 border-2 border-foreground font-bold bg-background"
                    >
                      <option value="Arial">Arial</option>
                      <option value="Helvetica">Helvetica</option>
                      <option value="Times">Times</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Courier">Courier</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-black mb-2">HEADER TEXT</label>
                    <input
                      type="text"
                      value={formData.settings.headerText}
                      onChange={(e) => setFormData({
                        ...formData,
                        settings: { ...formData.settings, headerText: e.target.value }
                      })}
                      className="w-full p-3 border-2 border-foreground font-bold bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black mb-2">FOOTER TEXT</label>
                    <input
                      type="text"
                      value={formData.settings.footerText}
                      onChange={(e) => setFormData({
                        ...formData,
                        settings: { ...formData.settings, footerText: e.target.value }
                      })}
                      className="w-full p-3 border-2 border-foreground font-bold bg-background"
                    />
                  </div>
                </div>

                <div className="flex gap-6 mt-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.settings.showTax}
                      onChange={(e) => setFormData({
                        ...formData,
                        settings: { ...formData.settings, showTax: e.target.checked }
                      })}
                      className="w-4 h-4"
                    />
                    <span className="font-black">SHOW TAX FIELDS</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.settings.showDiscount}
                      onChange={(e) => setFormData({
                        ...formData,
                        settings: { ...formData.settings, showDiscount: e.target.checked }
                      })}
                      className="w-4 h-4"
                    />
                    <span className="font-black">SHOW DISCOUNT FIELDS</span>
                  </label>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setEditingTemplate(null); resetForm() }}
                    className="border-2 border-foreground px-6 py-3 font-black hover:bg-foreground hover:text-background transition-none"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="bg-foreground text-background px-6 py-3 font-black hover:bg-background hover:text-foreground border-2 border-foreground transition-none flex items-center gap-2"
                  >
                    <Save size={20} />
                    {editingTemplate ? 'UPDATE' : 'CREATE'} TEMPLATE
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TemplateManager
