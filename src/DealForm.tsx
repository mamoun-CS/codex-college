import React, { useState } from "react";

interface InputFieldProps {
  label?: string;
  name?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, type = "text", value, onChange, required = false, placeholder }) => {
  const inputStyle = {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
  };

  return (
    <div style={{ marginBottom: "12px" }}>
      <label style={{ display: "block", marginBottom: "4px" }}>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  );
};

const DealForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    employeeName: "",
    studentName: "",
    courseName: "",
    courseAmount: "",
    firstPayment: "",
    monthlyPayment: "",
    paymentMethod: "",
    phone: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [, setWhatsappAttempts] = useState(0);
  const [whatsappPhone, setWhatsappPhone] = useState("");
  const [emailInput, setEmailInput] = useState("");

  const buttonStyle = {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "10px",
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.phone === "972599999999") {
      setError("⚠️ رقم الهاتف مستخدم مسبقاً. الرجاء إعادة إدخال جميع البيانات.");
      setFormData({
        employeeName: "",
        studentName: "",
        courseName: "",
        courseAmount: "",
        firstPayment: "",
        monthlyPayment: "",
        paymentMethod: "",
        phone: "",
        email: "",
      });
    } else {
      // ✅ Send data to n8n webhook
<<<<<<< HEAD
      fetch(import.meta.env.VITE_WEBHOOK_DEAL_SUBMIT, {
=======
      fetch("https://n8n.srv1018345.hstgr.cloud/webhook/9bc23745-724c-4fac-8b42-f6651096a01c", {
>>>>>>> 4a0487d4d17fa73b9be6a3480b3364027bdc2445
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("فشل إرسال البيانات 🚨");
          }
          return response.json();
        })
        .then((data) => {
          // إذا كان الرقم موجود مسبقاً حسب n8n
          if (data.responseBody.failed) {
            setError("⚠️ الرقم موجود مسبقاً. حاول مرة أخرى.");
            setFormData({
              employeeName: "",
              studentName: "",
              courseName: "",
              courseAmount: "",
              firstPayment: "",
              monthlyPayment: "",
              paymentMethod: "",
              phone: "",
              email: "",
            });
          } else if (data.responseBody.failedwhatsup) {
            // نجاح
            console.log("✅ Success:", data);
            setStep(2);
            setError("");
          }
          else{
             setStep(4);
            setError("");
          }
        })
        .catch((error) => {
          console.error("❌ Error:", error);
          setError("⚠️ حدث خطأ أثناء إرسال البيانات. حاول مرة أخرى.");
        });
    }
  };

  const handlePhoneVerify = () => {
    setWhatsappAttempts((prev) => {
      const newAttempt = prev + 1;

      if (newAttempt >= 3) {
        setStep(3);
        setError("");
      } else {
        // إرسال الرقم الجديد الذي دخله المستخدم
        const payload = { ...formData, phone: whatsappPhone }; // استبدل الرقم القديم بالجديد

<<<<<<< HEAD
        fetch(import.meta.env.VITE_WEBHOOK_WHATSAPP_VERIFY, {
=======
        fetch("https://n8n.srv1018345.hstgr.cloud/webhook/47d8c0e9-40a4-498a-82d6-b5bcda26a342", {
>>>>>>> 4a0487d4d17fa73b9be6a3480b3364027bdc2445
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
          .then((response) => {
            if (!response.ok) throw new Error("فشل إرسال البيانات 🚨");
            return response.json();
          })
          .then((data) => {
            if (data.responseBody?.failed) {
              // إعادة تعيين الرقم الجديد عند الفشل
              setWhatsappPhone("");
            }
            else{
             setStep(4);
            setError("");
          }
            setError(`فشل إرسال واتساب. المحاولة ${newAttempt}`);
          })
          .catch((err) => {
            console.error(err);
            setError("⚠️ حدث خطأ أثناء إرسال البيانات.");
          });
      }

      return newAttempt;
    });
  };

  const handleEmailConfirm = () => {
    // اختر البريد الإلكتروني الذي سيتم إرساله
    const emailToSend = emailInput || formData.email;

    if (!emailToSend) {
      setError("⚠️ الرجاء إدخال البريد الإلكتروني");
      return;
    }

    // أرسل البيانات إلى Webhook
    const payload = { ...formData, email: emailToSend };

<<<<<<< HEAD
    fetch(import.meta.env.VITE_WEBHOOK_EMAIL_FALLBACK, {
=======
    fetch("https://n8n.srv1018345.hstgr.cloud/webhook/6e9c7fda-712a-4e23-bfd8-4c07779f255c", {
>>>>>>> 4a0487d4d17fa73b9be6a3480b3364027bdc2445
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) throw new Error("فشل إرسال البيانات 🚨");
        return response.json();
      })
      .then((data) => {
        if (data.responseBody?.failedemail) {
          // البريد الإلكتروني فشل الإرسال → أفرغ الحقل لإعادة الإدخال
          setEmailInput("");
          setError("⚠️ البريد الإلكتروني غير صالح. الرجاء إعادة إدخاله.");
        } else {
          // نجاح → انتقل للخطوة 4
          setStep(4);
          setError("");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("⚠️ حدث خطأ أثناء إرسال البيانات. حاول مرة أخرى.");
      });
  };

  return (
    <div
      dir="rtl"
      style={{
        fontFamily: "Cairo, Tahoma, sans-serif",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: "white",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>إدخال صفقة جديدة</h1>

        {/* Step 1 */}
        {step === 1 && (
          <>
            <h2>إدخال الصفقة</h2>
            <form onSubmit={handleSubmit}>
              <InputField label="اسم الموظف" name="employeeName" value={formData.employeeName} onChange={handleInputChange} required placeholder="" />
              <InputField label="اسم الطالب" name="studentName" value={formData.studentName} onChange={handleInputChange} required placeholder="" />
              <InputField label="اسم الكورس" name="courseName" value={formData.courseName} onChange={handleInputChange} required placeholder="" />
              <InputField label="مبلغ الكورس" name="courseAmount" type="number" value={formData.courseAmount} onChange={handleInputChange} required placeholder="" />
              <InputField label="دفعة أولى" name="firstPayment" type="number" value={formData.firstPayment} onChange={handleInputChange} required placeholder="" />
              <InputField label="دفعة شهرية" name="monthlyPayment" type="number" value={formData.monthlyPayment} onChange={handleInputChange} required placeholder="" />
              <InputField label="طريقة الدفع" name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange} required placeholder="كاش / تحويل / بطاقة" />
              <InputField label="رقم الهاتف" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="" />
              <InputField label="إيميل الطالب (اختياري)" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="" />
              <button type="submit" style={buttonStyle}>
                إرسال
              </button>
            </form>
            {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <>
            <h2>اختبار واتساب</h2>
            <p>أعد إدخال رقم الهاتف لاختبار واتساب</p>
            <InputField label="" name="whatsappPhone" value={whatsappPhone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWhatsappPhone(e.target.value)} placeholder="رقم الهاتف" />
            <button onClick={handlePhoneVerify} style={buttonStyle}>
              تحقق
            </button>
            {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
          </>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <>
            <h2>بديل البريد الإلكتروني</h2>
            {formData.email ? (
              <p>✅ سيتم إرسال الرسالة عبر البريد الإلكتروني المسجّل.</p>
            ) : (
              <>
                <InputField label="" name="emailInput" type="email" value={emailInput} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailInput(e.target.value)} placeholder="إيميل" />
                <button onClick={handleEmailConfirm} style={buttonStyle}>
                  تأكيد
                </button>
              </>
            )}
            {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
          </>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div style={{ textAlign: "center", color: "green", fontSize: "18px" }}>
            🎉 تم إدخال الصفقة بنجاح!
          </div>
        )}
      </div>
    </div>
  );
};

export default DealForm;
