import { useState } from "react";
import { getApi, postApi } from "../api";

export const usePaymentLogic = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentPayments, setStudentPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    discount: ""
  });

  // Search students
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setErrors({ search: "Please enter a search term" });
      return;
    }

    setSearchLoading(true);
    setErrors({});

    try {
      const data = await getApi(`searchStudent/${searchQuery}`);
      setSearchResults(data.students || []);

      if (data.students && data.students.length === 0) {
        setErrors({ search: "No students found matching your search" });
      }
    } catch (error) {
      console.error("Search error:", error);
      setErrors({ search: "Failed to search students. Please try again." });
    } finally {
      setSearchLoading(false);
    }
  };

  // Select student and fetch their payments
  const handleSelectStudent = async (student) => {
    setSelectedStudent(student);
    setSearchResults([]);
    setSearchQuery("");
    setLoading(true);
    setErrors({});

    try {
      const data = await getApi(`getStudentPayment/${student._id}`);
      setStudentPayments(data.data || []);
    } catch (error) {
      console.error("Payment fetch error:", error);
      setErrors({ payment: "Failed to fetch student payments" });
    } finally {
      setLoading(false);
    }
  };

  // Calculate payment summary
  const calculatePaymentSummary = () => {
    if (!selectedStudent || !selectedStudent.courseId) return null;

    const courseFee = selectedStudent.courseId.fee;
    const admissionDate = new Date(selectedStudent.createdAt);
    const currentDate = new Date();

    // Calculate months from admission to current
    const monthsFromAdmission = (currentDate.getFullYear() - admissionDate.getFullYear()) * 12 +
      (currentDate.getMonth() - admissionDate.getMonth());

    const paidMonths = studentPayments.length;
    const totalPaid = studentPayments.reduce((sum, p) => sum + (p.amountPaid || 0), 0);
    const totalDiscount = studentPayments.reduce((sum, p) => sum + (p.discount || 0), 0);
    const dueMonths = Math.max(0, monthsFromAdmission - paidMonths);
    const totalDue = dueMonths * courseFee;

    return {
      courseFee,
      monthsFromAdmission,
      paidMonths,
      dueMonths,
      totalPaid,
      totalDiscount,
      totalDue
    };
  };

  // Handle payment form submission
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!selectedStudent) {
      setErrors({ payment: "Please select a student first" });
      return;
    }

    const amount = parseFloat(paymentForm.amount);
    const discount = parseFloat(paymentForm.discount) || 0;

    // Validation
    if (!amount || amount <= 0) {
      setErrors({ amount: "Please enter a valid amount" });
      return;
    }

    if (discount < 0) {
      setErrors({ discount: "Discount cannot be negative" });
      return;
    }

    if (discount > amount) {
      setErrors({ discount: "Discount cannot be greater than amount" });
      return;
    }

    setPaymentLoading(true);
    setErrors({});
    setSuccessMessage("");

    try {
      const response = await postApi(`/createPayment/${selectedStudent._id}`, {
        amount: amount,
        discount: discount
      });

      if (response.success) {
        setSuccessMessage(response.message || "Payment added successfully!");
        setPaymentForm({ amount: "", discount: "0" });

        // Refresh student payments
        const updatedData = await getApi(`getStudentPayment/${selectedStudent._id}`);
        setStudentPayments(updatedData.data || []);
      }
    } catch (error) {
      console.error("Payment error:", error);
      const errorMessage = error.response?.data?.message || "Failed to process payment. Please try again.";
      setErrors({ payment: errorMessage });
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  return {
    // State
    searchQuery,
    setSearchQuery,
    searchResults,
    selectedStudent,
    studentPayments,
    loading,
    searchLoading,
    paymentLoading,
    errors,
    successMessage,
    paymentForm,
    
    // Functions
    handleSearch,
    handleSelectStudent,
    calculatePaymentSummary,
    handlePaymentSubmit,
    handleInputChange
  };
};
