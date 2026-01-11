import axios from "axios";
import { useEffect, useState } from "react";



interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  rating: number;
}

export function useCustomerRecommendations() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [formData, setFormData] = useState({ name: "", role: "", text: "" });
  const [loading, setLoading] = useState(false);
  // جلب التوصيات
  const getdata = async () => {
    try {
      const res = await axios.get("/api/dashboard/customer-recommendations");
      setTestimonials(res.data);
    } catch (error) {
      console.error("خطأ في جلب التوصيات", error);
    }
  };

  useEffect(() => {
    getdata();
  }, []);

  const deleteTestimonial = async (id: number) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    try {
      await axios.delete(`/api/dashboard/customer-recommendations/${id}`);
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      alert("حدث خطأ أثناء الحذف");
    }
  };
  const handleSubmit = async (onAdd:any , onClose:any ) => {

    setLoading(true);
    try {
      const response = await axios.post("/api/dashboard/customer-recommendations", {
        ...formData,
        rating: rating,
      });

      if (response.status === 201 || response.status === 200) {
        onAdd(response.data);
        onClose();
        setFormData({ name: "", role: "", text: "" });
        setRating(5);
      }
    } catch (error) {
      console.error("Error saving testimonial:", error);
      alert("حدث خطأ أثناء حفظ التوصية");
    } finally {
      setLoading(false);
    }
  };

  return {
    testimonials , setTestimonials,
    isModalOpen , setIsModalOpen,
    deleteTestimonial , 
    rating , setRating,
    formData , setFormData,
    loading , setLoading,
    handleSubmit
  }
}