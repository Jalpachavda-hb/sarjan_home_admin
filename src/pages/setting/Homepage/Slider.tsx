import { useState, useEffect } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import DynamicAmenities from "../../../components/form/form-elements/DynamicInputFields ";
import FileInput from "../../../components/form/input/FileInput";

import { fetchSlider } from "../../../utils/Handlerfunctions/getdata";
import { Addslider } from "../../../utils/Handlerfunctions/formSubmitHandlers";
import { deleteslider } from "../../../utils/Handlerfunctions/formdeleteHandlers";

export interface SliderField {
  id?: number;
  header: string;
  title: string;
  image: File | string | null;
  speciality: string[]; // Only names, not objects
}

const Slider = () => {
  const [fields, setFields] = useState<SliderField[]>([]);
  const [errors, setErrors] = useState<any[]>([]);

  // ------------------------------
  // LOAD SLIDERS
  // ------------------------------
  const loadSliders = async () => {
    const data = await fetchSlider();

    if (!data) return;

    const formatted = data.map((item: any) => ({
      id: item.id,
      header: item.header,
      title: item.title,
      image: item.slide_image,
      speciality: item.speciality?.map((s: any) => s.name) || [""],
    }));

    setFields(formatted);
    setErrors(
      formatted.map(() => ({
        header: "",
        title: "",
        image: "",
        speciality: "",
      }))
    );
  };

  useEffect(() => {
    loadSliders();
  }, []);

  // ------------------------------
  // VALIDATION
  // ------------------------------
  const validate = (field: SliderField) => {
    const err: any = {};

    if (!field.header.trim()) err.header = "Header is required";
    if (!field.title.trim()) err.title = "Title is required";
    if (!field.image) err.image = "Image required";

    if (!field.speciality.length || field.speciality.some((s) => !s.trim()))
      err.speciality = "Add atleast 1 speciality";

    return err;
  };

  const handleAddField = () => {
    // Add empty slider
    const newField: SliderField = {
      header: "",
      title: "",
      image: null,
      speciality: [""],
    };

    setFields((prev) => [...prev, newField]);

    // Add empty error object
    setErrors((prev) => [
      ...prev,
      { header: "", title: "", image: "", speciality: "" },
    ]);
  };

  // ------------------------------
  // HANDLE FIELD CHANGE
  // ------------------------------
  const handleChange = <K extends keyof SliderField>(
    index: number,
    key: K,
    value: SliderField[K]
  ) => {
    const updated = [...fields];
    updated[index][key] = value;
    setFields(updated);

    const updatedErrors = [...errors];
    updatedErrors[index][key] = "";
    setErrors(updatedErrors);
  };
  // ------------------------------
  // DELETE SLIDER
  // ------------------------------
  // const handleDeleteSlider = async (index: number) => {
  //   if (fields.length === 1) {
  //     toast.error(
  //       "At least one slider must remain. You cannot delete all sliders."
  //     );
  //     return;
  //   }
  //   const id = fields[index].id;

  //   const confirmation = await Swal.fire({
  //     title: "Are you sure?",
  //     text: "This slider will be deleted.",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#d33",
  //     cancelButtonColor: "#3085d6",
  //     confirmButtonText: "Yes, delete it",
  //   });

  //   if (!confirmation.isConfirmed) return;

  //   if (id) {
  //     const res = await deleteslider(String(id));

  //     if (!res.success) {
  //       toast.error("Failed to delete");
  //       return;
  //     }
  //   }

  //   toast.success("Slider deleted");

  //   await loadSliders();
  // };
  const handleDeleteSlider = async (index: number) => {
    const currentSlide = fields[index];

    // -------------------------------------------------------
    // 1. Prevent deleting the ONLY remaining *existing* slide
    // -------------------------------------------------------
    if (fields.length === 1 && currentSlide.id) {
      toast.error("At least one slider must remain.");
      return;
    }

    // -------------------------------------------------------
    // 2. Case: NEW slide → delete locally (NO API CALL)
    // -------------------------------------------------------
    if (!currentSlide.id) {
      const updated = fields.filter((_, i) => i !== index);
      const updatedErrors = errors.filter((_, i) => i !== index);

      setFields(updated);
      setErrors(updatedErrors);
      return; // STOP HERE
    }

    // -------------------------------------------------------
    // 3. Case: EXISTING slide → show confirmation + API call
    // -------------------------------------------------------
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "This slider will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it",
    });

    if (!confirmation.isConfirmed) return;

    const res = await deleteslider(String(currentSlide.id));

    if (!res.success) {
      toast.error("Failed to delete slider");
      return;
    }

    toast.success("Slider deleted successfully!");

    // -------------------------------------------------------
    // 4. Reload existing list from backend
    // -------------------------------------------------------
    await loadSliders();
  };

  const handleSubmit = async () => {
    const validationErrors = fields.map((f) => validate(f));
    setErrors(validationErrors);

    if (validationErrors.some((e) => Object.keys(e).length)) {
      toast.error("Please fix errors");
      return;
    }

    try {
      for (const field of fields) {
        const formData = new FormData();

        formData.append("header", field.header);
        formData.append("title", field.title);

        // Handle image
        if (field.image instanceof File) {
          formData.append("slide_image", field.image);
        } else if (typeof field.image === "string") {
          formData.append("existing_image", field.image);
        }

        // Speciality list (names only)
        field.speciality.forEach((name) => {
          formData.append("speciality[]", name);
        });

        if (field.id) {
          formData.append("slider_id", String(field.id));
        }

        await Addslider(formData);
      }

      toast.success("Saved successfully!");
      loadSliders();
    } catch (error) {
      toast.error("Error saving");
      console.error(error);
    }
  };

  // ------------------------------
  // RENDER UI
  // ------------------------------
  return (
    <div className="font-[Poppins]">
      <Label className="text-lg font-semibold">Manage Sliders</Label>

      {fields.map((field, index) => (
        <div key={index} className="border p-4 mt-4 bg-white rounded shadow">
          <div className="flex justify-between border-b pb-2 mb-3">
            <h3 className="text-blue-700 font-semibold">
              {field.id ? "Edit - " : ""} {index + 1} Slide
            </h3>

            <button
              className="text-red-500 flex items-center gap-1"
              onClick={() => handleDeleteSlider(index)}
            >
              <FiTrash2 /> Delete
            </button>
          </div>

          <Label>Header*</Label>
          <Input
            value={field.header}
            onChange={(e) => handleChange(index, "header", e.target.value)}
            className={errors[index]?.header ? "border-red-500" : ""}
          />
          {errors[index]?.header && (
            <p className="text-red-500 text-sm">{errors[index].header}</p>
          )}

          {/* Title Input */}
          <Label className="mt-2">Title *</Label>
          <Input
            value={field.title}
            onChange={(e) => handleChange(index, "title", e.target.value)}
            className={errors[index]?.title ? "border-red-500" : ""}
          />
          {errors[index]?.title && (
            <p className="text-red-500 text-sm">{errors[index].title}</p>
          )}

          {/* Image */}
          <Label className="mt-2">Slide Image *</Label>
          <FileInput
            accept="image/*"
            onChange={(e: any) =>
              handleChange(index, "image", e.target.files?.[0] || null)
            }
          />

          {typeof field.image === "string" && (
            <img
              src={field.image}
              className="w-40 h-24 object-cover mt-2 rounded"
            />
          )}

          {errors[index]?.image && (
            <p className="text-red-500 text-sm">{errors[index].image}</p>
          )}

          {/* Speciality */}
          <DynamicAmenities
            initialValues={field.speciality}
            onChange={(values) => handleChange(index, "speciality", values)}
          />

          {errors[index]?.speciality && (
            <p className="text-red-500 text-sm">{errors[index].speciality}</p>
          )}
        </div>
      ))}
      <div className="mt-4">
        <button
          onClick={handleAddField}
          className="flex items-center gap-1 px-3 py-2 border rounded text-blue-600 hover:bg-blue-50 transition whitespace-nowrap"
        >
          <FiPlus /> Add New Slide
        </button>
      </div>
      {/* Save Button */}
      <button
        onClick={handleSubmit}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Save Sliders
      </button>
    </div>
  );
};

export default Slider;
