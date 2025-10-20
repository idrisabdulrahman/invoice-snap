import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ChevronRight, Clock, Users, FileText, Menu, X, Sun, Moon } from 'lucide-react'
import { useBetterAuth } from './hooks/useBetterAuth'
import { useTheme } from './hooks/useTheme'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './components/Dashboard'
import InvoiceForm from './components/InvoiceForm'
import InvoiceList from './components/InvoiceList'
import TemplateManager from './components/TemplateManager'

function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      {/* Navigation */}
      <nav className="border-b-4 border-foreground bg-background sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-black">INVOICESNAP</div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="hover:bg-foreground hover:text-background px-3 py-2 transition-none">FEATURES</a>
              <a href="#process" className="hover:bg-foreground hover:text-background px-3 py-2 transition-none">PROCESS</a>
              <a href="#testimonials" className="hover:bg-foreground hover:text-background px-3 py-2 transition-none">REVIEWS</a>
              <button onClick={toggleTheme} className="p-2">
                {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="hover:bg-foreground hover:text-background p-2 transition-none"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <button 
                onClick={() => navigate('/dashboard')}
                className="bg-foreground text-background px-6 py-3 font-black hover:bg-background hover:text-foreground border-2 border-foreground transition-none"
              >
                START NOW
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t-2 border-foreground bg-background">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a href="#features" className="block px-3 py-2 hover:bg-foreground hover:text-background transition-none">FEATURES</a>
                <a href="#process" className="block px-3 py-2 hover:bg-foreground hover:text-background transition-none">PROCESS</a>
                <a href="#testimonials" className="block px-3 py-2 hover:bg-foreground hover:text-background transition-none">REVIEWS</a>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-foreground text-background px-6 py-3 font-black hover:bg-background hover:text-foreground border-2 border-foreground transition-none mt-4"
                >
                  START NOW
                </button>
                <button onClick={toggleTheme} className="w-full mt-2 p-2">
                  {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className={`py-20 px-4 sm:px-6 lg:px-8 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="space-y-8">
                <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black leading-none">
                  90<br />
                  SECOND<br />
                  INVOICES
                </h1>
                
                <div className="border-l-8 border-foreground pl-6">
                  <p className="text-xl sm:text-2xl font-bold">
                    NO BLOAT. NO COMPLEXITY.<br />
                    JUST FAST INVOICING.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="bg-foreground text-background px-8 py-4 text-xl font-black hover:bg-background hover:text-foreground border-4 border-foreground transition-none"
                  >
                    CREATE INVOICE NOW
                    <ChevronRight className="inline ml-2" size={24} />
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-foreground text-background p-8 border-4 border-foreground">
                <div className="space-y-4">
                  <div className="text-sm font-bold">INVOICE #001</div>
                  <div className="border-b-2 border-background pb-4">
                    <div className="text-2xl font-black">$2,500.00</div>
                    <div className="text-sm">DUE: 30 DAYS</div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>FROM: YOUR BUSINESS</div>
                    <div>TO: CLIENT NAME</div>
                    <div>SERVICE: WEB DEVELOPMENT</div>
                  </div>
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="w-full bg-background text-foreground py-2 font-black hover:bg-gray-200 transition-none"
                  >
                    SEND INVOICE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-foreground text-background py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center border-r-0 md:border-r-2 border-background">
              <div className="text-6xl font-black">90s</div>
              <div className="text-xl font-bold">AVERAGE CREATION TIME</div>
            </div>
            <div className="text-center border-r-0 md:border-r-2 border-background">
              <div className="text-6xl font-black">0%</div>
              <div className="text-xl font-bold">BLOAT & COMPLEXITY</div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-black">100%</div>
              <div className="text-xl font-bold">PROFESSIONAL RESULTS</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl sm:text-7xl font-black mb-16 text-center">FEATURES</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border-4 border-foreground p-8 bg-background">
              <Clock size={48} className="mb-4" />
              <h3 className="text-2xl font-black mb-4">SPEED</h3>
              <p className="text-lg font-bold">
                Create professional invoices in under 90 seconds. 
                No unnecessary steps or bloated interfaces.
              </p>
            </div>

            <div className="border-4 border-foreground p-8 bg-foreground text-background">
              <Users size={48} className="mb-4" />
              <h3 className="text-2xl font-black mb-4">CLIENT MANAGEMENT</h3>
              <p className="text-lg font-bold">
                Store client information securely. 
                Reuse details for faster future invoicing.
              </p>
            </div>

            <div className="border-4 border-foreground p-8 bg-background">
              <FileText size={48} className="mb-4" />
              <h3 className="text-2xl font-black mb-4">TEMPLATES</h3>
              <p className="text-lg font-bold">
                Professional templates that work. 
                No design skills required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="bg-gray-100 dark:bg-gray-900 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl sm:text-7xl font-black mb-16 text-center">3-STEP PROCESS</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-foreground text-background w-16 h-16 rounded-none flex items-center justify-center text-3xl font-black mx-auto mb-8">1</div>
              <h3 className="text-3xl font-black mb-4">BUSINESS INFO</h3>
              <p className="text-lg font-bold">
                Enter your business details once. 
                We'll remember everything for next time.
              </p>
              <div className="mt-8 border-4 border-foreground p-4 bg-background text-left">
                <div className="space-y-2 text-sm font-bold">
                  <div>BUSINESS NAME: ___________</div>
                  <div>EMAIL: ___________</div>
                  <div>ADDRESS: ___________</div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-foreground text-background w-16 h-16 rounded-none flex items-center justify-center text-3xl font-black mx-auto mb-8">2</div>
              <h3 className="text-3xl font-black mb-4">CLIENT INFO</h3>
              <p className="text-lg font-bold">
                Add client details and services. 
                Quick autocomplete for returning clients.
              </p>
              <div className="mt-8 border-4 border-foreground p-4 bg-background text-left">
                <div className="space-y-2 text-sm font-bold">
                  <div>CLIENT: ___________</div>
                  <div>SERVICE: ___________</div>
                  <div>AMOUNT: $ ___________</div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-foreground text-background w-16 h-16 rounded-none flex items-center justify-center text-3xl font-black mx-auto mb-8">3</div>
              <h3 className="text-3xl font-black mb-4">PREVIEW & SEND</h3>
              <p className="text-lg font-bold">
                Review your invoice and send immediately. 
                PDF generation happens instantly.
              </p>
              <div className="mt-8 border-4 border-foreground p-4 bg-foreground text-background text-left">
                <div className="space-y-2 text-sm font-bold">
                  <div>✓ PREVIEW COMPLETE</div>
                  <div>✓ PDF GENERATED</div>
                  <div>✓ READY TO SEND</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl sm:text-7xl font-black mb-16 text-center">WHAT USERS SAY</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="border-4 border-foreground p-8 bg-background">
              <div className="text-4xl font-black mb-4">"FINALLY"</div>
              <p className="text-lg font-bold mb-4">
                "No more complex invoicing software. 
                I create invoices faster than I can make coffee."
              </p>
              <div className="border-t-2 border-foreground pt-4">
                <div className="font-black">SARAH K.</div>
                <div className="font-bold">FREELANCE DESIGNER</div>
              </div>
            </div>

            <div className="border-4 border-foreground p-8 bg-foreground text-background">
              <div className="text-4xl font-black mb-4">"SIMPLE"</div>
              <p className="text-lg font-bold mb-4">
                "Exactly what I needed. No bloat, no confusion. 
                Just invoices that work."
              </p>
              <div className="border-t-2 border-background pt-4">
                <div className="font-black">MIKE R.</div>
                <div className="font-bold">CONSULTANT</div>
              </div>
            </div>

            <div className="border-4 border-foreground p-8 bg-background">
              <div className="text-4xl font-black mb-4">"FAST"</div>
              <p className="text-lg font-bold mb-4">
                "I bill 20+ clients monthly. This saves me hours 
                compared to other tools."
              </p>
              <div className="border-t-2 border-foreground pt-4">
                <div className="font-black">JENNY L.</div>
                <div className="font-bold">SMALL BUSINESS OWNER</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-foreground text-background py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl sm:text-7xl font-black mb-8">START NOW</h2>
          <p className="text-2xl font-bold mb-12">
            JOIN THOUSANDS OF FREELANCERS AND SMALL BUSINESSES
          </p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-background text-foreground px-12 py-6 text-2xl font-black hover:bg-gray-200 border-4 border-background transition-none"
          >
            CREATE YOUR FIRST INVOICE
          </button>
          <div className="mt-8 text-lg font-bold">
            NO SIGNUP REQUIRED • NO CREDIT CARD • NO BULLSHIT
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-foreground bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-black mb-4">INVOICESNAP</div>
              <p className="font-bold">
                Fast, bloat-free invoicing for professionals who value their time.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-black mb-4">PRODUCT</h4>
              <ul className="space-y-2 font-bold">
                <li><a href="#" className="hover:underline">FEATURES</a></li>
                <li><a href="#" className="hover:underline">TEMPLATES</a></li>
                <li><a href="#" className="hover:underline">PRICING</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-black mb-4">SUPPORT</h4>
              <ul className="space-y-2 font-bold">
                <li><a href="#" className="hover:underline">HELP CENTER</a></li>
                <li><a href="#" className="hover:underline">CONTACT</a></li>
                <li><a href="#" className="hover:underline">STATUS</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-black mb-4">LEGAL</h4>
              <ul className="space-y-2 font-bold">
                <li><a href="#" className="hover:underline">PRIVACY</a></li>
                <li><a href="#" className="hover:underline">TERMS</a></li>
                <li><a href="#" className="hover:underline">COOKIES</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t-2 border-foreground mt-12 pt-8 text-center font-bold">
            © 2024 INVOICESNAP. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  )
}

function App() {
  const { loading, isAuthenticated } = useBetterAuth()
  const { theme } = useTheme()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-foreground"></div>
      </div>
    )
  }

  return (
    <div className={theme}>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { 
            background: 'var(--color-foreground)', 
            color: 'var(--color-background)',
            fontWeight: 'bold',
            border: '2px solid var(--color-foreground)'
          },
          success: { 
            style: { 
              background: 'var(--color-success)',
              color: 'var(--color-background)'
            } 
          },
          error: { 
            style: { 
              background: 'var(--color-danger)',
              color: 'var(--color-background)'
            } 
          }
        }}
      />
      
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />} 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-invoice" 
            element={
              <ProtectedRoute>
                <InvoiceForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/invoices" 
            element={
              <ProtectedRoute>
                <InvoiceList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/templates" 
            element={
              <ProtectedRoute>
                <TemplateManager />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
