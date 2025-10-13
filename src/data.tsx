import { useEffect, useState } from "react";

// تعريف شكل البيانات
export interface EmployeeDeal {
  id: string;
  employeeName: string;
  date: string;
  dailyAmountSum: number;
  monthlyAmountSum: number;
  dailyDealsCount: number;
  monthlyDealsCount: number;
  dealsPerEmployeeDaily: number;
  dealsPerEmployeeMonthly: number;
  amount: number; // الحقل الجديد
}

export function useEmployeeDealsData() {
  const [data, setData] = useState<EmployeeDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        "https://n8n.srv1018345.hstgr.cloud/webhook/5e076f7c-b35e-49ed-a46e-82c7441b43df",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      // ناخذ الرد كـ نص أول
      const text = await res.text();

      if (!text || text.trim() === "") {
        // إذا ما في بيانات (زي أول الشهر) → رجّع مصفوفة فاضية
        setData([]);
        return;
      }

      let result;
      try {
        result = JSON.parse(text);
      } catch (err) {
        throw new Error("Invalid JSON format: " + text);
      }

      if (!Array.isArray(result)) {
        throw new Error("Invalid data format received from API");
      }

      // التحويل من مفاتيح عربية → انجليزية
      const mapped: EmployeeDeal[] = result.map((item, index) => {
        return {
          id: item["ID#"] ?? String(index + 1),
          employeeName: item["اسم الموظف"],
          date: item["التاريخ"],
          dailyAmountSum: Number(item["مجموع المبالغ اليومية"]) || 0,
          monthlyAmountSum: Number(item["مجموع المبالغ الشهرية"]) || 0,
          dailyDealsCount: Number(item["عدد الصفقات اليومية"]) || 0,
          monthlyDealsCount: Number(item["عدد الصفقات الشهرية"]) || 0,
          dealsPerEmployeeDaily:
            Number(item["عدد الصفقات لكل موظف (اليوم)"]) || 0,
          dealsPerEmployeeMonthly:
            Number(item["عدد الصفقات لكل موظف (الشهر)"]) || 0,
          amount: Number(item["amount"]) || 0,
        };
      });

      setData(mapped);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch data");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // تحديث يومياً الساعة 8:00 مساءً
    const interval = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 20 && now.getMinutes() === 0) {
        fetchData();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, refetch: fetchData };
}
