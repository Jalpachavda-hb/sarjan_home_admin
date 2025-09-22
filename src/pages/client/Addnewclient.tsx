import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import FileInput from "../../components/form/input/FileInput";
import { toast } from "react-toastify";
import Button from "../../components/ui/button/Button";
import Select from "../../components/form/Select";
import TextArea from "../../components/form/input/TextArea";
import { CiMail } from "react-icons/ci";
import MultiSelect from "../../components/form/MultiSelect";

import {
  fetchUnitType,
  getClientName,
  getBlockFromSiteId,
  getBlockFromBlockid,
} from "../../utils/Handlerfunctions/getdata";
import { addNewClient } from "../../utils/Handlerfunctions/formSubmitHandlers";

type Option = { label: string; value: string | number };

const Addnewclient: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  // resolve siteId from URL
  const resolveSiteId = (): string | null => {
    if (params.siteId) return params.siteId;
    if (params.id) return params.id;
    if ((params as any).site_id) return (params as any).site_id;
    const qp = new URLSearchParams(location.search).get("site_id");
    if (qp) return qp;
    const parts = location.pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1];
    if (last === "addnewclient" && parts.length >= 2) {
      return parts[parts.length - 2];
    }
    return null;
  };

  const initialSiteId = resolveSiteId();

  const [loading, setLoading] = useState(false);
  const [unitTypes, setUnitTypes] = useState<Option[]>([]);
  const [clients, setClients] = useState<Option[]>([]);
  const [blocks, setBlocks] = useState<Option[]>([]);
  const [blockDetails, setBlockDetails] = useState<
    { label: string; value: number }[]
  >([]);
  const [siteId, setSiteId] = useState<string | null>(initialSiteId);

  const [clientData, setClientData] = useState<any>({
    site_detail_id: initialSiteId ?? "",
    name: "",
    email: "",
    contact: "",
    address: "",
    unit_type: "",
    block_id: "",
    block_detail_id: [],
    property_amount: "",
    gst_slab: "",
    gst_amount: "",
    total_amount: "",
    client_type: "1",
    existing_client_id: "",
  });

  const [aadharCard, setAadharCard] = useState<File | null>(null);
  const [panCard, setPanCard] = useState<File | null>(null);

  const [address, setAddress] = useState<File | null>(null);
  // safe select handler
  const handleSelectChange = (field: string) => (val: any) => {
    const finalVal =
      val && typeof val === "object" && "value" in val ? val.value : val;
    setClientData((prev: any) => ({ ...prev, [field]: finalVal }));
  };

  // fetch unit types + clients
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [u, c] = await Promise.all([fetchUnitType(), getClientName()]);
        if (!mounted) return;
        setUnitTypes(u);
        setClients(c);
      } catch (e) {
        console.error("error loading initial dropdowns:", e);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // fetch blocks from siteId
  useEffect(() => {
    if (!siteId) return;
    setClientData((prev: any) => ({ ...prev, site_detail_id: siteId }));

    let mounted = true;
    const fetchBlocks = async () => {
      try {
        const data = await getBlockFromSiteId(siteId);
        if (!mounted) return;
        setBlocks(data);
      } catch (err) {
        console.error("Error fetching blocks:", err);
        setBlocks([]);
      }
    };
    fetchBlocks();
    return () => {
      mounted = false;
    };
  }, [siteId]);

  // fetch block numbers when block_id changes
  useEffect(() => {
    if (!clientData.block_id) return;

    const fetchBlockDetails = async () => {
      try {
        console.log("Fetching block details for ID:", clientData.block_id);
        const data = await getBlockFromBlockid(clientData.block_id);
        console.log("Received block details:", data);
        setBlockDetails(data);
      } catch (err) {
        console.error("Error fetching block details:", err);
        setBlockDetails([]);
      }
    };

    fetchBlockDetails();
  }, [clientData.block_id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setClientData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!clientData.name && clientData.client_type === "1") {
      toast.error("Name is required for new client");
      return;
    }
    if (
      clientData.client_type === "1" &&
      (!clientData.email || !clientData.contact)
    ) {
      toast.error("Email and Contact are required for new client");
      return;
    }

    setLoading(true);
    try {
      const res = await addNewClient(clientData, aadharCard, panCard);

      if (res) {
        toast.success("Client added successfully!");
        navigate(-1); // or redirect to the client's page
      }
    } catch (e) {
      console.error("submit error:", e);
      toast.error("Failed to create client");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageMeta title="Add Client" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6">
          <ComponentCard title="Add Client">
            <div className="space-y-6">
              {/* Client Type */}
              <div>
                <Label>Client Type</Label>
                <Select
                  options={[
                    { value: "1", label: "New Client" },
                    { value: "2", label: "Existing Client" },
                  ]}
                  value={clientData.client_type}
                  onChange={(val: any) =>
                    setClientData((prev: any) => ({
                      ...prev,
                      client_type: typeof val === "object" ? val.value : val,
                    }))
                  }
                  placeholder="Select Client Type"
                />
              </div>

              {/* New Client Fields */}
              {clientData.client_type === "1" && (
                <>
                  <div>
                    <Label>Name</Label>
                    <Input
                      name="name"
                      value={clientData.name}
                      onChange={handleChange}
                      placeholder="Enter client name"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <div className="relative">
                      <Input
                        name="email"
                        value={clientData.email}
                        onChange={handleChange}
                        placeholder="info@gmail.com"
                        type="text"
                        className="pl-[62px]"
                      />
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                        <CiMail className="size-6" />
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label>Contact Number</Label>
                    <Input
                      name="contact"
                      value={clientData.contact}
                      onChange={handleChange}
                      placeholder="9876543210"
                    />
                  </div>
                  <div>
                    <Label>Upload Aadhar Card</Label>
                    <FileInput
                      id="adharCardUpload"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const file = e.target.files?.[0] || null;
                        setAadharCard(file);
                      }}
                    />
                  </div>

                  <div>
                    <Label>Upload PAN Card</Label>
                    <FileInput
                      id="panCardUpload"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const file = e.target.files?.[0] || null;
                        setPanCard(file);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Address</Label>
                    <TextArea
                      value={clientData.address}
                      onChange={(val) =>
                        setClientData((prev) => ({ ...prev, address: val }))
                      }
                      rows={4}
                    />
                  </div>
                </>
              )}

              {/* Existing Client Dropdown */}
              {clientData.client_type === "2" && (
                <div>
                  <Label>Select Client Name</Label>
                  <Select
                    options={clients}
                    value={clientData.existing_client_id}
                    onChange={handleSelectChange("existing_client_id")}
                    placeholder="Select Existing Client"
                  />
                </div>
              )}
              <div>
                <Label>Unit Type</Label>
                <Select
                  options={unitTypes}
                  value={clientData.unit_type}
                  onChange={handleSelectChange("unit_type")} // <--- important
                  placeholder="Select Unit Type"
                />
              </div>
              {/* Block */}
              {clientData.unit_type && (
                <div>
                  <Label>Block/Shop</Label>
                  <Select
                    options={blocks}
                    value={clientData.block_id}
                    onChange={handleSelectChange("block_id")}
                    placeholder="Select Block"
                  />
                </div>
              )}

              {/* Block Numbers */}
              {blockDetails && (
                <div>
                  <Label>Block Numbers</Label>

                  <MultiSelect
                    options={blockDetails.map((o) => ({
                      value: String(o.value),
                      text: o.label,
                    }))} // convert to correct shape
                    onChange={(selected: string[]) => {
                      setClientData((prev: any) => ({
                        ...prev,
                        block_detail_id: selected, // already string[]
                      }));
                    }}
                  />
                </div>
              )}

              {/* Property Amount */}

              <div>
                <Label>Property Amount</Label>
                <Input
                  name="property_amount"
                  value={clientData.property_amount}
                  onChange={handleChange}
                  placeholder="50000"
                  type="number"
                />
              </div>

              {/* GST */}

              {clientData.property_amount && (
                <div>
                  <Label>GST Slab</Label>
                  <Select
                    options={[
                      { value: "1", label: "1%" },
                      { value: "5", label: "5%" },
                    ]}
                    value={clientData.gst_slab}
                    onChange={(val: any) => {
                      const slab = typeof val === "object" ? val.value : val;
                      const principal = parseFloat(
                        clientData.property_amount || "0"
                      );
                      const gstAmount = principal * (parseFloat(slab) / 100);
                      const total = principal + gstAmount;

                      setClientData((prev: any) => ({
                        ...prev,
                        gst_slab: slab,
                        gst_amount: gstAmount.toFixed(2),
                        total_amount: total.toFixed(2),
                      }));
                    }}
                    placeholder="Select GST Slab"
                  />
                </div>
              )}

              {clientData.gst_slab && (
                <>
                  <div>
                    <Label>GST Amount</Label>
                    <Input
                      name="gst_amount"
                      disabled
                      className="disabledInput"
                      value={clientData.gst_amount}
                    />
                  </div>
                  <div>
                    <Label>Total Amount</Label>
                    <Input
                      name="total_amount"
                      disabled
                      className="disabledInput"
                      value={clientData.total_amount}
                    />
                  </div>
                </>
              )}
            </div>
          </ComponentCard>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex gap-4">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </Button>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default Addnewclient;
