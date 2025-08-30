import { useEffect, useState } from "react";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import { validateContact, validateEmail } from "../../utils/Validation";
import { FaRegEye, FaEyeSlash } from "react-icons/fa";
import { handleUpdateProfile } from "../../utils/Handlerfunctions/formEditHandlers";
import { fetchProfile } from "../../utils/Handlerfunctions/getdata";

export default function EditProfile() {
  const [formData, setFormData] = useState({
    admin_id: "",
    name: "",
    email: "",
    contact_no: "",
    password: "",
  });

  const [errors, setErrors] = useState<{ email?: string; contact_no?: string }>(
    {}
  );
  const [showPassword, setShowPassword] = useState(false);

useEffect(() => {
  fetchProfile()
    .then((data) => {
      setFormData({ ...data, password: "" }); // data already has admin_id
    })
    .catch((err) => console.error("Error fetching profile:", err));
}, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "contact_no") {
      const digitsOnly = value.replace(/\D/g, "");
      setFormData({ ...formData, [name]: digitsOnly });

      // Live validation
      if (digitsOnly.length === 10) {
        setErrors({
          ...errors,
          contact_no: validateContact(digitsOnly) || "",
        });
      } else {
        setErrors({ ...errors, contact_no: "" });
      }
      return;
    }

    setFormData({ ...formData, [name]: value });

    if (name === "email") {
      setErrors({ ...errors, email: validateEmail(value) || "" });
    }
  };

  // ✅ Correct submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpdateProfile(formData, () => {
      console.log("Profile updated successfully ✅");
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6">
          <ComponentCard title="Edit Personal Information">
            <div className="space-y-6">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter name"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="contact_no">Contact Number</Label>
                <Input
                  type="text"
                  id="contact_no"
                  name="contact_no"
                  value={formData.contact_no}
                  onChange={handleChange}
                  maxLength={10}
                  placeholder="Enter Contact Number"
                />
                {errors.contact_no && (
                  <p className="text-red-500 text-sm">{errors.contact_no}</p>
                )}
              </div>

              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <FaRegEye className="fill-gray-500 dark:fill-gray-400 size-5" />
                  ) : (
                    <FaEyeSlash className="fill-gray-500 dark:fill-gray-400 size-5" />
                  )}
                </button>
              </div>
            </div>
          </ComponentCard>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex gap-4">
        <Button type="submit" className="Submitbtn">
          Update
        </Button>
        <Button type="button" className="canclebtn">
          Cancel
        </Button>
      </div>
    </form>
  );
}
