import { useEffect, useState } from "react";

// تعريف شكل البيانات
export interface EmployeeDeal {
  id: string;
  employeeName: string;
  date: string;   // تاريخ الصفقة
  amount: number; // مبلغ الصفقة
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
        import.meta.env.VITE_WEBHOOK_DATA_FETCH,
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

      // التحويل من مفاتيح عربية → انجليزية (المهم فقط)
      const mapped: EmployeeDeal[] = result.map((item, index) => ({
        id: item["#ID"] ?? String(index + 1),
        employeeName: item["اسم الموظف"],
        date: item["التاريخ"],
        amount: item["المبلغ"], // <-- لازم تتأكد إن عندك مفتاح "المبلغ" بالـ API
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

    // تحديث كل دقيقة (مثال)
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, refetch: fetchData };
}
