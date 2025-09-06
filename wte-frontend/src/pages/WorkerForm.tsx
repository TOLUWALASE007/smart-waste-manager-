import { useEffect, useState } from "react";
import { Trash2, MapPin, AlertCircle, CheckCircle, Phone, User, Package } from "lucide-react";
import { fetchPublic, buildUrl, API_ENDPOINTS } from "../utils/api";
import Spinner from "../components/Spinner";

interface Site {
  id: number;
  name: string;
}

interface FormData {
  siteId: string;
  wasteType: string;
  quantity: string;
  unit: string;
  contactName: string;
  contactPhone: string;
  notes: string;
}

interface FormErrors {
  siteId?: string;
  wasteType?: string;
  quantity?: string;
  contactName?: string;
  contactPhone?: string;
}

export default function WorkerForm() {
  const [sites, setSites] = useState<Site[]>([]);
  const [form, setForm] = useState<FormData>({
    siteId: "",
    wasteType: "",
    quantity: "",
    unit: "kg",
    contactName: "",
    contactPhone: "",
    notes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch available sites from backend
  useEffect(() => {
    async function fetchSites() {
      try {
        const data = await fetchPublic(buildUrl(API_ENDPOINTS.SITES));
        setSites(data);
      } catch {
        setError("Failed to load sites");
      }
    }
    fetchSites();
  }, []);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.siteId) newErrors.siteId = "Please select a site";
    if (!form.wasteType.trim()) newErrors.wasteType = "Waste type is required";
    if (!form.quantity || parseFloat(form.quantity) <= 0) newErrors.quantity = "Please enter a valid quantity";
    if (!form.contactName.trim()) newErrors.contactName = "Contact name is required";
    if (!form.contactPhone.trim()) {
      newErrors.contactPhone = "Phone number is required";
    } else if (!/^[0-9+\-\s()]{10,15}$/.test(form.contactPhone)) {
      newErrors.contactPhone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Format phone number as user types
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length > 10) value = value.slice(0, 10); // Limit to 10 digits
    
    setForm(prev => ({ ...prev, contactPhone: value }));
    if (errors.contactPhone) {
      setErrors(prev => ({ ...prev, contactPhone: undefined }));
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await fetchPublic(buildUrl(API_ENDPOINTS.SUBMIT_WASTE), {
        method: "POST",
        body: JSON.stringify({
          siteId: parseInt(form.siteId),
          wasteType: form.wasteType,
          quantity: parseFloat(form.quantity),
          unit: form.unit,
          notes: form.notes,
          contactName: form.contactName,
          contactPhone: form.contactPhone,
        }),
      });

      setSuccess("✅ Waste report submitted successfully! We will collect it soon.");
      // Reset form
      setForm({
        siteId: "",
        wasteType: "",
        quantity: "",
        unit: "kg",
        contactName: "",
        contactPhone: "",
        notes: "",
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary-100 rounded-full">
              <Trash2 className="h-8 w-8 text-primary-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Waste Notification Form
          </h1>
          <p className="text-gray-600 mb-4">
            Report waste that needs to be collected from your site
          </p>
          
          {/* Admin Navigation */}
          <div className="flex justify-center">
            <a 
              href="/login" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            >
              <User className="h-4 w-4 mr-2" />
              Admin Login
            </a>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Site Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-1" />
                Site Location *
              </label>
              <select
                name="siteId"
                value={form.siteId}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                  errors.siteId ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                }`}
                required
              >
                <option value="">Select your site</option>
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </select>
              {errors.siteId && (
                <p className="mt-1 text-sm text-red-600">{errors.siteId}</p>
              )}
            </div>

            {/* Waste Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Package className="h-4 w-4 inline mr-1" />
                Waste Type *
              </label>
              <input
                type="text"
                name="wasteType"
                placeholder="e.g., Cassava peels, Animal manure, etc."
                value={form.wasteType}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                  errors.wasteType ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.wasteType && (
                <p className="mt-1 text-sm text-red-600">{errors.wasteType}</p>
              )}
            </div>

            {/* Quantity and Unit */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  name="quantity"
                  step="0.1"
                  placeholder="0.0"
                  value={form.quantity}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                    errors.quantity ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.quantity && (
                  <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit
                </label>
                <select
                  name="unit"
                  value={form.unit}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="kg">kg</option>
                  <option value="tons">tons</option>
                  <option value="liters">liters</option>
                  <option value="bags">bags</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                name="notes"
                placeholder="Any additional information about the waste..."
                value={form.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-1" />
                  Your Name *
                </label>
                <input
                  type="text"
                  name="contactName"
                  placeholder="Enter your full name"
                  value={form.contactName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                    errors.contactName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.contactName && (
                  <p className="mt-1 text-sm text-red-600">{errors.contactName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  placeholder="Enter your phone number"
                  value={form.contactPhone}
                  onChange={handlePhoneChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                    errors.contactPhone ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.contactPhone && (
                  <p className="mt-1 text-sm text-red-600">{errors.contactPhone}</p>
                )}
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              </div>
            )}

            {success && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                  <div className="text-sm text-green-700">{success}</div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <div className="flex items-center">
                  <Spinner size="sm" className="mr-2" />
                  Submitting...
                </div>
              ) : (
                "Submit Waste Report"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Need help? Contact your site supervisor</p>
        </div>
      </div>
    </div>
  );
}
