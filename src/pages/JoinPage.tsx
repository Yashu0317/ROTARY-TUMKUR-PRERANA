import { useState } from 'react';
// import { supabase } from '../supabaseClient';
import { Send } from 'lucide-react';
import logo from '/src/images/logo1.png'; // adjust path if needed

interface JoinPageProps {
  onNavigate: (page: string) => void;
}

export default function JoinPage({ onNavigate }: JoinPageProps) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    mobile: '',
    email: '',
    role: '',
    focus_areas: [] as string[],
    gender: '',
    age_range: '',
    address: {
      street: '',
      zip: '',
      city: '',
      state: '',
    },
    occupation: '',
    hear_about: '',
    reason: '',
    comments: '',
    organisation_name: '',
    organisation_type: '',
    organisation_reason: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // For nested address fields
    if (name.startsWith('address.')) {
      const key = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [key]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFocusAreasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      focus_areas: checked
        ? [...prev.focus_areas, value]
        : prev.focus_areas.filter(a => a !== value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare payload for Supabase - flatten nested address and join focus_areas as string
    const payload = {
      ...formData,
      focus_areas: formData.focus_areas.join(', '),
      street: formData.address.street,
      zip: formData.address.zip,
      city: formData.address.city,
      state: formData.address.state,
    };

    // Uncomment and adjust when supabase client is ready
    /*
    const { error } = await supabase.from('join_requests').insert([payload]);
    if (error) {
      console.error(error);
      alert('Something went wrong.');
    } else {
      setSubmitted(true);
    }
    */

    // Temporary: simulate success for testing
    setSubmitted(true);
  };

  const Header = () => (
    <div className="flex items-center gap-4 mb-8">
      <img src={logo} alt="Rotary Logo" className="h-16 w-16 object-contain" />
      <div>
        <h1 className="text-2xl font-bold text-blue-900">ROTARY TUMKUR PRERANA</h1>
        <p className="text-sm text-gray-600">Club of Tumkur</p>
      </div>
    </div>
  );

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow max-w-md text-center">
          <Header />
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="text-green-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            Your interest has been submitted. We will contact you soon.
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-8 bg-white mt-12 rounded shadow">
      <Header />
      <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">Join Us!</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">First Name *</label>
            <input
              type="text"
              name="first_name"
              required
              value={formData.first_name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Last Name *</label>
            <input
              type="text"
              name="last_name"
              required
              value={formData.last_name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Mobile Number *</label>
          <input
            type="tel"
            name="mobile"
            required
            value={formData.mobile}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Email *</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="text-sm font-medium">What would you like to join as? *</label>
          <select
            name="role"
            required
            value={formData.role}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">-Select-</option>
            <option value="Volunteer">Volunteer</option>
            <option value="Member">Member</option>
            <option value="Partner">Partner</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">What areas of focus are you interested in? *</label>
          {[
            'Peace Building and Conflict Prevention',
            'Disease Prevention and Treatment',
            'Basic Education and Literacy',
            'Water, Sanitation and Hygiene',
            'Community Economic Development',
            'Maternal and Child Health',
            'Environment',
          ].map(area => (
            <label key={area} className="block text-sm">
              <input
                type="checkbox"
                name="focus_areas"
                value={area}
                checked={formData.focus_areas.includes(area)}
                onChange={handleFocusAreasChange}
                className="mr-2"
              />
              {area}
            </label>
          ))}
        </div>

        <div>
          <label className="text-sm font-medium">Gender *</label>
          <select
            name="gender"
            required
            value={formData.gender}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select a choice</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-binary">Non-binary</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Your Age Range</label>
          <input
            type="text"
            name="age_range"
            value={formData.age_range}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="e.g., 18–25, 26–35"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Residential Address *</label>
          <input
            type="text"
            name="address.street"
            required
            placeholder="Street Address"
            value={formData.address.street}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-2"
          />
          <input
            type="text"
            name="address.zip"
            placeholder="Postal / Zip Code"
            value={formData.address.zip}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-2"
          />
          <input
            type="text"
            name="address.city"
            required
            placeholder="City"
            value={formData.address.city}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-2"
          />
          <input
            type="text"
            name="address.state"
            required
            placeholder="State"
            value={formData.address.state}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Please enter your Occupation *</label>
          <input
            type="text"
            name="occupation"
            required
            value={formData.occupation}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="text-sm font-medium">How did you hear about Rotary? *</label>
          <select
            name="hear_about"
            required
            value={formData.hear_about}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select a choice</option>
            <option value="Friend or Family">I attended a Rotary Event</option>
            <option value="Social Media">I Participated in a Rotary program</option>
            <option value="Event or Seminar">Through Personal Connection(Friend or a family member)</option>
            <option value="Online Search">Through Social Media</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Why do you want to get involved with Rotary? *</label>
          <textarea
            name="reason"
            required
            value={formData.reason}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows={4}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Any Additional Comments</label>
          <textarea
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows={3}
          />
        </div>

        {formData.role === 'Partner' && (
          <>
            <div>
              <label className="text-sm font-medium">Please Enter the Name of Your Organisation *</label>
              <input
                type="text"
                name="organisation_name"
                required
                value={formData.organisation_name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
  <label className="text-sm font-medium">Type of Organisation *</label>
  <select
    name="organisation_type"
    required
    value={formData.organisation_type}
    onChange={handleChange}
    className="w-full border p-2 rounded"
  >
    <option value="">-Select-</option>
    <option value="Government">Government</option>
    <option value="Corporate">Corporate</option>
    <option value="NGO">NGO</option>
  </select>
</div>


            <div>
              <label className="text-sm font-medium">Why would you like to tie up with Rotary? *</label>
              <textarea
                name="organisation_reason"
                required
                value={formData.organisation_reason}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                rows={4}
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full bg-blue-900 text-white py-3 rounded font-semibold hover:bg-blue-800"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
