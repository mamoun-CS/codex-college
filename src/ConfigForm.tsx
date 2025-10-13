import React, { useState } from 'react'
import './config.css'
import { Settings, X } from 'lucide-react'

function ConfigForm() {
  const [studentName, setStudentName] = useState('')
  const [employeeName, setEmployeeName] = useState('')
  const [configDate, setConfigDate] = useState('')
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | '' }>({ message: '', type: '' })

  // state جديد لرقم الهاتف وحالة ظهور كارت الهاتف
  const [phoneNumber, setPhoneNumber] = useState('')
  const [showPhoneCard, setShowPhoneCard] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!studentName || !employeeName || !configDate) {
      setNotification({ message: 'يرجى ملء جميع الحقول', type: 'error' })
      return
    }

    const selectedDate = new Date(configDate)
    const now = new Date()
    if (selectedDate < now) {
      setNotification({ message: 'لا يمكن اختيار تاريخ/وقت في الماضي', type: 'error' })
      return
    }

    const payload = { studentName, employeeName, configDate }

    try {
      const response = await fetch(
        "https://n8n.srv1018345.hstgr.cloud/webhook/7951ec37-23f7-418d-adb2-23714ba6a723",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      )

      if (!response.ok) throw new Error('فشل الإرسال')

      const data = await response.json()

      if (data.sendmessage === "true") {
        setNotification({ message: 'تم إرسال البيانات بنجاح!', type: 'success' })
        setStudentName('')
        setEmployeeName('')
        setConfigDate('')
      } else if (data.sendmessage === "errorvalue") {
        // إظهار كارت إدخال رقم الهاتف
        setShowPhoneCard(true)
      } else {
        setNotification({ message: `${data.textdata || 'خطأ غير معروف'}`, type: 'error' })
      }

    } catch (error) {
      console.error(error)
      setNotification({ message: 'حدث خطأ أثناء الإرسال', type: 'error' })
    }
  }

  // إرسال رقم الهاتف للويبهوك الثاني
 
// إرسال رقم الهاتف للويبهوك الثاني
const handlePhoneSubmit = async () => {
  if (!phoneNumber) {
    alert('يرجى إدخال رقم الهاتف')
    return
  }

  try {
    const response = await fetch(
      "https://n8n.srv1018345.hstgr.cloud/webhook/2b091cb3-0f71-4f23-b4de-e5456b1e0a36",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, studentName, employeeName, configDate }),
      }
    )

    if (!response.ok) throw new Error('فشل الإرسال')

    const data = await response.json()

    if (data.sendmessage === "true") {
      // نجاح العملية
      setNotification({ message: '✅ تم إرسال رقم الهاتف بنجاح!', type: 'success' })
      setShowPhoneCard(false) // إخفاء الكارت
      setPhoneNumber('')
    } else if (data.sendmessage === "errorvalue") {
      // فشل العملية ويحتاج محاولة مرة ثانية
      setNotification({ message: '❌ فشل إرسال رقم الهاتف.. حاول مرة أخرى', type: 'error' })
      setShowPhoneCard(true) // يظل الكارت ظاهر
    } else {
      setNotification({ message: `${data.textdata || 'خطأ غير معروف عند إرسال الهاتف'}`, type: 'error' })
      setShowPhoneCard(true) // يظل ظاهر للمحاولة من جديد
    }

  } catch (error) {
    console.error(error)
    setNotification({ message: 'حدث خطأ أثناء إرسال رقم الهاتف', type: 'error' })
    setShowPhoneCard(true) // يظل الكارت ظاهر للمحاولة
  }
}

  return (
    <div className="config-page" dir="rtl">
      {/* إشعار في وسط الشاشة */}
      {notification.message && (
        <div className={`notification-card ${notification.type}`} style={{ zIndex: 2 }}>
          <button className="close-btn" onClick={() => setNotification({ message: '', type: '' })}>
            <X size={18} />
          </button>
          <p>{notification.message}</p>
        </div>
      )}

      {/* كارت رقم الهاتف */}
      {showPhoneCard && (
        <div className="notification-card error" style={{ zIndex: 3 }}>
          <button className="close-btn" onClick={() => setShowPhoneCard(false)}>
            <X size={18} />
          </button>
          <p>يرجى إدخال رقم الهاتف لإكمال العملية:</p>
          <input
            type="tel"
            placeholder="رقم الهاتف"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={{ marginTop: '10px', padding: '8px', width: '100%', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <button
            onClick={handlePhoneSubmit}
            style={{ marginTop: '12px', padding: '8px 16px', borderRadius: '6px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            إرسال
          </button>
        </div>
      )}

      <div className="config-card">
        <h2 className="config-title">
          <Settings size={22} className="config-icon" />
          إعدادات النظام
        </h2>
        <form onSubmit={handleSubmit} className="config-form">
          <div className="form-group">
            <label>اسم الطالب:</label>
            <input
              type="text"
              value={studentName}
              onChange={e => setStudentName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>اسم الموظف:</label>
            <input
              type="text"
              value={employeeName}
              onChange={e => setEmployeeName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>التاريخ والوقت:</label>
            <input
              type="datetime-local"
              value={configDate}
              onChange={e => setConfigDate(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="save-btn">حفظ</button>
        </form>
      </div>
    </div>
  )
}

export default ConfigForm
