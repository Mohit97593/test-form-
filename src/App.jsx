import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, CreditCard, CheckCircle, Tag, MapPin, User, Mail } from 'lucide-react'

// Reusable Components
const Input = ({ label, name, type = 'text', placeholder, required, value, onChange, help }) => (
  <div className="form-group">
    <label className="form-label">{label}</label>
    <div className="input-group">
      <input
        type={type}
        name={name}
        className="form-control"
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
      />
    </div>
    {help && <small className="text-muted" style={{ display: 'block', marginTop: '0.25rem' }}>{help}</small>}
  </div>
)

const Select = ({ label, name, options, value, onChange }) => (
  <div className="form-group">
    <label className="form-label">{label}</label>
    <select name={name} className="form-control" value={value} onChange={onChange}>
      {options.map((opt, idx) => (
        <option key={idx} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
)

const Checkbox = ({ label, checked, onChange }) => (
  <label className="checkbox-item">
    <input type="checkbox" checked={checked} onChange={onChange} />
    <span className="text-main" style={{ fontSize: '0.9375rem' }}>{label}</span>
  </label>
)

const Radio = ({ label, name, id, checked, onChange }) => (
  <label className="radio-item" htmlFor={id}>
    <input type="radio" name={name} id={id} checked={checked} onChange={onChange} />
    <span className="text-main">{label}</span>
  </label>
)

function App() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    address: '',
    address2: '',
    country: 'Choose...',
    state: 'Choose...',
    zip: '',
    sameAddress: true,
    saveInfo: false,
    paymentMethod: 'credit',
    ccName: '',
    ccNumber: '',
    ccExpiration: '',
    ccCvv: ''
  })

  const [promoCode, setPromoCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus({ type: '', message: '' })

    try {
      const response = await fetch('https://test-form-backend-eosin.vercel.app/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setStatus({ type: 'success', message: `${data.message} Order ID: ${data.orderId}` })
        // Optional: Reset form or redirect
      } else {
        setStatus({ type: 'error', message: data.message || 'Something went wrong.' })
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Could not connect to the server. Please try again later.' })
    } finally {
      setLoading(false)
    }
  }

  const cartItems = [
    { name: 'Product name', desc: 'Brief description', price: 12 },
    { name: 'Second product', desc: 'Brief description', price: 8 },
    { name: 'Third item', desc: 'Brief description', price: 5 },
  ]

  const total = cartItems.reduce((acc, item) => acc + item.price, 0) - 5

  return (
    <div className="container">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-5 text-center"
      >
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Checkout</h1>
        <p className="lead">
          Complete your purchase securely. Our streamlined checkout process ensures your data is protected and your order is processed instantly.
        </p>
      </motion.header>

      <div className="layout-grid">
        {/* Billing Column */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h4 className="mb-4">Billing details</h4>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="col-6">
                <Input label="First name" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
              </div>
              <div className="col-6">
                <Input label="Last name" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="col-12">
              <div className="form-group">
                <label className="form-label">Username</label>
                <div className="input-group">
                  <span className="input-group-text">@</span>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="username"
                    placeholder="Username" 
                    value={formData.username}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>
            </div>

            <div className="col-12">
              <Input 
                label={<>Email <span className="text-muted">(Optional)</span></>} 
                name="email" 
                type="email" 
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-12">
              <Input 
                label="Address" 
                name="address" 
                placeholder="1234 Main St"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="col-12">
              <Input 
                label={<>Address 2 <span className="text-muted">(Optional)</span></>} 
                name="address2" 
                placeholder="Apartment or suite"
                value={formData.address2}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-row">
              <div className="col-5">
                <Select 
                  label="Country" 
                  name="country" 
                  options={['Choose...', 'United States', 'Germany', 'India', 'United Kingdom']}
                  value={formData.country}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-4">
                <Select 
                  label="State" 
                  name="state" 
                  options={['Choose...', 'California', 'Frankfurt', 'New York', 'Delhi']}
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-3">
                <Input 
                  label="Zip" 
                  name="zip"
                  value={formData.zip}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <hr />

            <div className="mb-3">
              <Checkbox 
                label="Shipping address is the same as my billing address" 
                checked={formData.sameAddress}
                onChange={(e) => handleInputChange({ target: { name: 'sameAddress', type: 'checkbox', checked: e.target.checked }})}
              />
              <Checkbox 
                label="Save this information for next time" 
                checked={formData.saveInfo}
                onChange={(e) => handleInputChange({ target: { name: 'saveInfo', type: 'checkbox', checked: e.target.checked }})}
              />
            </div>

            <hr />

            <h4 className="mb-4">Payment</h4>
            <div className="selection-group mb-4">
              <Radio 
                label="Credit card" 
                name="paymentMethod" 
                id="credit" 
                checked={formData.paymentMethod === 'credit'} 
                onChange={() => setFormData(p => ({...p, paymentMethod: 'credit'}))}
              />
              <Radio 
                label="Debit card" 
                name="paymentMethod" 
                id="debit" 
                checked={formData.paymentMethod === 'debit'} 
                onChange={() => setFormData(p => ({...p, paymentMethod: 'debit'}))}
              />
              <Radio 
                label="PayPal" 
                name="paymentMethod" 
                id="paypal" 
                checked={formData.paymentMethod === 'paypal'} 
                onChange={() => setFormData(p => ({...p, paymentMethod: 'paypal'}))}
              />
            </div>

            <div className="form-row">
              <div className="col-6">
                <Input 
                  label="Name on card" 
                  name="ccName" 
                  help="Full name as displayed on card"
                  value={formData.ccName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-6">
                <Input 
                  label="Credit card number" 
                  name="ccNumber"
                  value={formData.ccNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row mt-3">
              <div className="col-3">
                <Input 
                  label="Expiration" 
                  name="ccExpiration"
                  value={formData.ccExpiration}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-3">
                <Input 
                  label="CVV" 
                  name="ccCvv"
                  value={formData.ccCvv}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <hr />

            {status.message && (
              <div style={{ 
                padding: '1rem', 
                borderRadius: '8px', 
                marginBottom: '1.5rem',
                backgroundColor: status.type === 'success' ? '#f0fdf4' : '#fef2f2',
                color: status.type === 'success' ? '#166534' : '#991b1b',
                border: `1px solid ${status.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                {status.type === 'success' ? <CheckCircle size={18} /> : <div style={{ fontWeight: 'bold' }}>!</div>}
                {status.message}
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? (
                <>
                  <div className="spinner" style={{ 
                    width: '20px', 
                    height: '20px', 
                    border: '3px solid rgba(255,255,255,0.3)', 
                    borderTop: '3px solid white', 
                    borderRadius: '50%', 
                    animation: 'spin 1s linear infinite',
                    marginRight: '0.75rem'
                  }} />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard size={20} style={{ marginRight: '0.75rem' }} />
                  Complete Checkout
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Cart Column */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="order-md-last"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h4 style={{ margin: 0 }}>Your cart</h4>
            <span className="badge">3</span>
          </div>

          <div className="card mb-4">
            <ul className="list-group">
              {cartItems.map((item, idx) => (
                <li key={idx} className="list-group-item">
                  <div>
                    <h6 style={{ margin: 0 }}>{item.name}</h6>
                    <small className="text-muted">{item.desc}</small>
                  </div>
                  <span className="text-muted">${item.price}</span>
                </li>
              ))}
              <li className="list-group-item text-success" style={{ background: '#f0fdf4', margin: '0.5rem -1.5rem', padding: '1rem 1.5rem' }}>
                <div>
                  <h6 style={{ margin: 0 }}>Promo code</h6>
                  <small>EXAMPLECODE</small>
                </div>
                <span>-$5</span>
              </li>
              <li className="list-group-item" style={{ borderTop: '2px solid var(--border)', marginTop: '0.5rem' }}>
                <span>Total (USD)</span>
                <strong>${total}</strong>
              </li>
            </ul>
          </div>

          <div className="card">
            <div className="input-group">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button type="button" className="btn btn-secondary">Redeem</button>
            </div>
          </div>
        </motion.div>
      </div>

      <footer className="my-5 pt-5 text-muted text-center" style={{ fontSize: '0.875rem' }}>
        <p className="mb-1">© 2024-2026 Premium Brand Inc.</p>
        <ul style={{ listStyle: 'none', display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem' }}>
          <li><a href="#" className="text-muted" style={{ textDecoration: 'none' }}>Privacy</a></li>
          <li><a href="#" className="text-muted" style={{ textDecoration: 'none' }}>Terms</a></li>
          <li><a href="#" className="text-muted" style={{ textDecoration: 'none' }}>Support</a></li>
        </ul>
      </footer>
    </div>
  )
}

export default App
