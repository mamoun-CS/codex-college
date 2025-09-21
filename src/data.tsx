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
        "https://n8n.srv936449.hstgr.cloud/webhook/5e076f7c-b35e-49ed-a46e-82c7441b43df",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}), 
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();
      if (!Array.isArray(result)) {
        throw new Error("Invalid data format received from API");
      }

      // التحويل من مفاتيح عربية → انجليزية
      const mapped: EmployeeDeal[] = result.map((item, index) => ({
        id: item["#ID"] ?? String(index + 1),
        employeeName: item["اسم الموظف"],
        date: item["التاريخ"],
        dailyAmountSum: item["مجموع المبالغ اليومية"],
        monthlyAmountSum: item["مجموع المبالغ الشهرية"],
        dailyDealsCount: item["عدد الصفقات اليومية"],
        monthlyDealsCount: item["عدد الصفقات الشهرية"],
        dealsPerEmployeeDaily: item["عدد الصفقات لكل موظف (اليوم)"],
        dealsPerEmployeeMonthly: item["عدد الصفقات لكل موظف (الشهر)"],
      }));

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
      if (now.getHours() === 15 && now.getMinutes() === 33) {
        fetchData();
      }
    }, 60000);

    return () => clearInterval(interval);

  }, []);

  return { data, loading, error, refetch: fetchData };
}
