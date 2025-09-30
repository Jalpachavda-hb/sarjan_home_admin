import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { FaRegEye, FaEyeSlash } from "react-icons/fa";
import SiteSelector from "../../components/form/input/SelectSiteinput";
import MultiSelect from "../../components/form/MultiSelect";
import { toast } from "react-toastify";
import {
  fetchRolePermissions,
  getAdminUserById,
} from "../../utils/Handlerfunctions/getdata";
import { addAdminUser } from "../../utils/Handlerfunctions/formSubmitHandlers";
import { updateAdminUser } from "../../utils/Handlerfunctions/formEditHandlers";
import Stepper from "../OtherPage/Stepper";

const Addadminuser = ({ mode }: { mode: "add" | "edit" }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<{
    [feature: string]: string[];
  }>({});
  const [step, setStep] = useState(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [selectedSite, setSelectedSite] = useState<string>("");
  const [mappedSite, setMappedSite] = useState<any | null>(null);
  const [remainingSites, setRemainingSites] = useState<
    { id: number; title: string }[]
  >([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = mode === "edit";

  // Load role permissions for Add
  useEffect(() => {
    const loadPermissions = async () => {
      const data = await fetchRolePermissions();
      if (data) {
        const initial: { [feature: string]: string[] } = {};
        data.forEach((item: any) => {
          initial[item.feature] = [];
        });
        setSelectedPermissions(initial);
      }
    };
    loadPermissions();
  }, []);

  // Load admin data for Edit
  useEffect(() => {
    if (isEdit && id) {
      getAdminUserById(id).then((data) => {
        const { admin_user, mapped_sites, remaining_sites, permissions } =
          data.data;
        setName(admin_user.name);
        setEmail(admin_user.email);
        setContact(admin_user.contact_no?.toString() || ""); // 👈 fix here
        setSelectedSite(mapped_sites?.site_detail_id || "");
        setMappedSite(mapped_sites || null);
        setRemainingSites(remaining_sites || []);
        setSelectedPermissions(permissions || {});
      });
    }
  }, [isEdit, id]);

  // Validation for Step 1
  const validateStepOne = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Invalid email format";
      }
    }
    if (!contact.trim()) newErrors.contact = "Contact number is required";
    else if (!/^\d{10}$/.test(contact))
      newErrors.contact = "Contact number must be 10 digits";
    if (!selectedSite) newErrors.site = "Site selection is required";
    if (!isEdit && !password.trim())
      newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateStepOne()) {
      toast.error("Please fix errors before submitting!");
      return;
    }

    const fixedRoleId = 2; // always role_id = 2
    let res;
    if (isEdit && id) {
      const passwordToSend = password.trim() !== "" ? password : "";
      res = await updateAdminUser(
        id,
        name,
        email,
        contact,
        Number(selectedSite),
        fixedRoleId,
        passwordToSend,
        selectedPermissions,
        []
      );
    } else {
      res = await addAdminUser(
        name,
        email,
        contact,
        password,
        Number(selectedSite),
        fixedRoleId,
        selectedPermissions,
        []
      );
    }
    if (res) navigate("/admin/admin_users");
  };

  const handlePermissionChange = (feature: string, values: string[]) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [feature]: values,
    }));
  };

  return (
    <div>
      <Stepper step={step} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        {/* STEP 1: User Info */}
        {step === 1 && (
          <ComponentCard title="User Information">
            <div className="space-y-6">
              {/* Name */}
              <div>
                <Label>
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  placeholder="Enter name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label>
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  placeholder="info@gmail.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Contact */}
              <div>
                <Label>
                  Contact Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={contact}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d*$/.test(val) && val.length <= 10) setContact(val);
                    setErrors((prev) => ({ ...prev, contact: "" }));
                  }}
                  placeholder="Enter 10-digit contact number"
                  className={errors.contact ? "border-red-500" : ""}
                />
                {errors.contact && (
                  <p className="text-sm text-red-500">{errors.contact}</p>
                )}
              </div>

              <div>
                {isEdit ? (
                 
                  <SiteSelector
                    value={selectedSite}
                    onChange={(e) => {
                      setSelectedSite(e.target.value);
                      setErrors((prev) => ({ ...prev, site: "" }));
                    }}
                    className={`h-11 w-full rounded-lg border px-4 py-2.5 text-sm ${
                      errors.site ? "border-red-500" : ""
                    }`}
                  >
                    <option value="">Select Site</option>
                    {mappedSite && (
                      <option value={mappedSite.site_detail_id}>
                        {mappedSite.title}
                      </option>
                    )}
                    {remainingSites.map((site) => (
                      <option key={site.id} value={site.id}>
                        {site.title}
                      </option>
                    ))}
                  </SiteSelector>
                ) : (
                  <SiteSelector
                    value={selectedSite}
                    onChange={(val) => {
                      setSelectedSite(val);
                      setErrors((prev) => ({ ...prev, site: "" }));
                    }}
                  />
                )}
                {errors.site && (
                  <p className="text-sm text-red-500">{errors.site}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <Label>
                  Password {!isEdit && <span className="text-red-500">*</span>}
                </Label>
                <div className="relative">
                  <Input
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (!isEdit) {
                        setErrors((prev) => ({ ...prev, password: "" }));
                      }
                    }}
                    type={showPassword ? "text" : "password"}
                    placeholder={
                      isEdit
                        ? "Update password (leave empty to keep old)"
                        : "Enter your password"
                    }
                    className={errors.password ? "border-red-500" : ""}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <FaRegEye /> : <FaEyeSlash />}
                  </button>
                </div>
                {errors.password && !isEdit && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>
            </div>
          </ComponentCard>
        )}

        {/* STEP 2: Permissions */}
        {step === 2 && (
          <ComponentCard title="User Permissions">
            <div className="space-y-6">
              {Object.entries(selectedPermissions).map(([feature, perms]) => {
                let availableOptions = ["view", "create", "edit", "delete"];
                if (feature === "User_log") availableOptions = ["view"];
                if (feature === "App_settings")
                  availableOptions = ["view", "add", "delete"];

                return (
                  <div key={feature} className="space-y-2">
                    <Label>
                      {String(feature).replace(/_/g, " ").toUpperCase()}
                    </Label>
                    <MultiSelect
                      options={availableOptions.map((perm) => ({
                        value: perm,
                        text: perm.charAt(0).toUpperCase() + perm.slice(1),
                      }))}
                      defaultSelected={Array.isArray(perms) ? perms : []}
                      onChange={(values) =>
                        handlePermissionChange(feature, values)
                      }
                    />
                  </div>
                );
              })}
            </div>
          </ComponentCard>
        )}
      </div>

      {/* Footer Buttons */}
      <div className="mt-6 flex justify-between">
        {step > 1 && (
          <Button className="canclebtn" onClick={() => setStep(step - 1)}>
            Previous
          </Button>
        )}
        {step < 2 ? (
          <Button
            onClick={() => {
              if (validateStepOne()) setStep(step + 1);
            }}
            className="mt-3 bg-green-600 hover:bg-green-700 ml-auto"
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            className="mt-3 bg-green-600 hover:bg-green-700"
          >
            Submit
          </Button>
        )}
      </div>
    </div>
  );
};

export default Addadminuser;
