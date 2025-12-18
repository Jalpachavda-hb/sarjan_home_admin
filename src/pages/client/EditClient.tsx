import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import FileInput from "../../components/form/input/FileInput";
import TextArea from "../../components/form/input/TextArea";
import Button from "../../components/ui/button/Button";
import { CiMail } from "react-icons/ci";
import { FaRegEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { IMGURL } from "../../utils/apiPaths";
import {
  deleteClientPanCard,
  deleteClientAadharCard,
} from "../../utils/Handlerfunctions/formdeleteHandlers";
import Swal from "sweetalert2";
import {
  fetchClientDetails,
  getAdminId,
} from "../../utils/Handlerfunctions/getdata";
import { editClient } from "../../utils/Handlerfunctions/formEditHandlers";

const EditClient: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const adminId = getAdminId();
  const client_milestone_id =
    (location.state as any)?.client_milestone_id || params.id;

  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [aadharCard, setAadharCard] = useState<File | null>(null);
  const [panCard, setPanCard] = useState<File | null>(null);
  const [removeAadhar, setRemoveAadhar] = useState(false);
  const [removePan, setRemovePan] = useState(false);
  const [originalData, setOriginalData] = useState<any>({});
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    contact?: string;
    property_amount?: string;
  }>({});

  const [clientData, setClientData] = useState<any>({
    site_detail_id: "",
    site_name: "",
    name: "",
    email: "",
    contact: "",
    address: "",
    unit_type: "",
    block_id: "",
    block_detail_id: [],
    block_number: "",
    property_amount: "",
    gst_slab: "",
    gst_amount: "",
    total_amount: "",
    client_type: "1",
    existing_client_id: "",
    clientid: "",
    aadhar_card: "",
    pan_card: "",
  });

  useEffect(() => {
    if (!client_milestone_id || !adminId) return;

    const loadClientData = async () => {
      try {
        const data = await fetchClientDetails(adminId, client_milestone_id);
        const clientDataObj = {
          site_detail_id: data.site_detail_id || "",
          site_name: data.site_name || "",
          name: data.name || "",
          email: data.email || "",
          contact: data.contact || "",
          address: data.address || "",
          unit_type: data.unit_type || "",
          block_id: data.block_id || "",
          block_detail_id: data.block_detail_id
            ? [String(data.block_detail_id)]
            : [],
          block_number: data.block_number || "",
          property_amount: data.property_amount || "",
          gst_slab: data.gst_slab || "",
          gst_amount: data.gst_amount || "",
          total_amount: data.total_amount || "",
          client_type: data.client_type || "1",
          existing_client_id: data.existing_client_id || "",
          clientid: data.clientid || "",
          aadhar_card: data.aadhar_card || "",
          pan_card: data.pan_card || "",
        };

        setClientData(clientDataObj);
        setOriginalData(clientDataObj);
        if (data.password) setPassword(data.password);
      } catch (e: any) {
        console.error(e);
        toast.error(e.message || "Failed to fetch client details");
      }
    };

    loadClientData();
  }, [adminId, client_milestone_id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let finalValue = value;

    if (name === "contact") {
      finalValue = value.replace(/\D/g, "").slice(0, 10);
    }

    if (name === "property_amount") {
      const principal = parseFloat(finalValue) || 0;
      const gstSlab = parseFloat(clientData.gst_slab) || 0;
      const gstAmount = principal * (gstSlab / 100);
      const total = principal + gstAmount;
      setClientData((prev: any) => ({
        ...prev,
        [name]: finalValue,
        gst_amount: gstAmount.toFixed(2),
        total_amount: total.toFixed(2),
      }));
    } else {
      setClientData((prev: any) => ({ ...prev, [name]: finalValue }));
    }

    setErrors((prev) => {
      const newErrors = { ...prev };
      if (name === "name") {
        !finalValue
          ? (newErrors.name = "Name is required")
          : delete newErrors.name;
      }
      if (name === "email") {
        !finalValue
          ? (newErrors.email = "Email is required")
          : delete newErrors.email;
      }
      if (name === "contact") {
        if (!finalValue) newErrors.contact = "Contact is required";
        else if (finalValue.length !== 10)
          newErrors.contact = "Contact must be exactly 10 digits";
        else delete newErrors.contact;
      }
      if (name === "property_amount") {
        !finalValue
          ? (newErrors.property_amount = "Property Amount is required")
          : delete newErrors.property_amount;
      }
      return newErrors;
    });
  };
  const handleDeleteAadhar = async () => {
    const confirm = await Swal.fire({
      title: "Delete Aadhar?",
      text: "Are you sure you want to delete this Aadhar card?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
    });
    if (confirm.isConfirmed) {
      const success = await deleteClientAadharCard(clientData.clientid);
      if (success) setClientData((prev: any) => ({ ...prev, aadhar_card: "" }));
    }
  };

  // ✅ Confirm & Delete PAN
  const handleDeletePan = async () => {
    const confirm = await Swal.fire({
      title: "Delete PAN?",
      text: "Are you sure you want to delete this PAN card?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
    });
    if (confirm.isConfirmed) {
      const success = await deleteClientPanCard(clientData.clientid);
      if (success) setClientData((prev: any) => ({ ...prev, pan_card: "" }));
    }
  };
  const handleSubmit = async () => {
    const newErrors: typeof errors = {};

    if (!clientData.name?.trim()) newErrors.name = "Name is required";
    if (!clientData.contact) newErrors.contact = "Contact is required";
    else if (!/^\d{10}$/.test(clientData.contact))
      newErrors.contact = "Contact must be exactly 10 digits";
    if (!clientData.property_amount)
      newErrors.property_amount = "Property Amount is required";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const submitData = {
        ...clientData,
        password,
        admin_id: adminId,
        client_milestone_id,
        remove_aadhar: removeAadhar,
        remove_pan: removePan,
      };

      const res = await editClient(
        submitData,
        originalData,
        aadharCard
        // panCard
      );

      if (res.status === 200) {
        toast.success(res.message || "Client updated successfully!");
        navigate(-1);
      } else {
        toast.error(res.message || "Failed to update client");
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e.response?.data?.message || "Failed to update client");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6">
          <ComponentCard title="Edit Client">
            <div className="space-y-6">
              {/* Name */}
              <div>
                <Label>
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  name="name"
                  value={clientData.name}
                  onChange={handleChange}
                  placeholder="Enter client name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label>Email </Label>
                <div className="relative">
                  <Input
                    name="email"
                    value={clientData.email}
                    onChange={handleChange}
                    placeholder="info@gmail.com"
                    type="email"
                    className="pl-[62px]"
                  />
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500">
                    <CiMail className="size-6" />
                  </span>
                </div>
              </div>

              {/* Contact */}
              <div>
                <Label>
                  Contact Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  name="contact"
                  value={clientData.contact}
                  onChange={handleChange}
                  placeholder="9876543210"
                />
                {errors.contact && (
                  <p className="text-red-500 text-sm mt-1">{errors.contact}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <Label>Address</Label>
                <TextArea
                  value={clientData.address}
                  onChange={(val) =>
                    setClientData((prev: any) => ({ ...prev, address: val }))
                  }
                  rows={4}
                />
              </div>

              {/* Aadhar Card */}
              <div>
                <Label>Aadhar Card</Label>
                <div className="flex items-center gap-2">
                  <FileInput
                    id="aadharCardUpload"
                    onChange={(e) => {
                      setAadharCard(e.target.files?.[0] || null);
                      setRemoveAadhar(false);
                    }}
                  />
                  {clientData.aadhar_card && !aadharCard && !removeAadhar && (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          window.open(
                            IMGURL +
                              "/uploads/idproof/adharcard/" +
                              clientData.aadhar_card,
                            "_blank",
                            "noopener,noreferrer"
                          );
                        }}
                      >
                        View
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          handleDeleteAadhar();
                        }}
                      >
                        Remove
                      </Button>
                    </>
                  )}
                  {removeAadhar && (
                    <p className="text-sm text-red-600 mt-1">
                      Aadhar will be removed
                    </p>
                  )}
                </div>
              </div>

              {/* PAN Card */}
              <div>
                <Label>PAN Card</Label>
                <div className="flex items-center gap-2">
                  <FileInput
                    id="panCardUpload"
                    onChange={(e) => {
                      setPanCard(e.target.files?.[0] || null);
                      setRemovePan(false);
                    }}
                  />
                  {clientData.pan_card && !panCard && !removePan && (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          window.open(
                            IMGURL +
                              "/uploads/idproof/pancard/" +
                              clientData.pan_card,
                            "_blank",
                            "noopener,noreferrer"
                          );
                        }}
                      >
                        View
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          handleDeletePan();
                        }}
                      >
                        Remove
                      </Button>
                    </>
                  )}
                  {removePan && (
                    <p className="text-sm text-red-600 mt-1">
                      PAN will be removed
                    </p>
                  )}
                </div>
              </div>

              {/* Disabled fields */}
              <div>
                <Label>Selected Site</Label>
                <Input
                  name="site_name"
                  value={clientData.site_name}
                  disabled
                  className="disabledInput"
                />
              </div>
              <div>
                <Label>Unit Type </Label>
                <Input
                  name="unit_type"
                  value={clientData.unit_type}
                  disabled
                  className="disabledInput"
                />
              </div>
              <div>
                <Label>Block Number</Label>
                <Input
                  name="block_number"
                  value={clientData.block_number}
                  disabled
                  className="disabledInput"
                />
              </div>

              {/* Property & GST */}
              <div>
                <Label>
                  Property Amount <span className="text-red-500">*</span>{" "}
                </Label>
                <Input
                  name="property_amount"
                  value={clientData.property_amount}
                  onChange={(e) => {
                    const { value } = e.target;

                    // ✅ Allow only digits (no letters, no decimals)
                    const cleanedValue = value.replace(/[^0-9]/g, "");

                    setClientData((prev: any) => ({
                      ...prev,
                      property_amount: cleanedValue,
                    }));

                    // ✅ Live validation
                    if (cleanedValue === "") {
                      setErrors((prev) => ({
                        ...prev,
                        property_amount: "Property amount is required",
                      }));
                    } else if (Number(cleanedValue) <= 0) {
                      setErrors((prev) => ({
                        ...prev,
                        property_amount: "Amount must be positive",
                      }));
                    } else {
                      setErrors((prev) => ({
                        ...prev,
                        property_amount: undefined,
                      }));
                    }
                  }}
                  placeholder="50000"
                  type="text"
                />
                {errors.property_amount && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.property_amount}
                  </p>
                )}
              </div>
              <div>
                <Label>GST Slab</Label>
                <Input
                  name="gst_slab"
                  value={clientData.gst_slab ? `${clientData.gst_slab}%` : ""}
                  disabled
                  className="disabledInput"
                />
              </div>
              <div>
                <Label>GST Amount</Label>
                <Input
                  name="gst_amount"
                  value={clientData.gst_amount}
                  disabled
                  className="disabledInput"
                />
              </div>
              <div>
                <Label>Total Amount</Label>
                <Input
                  name="total_amount"
                  value={clientData.total_amount}
                  disabled
                  className="disabledInput"
                />
              </div>

              {/* Password */}
              <div>
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <FaRegEye /> : <FaEyeSlash />}
                  </button>
                </div>
              </div>
            </div>
          </ComponentCard>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-4">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Updating..." : "Update Client"}
        </Button>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default EditClient;
