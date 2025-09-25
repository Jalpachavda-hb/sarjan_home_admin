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
} from "../../utils/Handlerfunctions/getdata"; // removed fetchProfile import
import { addAdminUser } from "../../utils/Handlerfunctions/formSubmitHandlers";
import { updateAdminUser } from "../../utils/Handlerfunctions/formEditHandlers";
import Stepper from "../OtherPage/Stepper";

const Addadminuser = ({ mode }: { mode: "add" | "edit" }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<{
    [feature: string]: string[];
  }>({
    clients: [],
    user_log: [],
    properties: [],
    admin_users: [],
    documents: [],
    reports: [],
    payments: [],
    app_settings: [],
  });

  const [step, setStep] = useState(1);

  // form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [selectedSite, setSelectedSite] = useState<string>("");
  const [mappedSite, setMappedSite] = useState<any | null>(null);
  const [remainingSites, setRemainingSites] = useState<
    { id: number; title: string }[]
  >([]);

  const navigate = useNavigate();
  const { id } = useParams(); // <-- route param
  const isEdit = mode === "edit";

  useEffect(() => {
    const loadPermissions = async () => {
      const data = await fetchRolePermissions();
      if (data && !isEdit) {
        const initial: { [feature: string]: string[] } = {};
        data.forEach((item: any) => {
          initial[item.feature] = [];
        });
        setSelectedPermissions(initial);
      }
    };
    loadPermissions();
  }, [isEdit]);

  useEffect(() => {
    if (isEdit && id) {
      getAdminUserById(id).then((data) => {
        const { admin_user, mapped_sites, remaining_sites, permissions } =
          data.data;
        setName(admin_user.name);
        setEmail(admin_user.email);
        setContact(admin_user.contact_no);
        setSelectedSite(mapped_sites?.site_detail_id || "");
        setMappedSite(mapped_sites || null);
        setRemainingSites(remaining_sites || []);
        setSelectedPermissions(permissions || {});
      });
    }
  }, [isEdit, id]);

  //   const handleSubmit = async () => {
  //     let res;
  //     const fixedRoleId = 2; // ✅ always role_id = 2
  //  const passwordToSend = password.trim() !== "" ? password : undefined;
  //     if (isEdit && id) {
  //       res = await updateAdminUser(
  //         id,
  //         name,
  //         email,
  //         contact,
  //         Number(selectedSite),
  //         fixedRoleId, // ✅ use fixed role id
  //         selectedPermissions,
  //           passwordToSend ? [passwordToSend] : []
  //         []
  //       );
  //     } else {
  //       res = await addAdminUser(
  //         name,
  //         email,
  //         contact,
  //         password,
  //         Number(selectedSite),
  //         fixedRoleId, // ✅ use fixed role id
  //         selectedPermissions,
  //         []
  //       );
  //       console.log("Selected permissions:", selectedPermissions);
  //     }

  //     if (res) navigate("/admin/admin_users");
  //   };

  const handleSubmit = async () => {
    let res;
    const fixedRoleId = 2; // always role_id = 2

    if (isEdit && id) {
      // ✅ only pass password if user typed a new one
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
        password, // password must be string
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
        {step === 1 && (
          <ComponentCard title="User Information">
            <div className="space-y-6">
              <div>
                <Label>Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="info@gmail.com"
                />
              </div>

              <div>
                <Label>Contact Number</Label>
                <Input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Enter contact number"
                />
              </div>

              {isEdit ? (
                <>
                  <Label>Site</Label>
                  <select
                    value={selectedSite}
                    onChange={(e) => setSelectedSite(e.target.value)}
                    className="h-11 w-full rounded-lg border px-4 py-2.5 text-sm"
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
                  </select>
                </>
              ) : (
                <SiteSelector
                  value={selectedSite}
                  onChange={(val) => setSelectedSite(val)}
                />
              )}

              {isEdit ? (
                <>
                  <Label>Password</Label>
                  <div className="relative">
                    <Input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      placeholder="Update password (leave empty to keep old)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <FaRegEye /> : <FaEyeSlash />}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Label>Password</Label>
                  <div className="relative">
                    <Input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <FaRegEye /> : <FaEyeSlash />}
                    </button>
                  </div>
                </>
              )}
            </div>
          </ComponentCard>
        )}

        {step === 2 && (
          <ComponentCard title="User Permissions">
            <div className="space-y-6">
              {Object.entries(selectedPermissions).map(([feature, perms]) => (
                <div key={feature} className="space-y-2">
                  <Label>
                    {String(feature).replace(/_/g, " ").toUpperCase()}
                  </Label>

                  <MultiSelect
                    options={["view", "create", "edit", "delete"].map(
                      (perm) => ({
                        value: perm,
                        text: perm.charAt(0).toUpperCase() + perm.slice(1),
                      })
                    )}
                    defaultSelected={Array.isArray(perms) ? perms : []}
                    onChange={(values) =>
                      handlePermissionChange(feature, values)
                    }
                  />
                </div>
              ))}
            </div>
          </ComponentCard>
        )}
      </div>

      <div className="mt-6 flex justify-between">
        {step > 1 && (
          <Button className="canclebtn" onClick={() => setStep(step - 1)}>
            Previous
          </Button>
        )}
        {step < 2 ? (
          <Button
            onClick={() => setStep(step + 1)}
            className="mt-3 bg-green-600 hover:bg-green-700 ml-auto"
          >
            Next
          </Button>
        ) : (
          <Button
            className="mt-3 bg-green-600 hover:bg-green-700"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        )}
      </div>
    </div>
  );
};

export default Addadminuser;
