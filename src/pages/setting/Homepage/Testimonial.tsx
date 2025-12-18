import { useState, useEffect } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import TextArea from "../../../components/form/input/TextArea";
import FileInput from "../../../components/form/input/FileInput";

import { gettesTimonial } from "../../../utils/Handlerfunctions/getdata";
import { ADDTESTIMONIAL } from "../../../utils/Handlerfunctions/formSubmitHandlers";
import { deleteTestimonial } from "../../../utils/Handlerfunctions/formdeleteHandlers";

export interface TestimonialField {
  id?: number;
  name: string;
  role: string;
  description: string;
  photo: File | string | null;
}

const Testimonial = () => {
  const [fields, setFields] = useState<TestimonialField[]>([]);
  const [errors, setErrors] = useState<any[]>([]);

  // ------------------------------
  // LOAD TESTIMONIALS
  // ------------------------------
  const loadTestimonials = async () => {
    const data = await gettesTimonial();

    if (!data) return;

    const formatted = data.map((item: any) => ({
      id: item.id,
      name: item.name,
      role: item.role,
      description: item.description,
      photo: item.photo,
    }));

    setFields(formatted);
    setErrors(
      formatted.map(() => ({
        name: "",
        role: "",
        description: "",
        photo: "",
      }))
    );
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  // ------------------------------
  // VALIDATION
  // ------------------------------
  const validate = (field: TestimonialField) => {
    const err: any = {};

    if (!field.name.trim()) err.name = "Name is required";
    if (!field.role.trim()) err.role = "Role is required";
    if (!field.description.trim()) err.description = "Description required";
    if (!field.photo) err.photo = "Photo required";

    return err;
  };

  // ------------------------------
  // HANDLE INPUT
  // ------------------------------
  const handleChange = <K extends keyof TestimonialField>(
    index: number,
    key: K,
    value: TestimonialField[K]
  ) => {
    const updated = [...fields];
    updated[index][key] = value;
    setFields(updated);

    const updatedErrors = [...errors];
    updatedErrors[index][key] = "";
    setErrors(updatedErrors);
  };

  // ------------------------------
  // ADD NEW EMPTY TESTIMONIAL
  // ------------------------------
  const handleAddField = () => {
    setFields([
      ...fields,
      {
        name: "",
        role: "",
        description: "",
        photo: null,
      },
    ]);

    setErrors([...errors, { name: "", role: "", description: "", photo: "" }]);
  };

  // ------------------------------
  // DELETE TESTIMONIAL
  // ------------------------------
 const handleDeleteField = async (index: number) => {
  const current = fields[index];

  // -------------------------------------------------------
  // 1. Prevent deleting the last remaining existing item
  // -------------------------------------------------------
  if (fields.length === 1 && current.id) {
    toast.error("At least one testimonial must remain.");
    return;
  }

  // -------------------------------------------------------
  // 2. Case: NEW testimonial (no id) → delete locally only
  // -------------------------------------------------------
  if (!current.id) {
    const updatedFields = fields.filter((_, i) => i !== index);
    const updatedErrors = errors.filter((_, i) => i !== index);

    setFields(updatedFields);
    setErrors(updatedErrors);
    return; // STOP — no confirmation, no API call, no reload
  }

  // -------------------------------------------------------
  // 3. Case: Existing testimonial → show confirmation + API
  // -------------------------------------------------------
  const confirm = await Swal.fire({
    title: "Are you sure?",
    text: "This testimonial will be deleted!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it",
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
  });

  if (!confirm.isConfirmed) return;

  const res = await deleteTestimonial(String(current.id));

  if (!res.success) {
    toast.error("Failed to delete testimonial");
    return;
  }

  toast.success("Testimonial deleted!");

  // -------------------------------------------------------
  // 4. Reload actual database testimonials
  // -------------------------------------------------------
  await loadTestimonials();
};

  // ------------------------------
  // SAVE ALL
  // ------------------------------
  const handleSubmit = async () => {
    const validationErrors = fields.map((f) => validate(f));
    setErrors(validationErrors);

    const hasError = validationErrors.some((e) => Object.keys(e).length > 0);
    if (hasError) {
      toast.error("Please fix all validation errors.");
      return;
    }

    try {
      for (const field of fields) {
        const formData = new FormData();

        formData.append("name", field.name);
        formData.append("role", field.role);
        formData.append("description", field.description);

        // Handle photo
        if (field.photo instanceof File) {
          formData.append("photo", field.photo);
        } else if (typeof field.photo === "string") {
          formData.append("existing_photo", field.photo);
        }

        // ⭐ IMPORTANT LOGIC:
        // If ID exists → EDIT
        // If no ID → ADD
        if (field.id) {
          formData.append("Testimonialer_id", String(field.id));
        }

        await ADDTESTIMONIAL(formData);
      }

      toast.success("Testimonials saved successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Error saving testimonials");
    } finally {
      // ⭐ SUPER IMPORTANT:
      // After saving (add/update), reload list to refresh IDs
      await loadTestimonials();
    }
  };

  return (
    <div className="font-[Poppins] text-gray-700">
      <Label className="text-lg font-semibold">Manage Testimonials</Label>

      {fields.map((field, index) => (
        <div key={index} className="border p-4 mt-4 bg-white rounded shadow">
          {/* Header */}
          <div className="flex justify-between border-b pb-2 mb-3">
            <h3 className="text-blue-700 font-semibold">
              {field.id ? "Edit - " : ""} Testimonial {index + 1}
            </h3>

            <button
              className="text-red-500 flex items-center gap-1"
              onClick={() => handleDeleteField(index)}
            >
              <FiTrash2 /> Delete
            </button>
          </div>

          {/* Image */}
          <Label>Photo *</Label>
          <FileInput
            accept="image/*"
            onChange={(e: any) =>
              handleChange(index, "photo", e.target.files?.[0] || null)
            }
          />

          {typeof field.photo === "string" && (
            <img
              src={field.photo}
              className="w-24 h-24 object-cover mt-2 rounded"
            />
          )}

          {errors[index]?.photo && (
            <p className="text-red-500 text-sm">{errors[index].photo}</p>
          )}

          {/* Name */}
          <Label className="mt-2">Name *</Label>
          <Input
            value={field.name}
            onChange={(e) => handleChange(index, "name", e.target.value)}
            className={errors[index]?.name ? "border-red-500" : ""}
          />

          {/* Role */}
          <Label className="mt-2">Role *</Label>
          <Input
            value={field.role}
            onChange={(e) => handleChange(index, "role", e.target.value)}
            className={errors[index]?.role ? "border-red-500" : ""}
          />

          {/* Description */}
          <Label className="mt-2">Description *</Label>
          <TextArea
            value={field.description}
            onChange={(v) => handleChange(index, "description", v)}
            className={errors[index]?.description ? "border-red-500" : ""}
          />
        </div>
      ))}

      {/* Add Button */}
      <div className="mt-4">
        <button
          onClick={handleAddField}
          className="flex items-center gap-1 px-3 py-2 border rounded text-blue-600 hover:bg-blue-50"
        >
          <FiPlus /> Add New Testimonial
        </button>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSubmit}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Save Testimonials
      </button>
    </div>
  );
};

export default Testimonial;
