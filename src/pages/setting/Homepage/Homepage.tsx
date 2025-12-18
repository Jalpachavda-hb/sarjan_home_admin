// import { useState, useEffect } from "react";
// import { FiPlus, FiTrash2 } from "react-icons/fi";
// import Swal from "sweetalert2";
// import { toast } from "react-toastify";

// import Label from "../../../components/form/Label";
// import Input from "../../../components/form/input/InputField";
// import TextArea from "../../../components/form/input/TextArea";
// import FileInput from "../../../components/form/input/FileInput";

// import { herosliders } from "../../../utils/Handlerfunctions/getdata";
// import { saveHeroSliders } from "../../../utils/Handlerfunctions/formSubmitHandlers";
// import { deleteheroslider } from "../../../utils/Handlerfunctions/formdeleteHandlers";

// export interface HeroSlideField {
//   id?: number;
//   title: string;
//   description: string;
//   slide_image: File | string | null;
//   background_image: File | string | null;
// }

// const Herosection = () => {
//   const [fields, setFields] = useState<HeroSlideField[]>([
//     {
//       title: "",
//       description: "",
//       slide_image: null,
//       background_image: null,
//     },
//   ]);

//   const [errors, setErrors] = useState<any[]>([
//     { title: "", description: "", slide_image: "", background_image: "" },
//   ]);

//   // ------------------------------
//   // LOAD SLIDERS
//   // ------------------------------
//   const loadHeroSliders = async () => {
//     const data = await herosliders();
//     if (!data) return;

//     const formatted = data.map((item: any) => ({
//       id: item.id,
//       title: item.title,
//       description: item.description,
//       slide_image: item.slide_image,
//       background_image: item.background_image,
//     }));

//     setFields(formatted);
//     setErrors(
//       formatted.map(() => ({
//         title: "",
//         description: "",
//         slide_image: "",
//         background_image: "",
//       }))
//     );
//   };

//   useEffect(() => {
//     loadHeroSliders();
//   }, []);

//   // ------------------------------
//   // VALIDATION
//   // ------------------------------
//   const validate = (field: HeroSlideField) => {
//     const err: any = {};

//     if (!field.title.trim()) err.title = "Title is required";
//     if (!field.description.trim()) err.description = "Description is required";

//     // New slides require images
//     if (!field.id && !field.slide_image)
//       err.slide_image = "Slide image required";

//     if (!field.id && !field.background_image)
//       err.background_image = "Background image required";

//     return err;
//   };

//   // ------------------------------
//   // HANDLE INPUT
//   // ------------------------------
//   const handleChange = <K extends keyof HeroSlideField>(
//     index: number,
//     key: K,
//     value: HeroSlideField[K]
//   ) => {
//     const updated = [...fields];
//     updated[index][key] = value;
//     setFields(updated);

//     const updatedErrors = [...errors];
//     updatedErrors[index][key] = "";
//     setErrors(updatedErrors);
//   };

//   // ------------------------------
//   // ADD NEW SLIDE
//   // ------------------------------
//   const handleAddField = () => {
//     setFields([
//       ...fields,
//       {
//         title: "",
//         description: "",
//         slide_image: null,
//         background_image: null,
//       },
//     ]);

//     setErrors([
//       ...errors,
//       { title: "", description: "", slide_image: "", background_image: "" },
//     ]);
//   };

//   // ------------------------------
//   // DELETE SLIDE
//   // ------------------------------
//   const handleDeleteField = async (index: number) => {
//     // If only one existing slide → do not delete
//     if (fields.length === 1 && fields[0].id) {
//       toast.error("At least one slider must remain.");
//       return;
//     }

//     const field = fields[index];

//     // NEW SLIDE → delete locally only
//     if (!field.id) {
//       const updated = fields.filter((_, i) => i !== index);
//       const updatedErrors = errors.filter((_, i) => i !== index);

//       setFields(updated);
//       setErrors(updatedErrors);

//       return;
//     }

//     // EXISTING SLIDE → confirm + delete API
//     const confirm = await Swal.fire({
//       title: "Are you sure?",
//       text: "This slide will be deleted!",
//       icon: "warning",
//       showCancelButton: true,
//     });

//     if (!confirm.isConfirmed) return;

//     const response = await deleteheroslider(field.id);

//     if (!response.success) {
//       toast.error("Failed to delete slider");
//       return;
//     }

//     toast.success("Slide deleted successfully!");
//     await loadHeroSliders();
//   };

//   // ------------------------------
//   // SAVE ALL SLIDES
//   // ------------------------------
//   const handleSubmit = async () => {
//     const validationErrors = fields.map((f) => validate(f));
//     setErrors(validationErrors);

//     const hasError = validationErrors.some((e) => Object.keys(e).length > 0);
//     if (hasError) {
//       toast.error("Please fix all validation errors.");
//       return;
//     }

//     const success = await saveHeroSliders(fields);

//     if (success) {
//       await loadHeroSliders();
//     }
//   };

//   return (
//     <div className="font-[Poppins] text-gray-700">
//       <Label className="text-lg font-semibold">Hero Section Sliders</Label>

//       {fields.map((field, index) => (
//         <div key={index} className="border p-4 mt-4 bg-white rounded shadow">
//           {/* Header */}
//           <div className="flex justify-between border-b pb-2 mb-3">
//             <h3 className="text-blue-700 font-semibold">
//               {field.id ? "Edit - " : ""} Slide {index + 1}
//             </h3>

//             <button
//               className="text-red-500 flex items-center gap-1"
//               onClick={() => handleDeleteField(index)}
//             >
//               <FiTrash2 /> Delete
//             </button>
//           </div>

//           {/* Title */}
//           <Label>Title *</Label>
//           <Input
//             value={field.title}
//             onChange={(e) => handleChange(index, "title", e.target.value)}
//             className={errors[index]?.title ? "border-red-500" : ""}
//           />

//           {/* Description */}
//           <Label>Description *</Label>
//           <TextArea
//             value={field.description}
//             onChange={(v) => handleChange(index, "description", v)}
//             className={errors[index]?.description ? "border-red-500" : ""}
//           />

//           {/* Slide Image */}
//           <Label>Slide Image *</Label>
//           <FileInput
//             accept="image/*"
//             onChange={(e: any) =>
//               handleChange(index, "slide_image", e.target.files?.[0] || null)
//             }
//           />
//           {typeof field.slide_image === "string" && (
//             <img
//               src={field.slide_image}
//               className="w-40 h-20 mt-2 rounded object-cover"
//             />
//           )}

//           {/* Background Image */}
//           <Label className="mt-2">Background Image *</Label>
//           <FileInput
//             accept="image/*"
//             onChange={(e: any) =>
//               handleChange(
//                 index,
//                 "background_image",
//                 e.target.files?.[0] || null
//               )
//             }
//           />
//           {typeof field.background_image === "string" && (
//             <img
//               src={field.background_image}
//               className="w-40 h-20 mt-2 rounded object-cover"
//             />
//           )}
//         </div>
//       ))}

//       {/* ADD SLIDE BUTTON */}
//       <button
//         onClick={handleAddField}
//         className="mt-4 px-4 py-2 border rounded text-blue-600 flex items-center gap-1 hover:bg-blue-50"
//       >
//         <FiPlus /> Add New Slide
//       </button>

//       {/* SAVE BUTTON */}
//       <button
//         onClick={handleSubmit}
//         className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//       >
//         Save Sliders
//       </button>
//     </div>
//   );
// };

// export default Herosection;


import { useState, useEffect } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import TextArea from "../../../components/form/input/TextArea";
import FileInput from "../../../components/form/input/FileInput";

import { herosliders } from "../../../utils/Handlerfunctions/getdata";
import { saveHeroSliders } from "../../../utils/Handlerfunctions/formSubmitHandlers";
import { deleteheroslider } from "../../../utils/Handlerfunctions/formdeleteHandlers";

export interface HeroSlideField {
  id?: number;
  title: string;
  description: string;
  slide_image: File | string | null;
  background_image: File | string | null;
}

const Herosection = () => {
  const [fields, setFields] = useState<HeroSlideField[]>([
    {
      title: "",
      description: "",
      slide_image: null,
      background_image: null,
    },
  ]);

  const [errors, setErrors] = useState<any[]>([
    { title: "", description: "", slide_image: "", background_image: "" },
  ]);

  // ------------------------------
  // LOAD SLIDERS
  // ------------------------------
  const loadHeroSliders = async () => {
    const data = await herosliders();
    if (!data) return;

    const formatted = data.map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      slide_image: item.slide_image,
      background_image: item.background_image,
    }));

    setFields(formatted);
    setErrors(
      formatted.map(() => ({
        title: "",
        description: "",
        slide_image: "",
        background_image: "",
      }))
    );
  };

  useEffect(() => {
    loadHeroSliders();
  }, []);

  // ------------------------------
  // VALIDATION
  // ------------------------------
  const validate = (field: HeroSlideField) => {
    const err: any = {};

    if (!field.title.trim()) err.title = "Title is required";
    if (!field.description.trim()) err.description = "Description is required";

    if (!field.id && !field.slide_image)
      err.slide_image = "Slide image required";

    if (!field.id && !field.background_image)
      err.background_image = "Background image required";

    return err;
  };

  // ------------------------------
  // HANDLE INPUT
  // ------------------------------
  const handleChange = <K extends keyof HeroSlideField>(
    index: number,
    key: K,
    value: HeroSlideField[K]
  ) => {
    const updated = [...fields];
    updated[index][key] = value;
    setFields(updated);

    const updatedErrors = [...errors];
    updatedErrors[index][key] = "";
    setErrors(updatedErrors);
  };

  // ------------------------------
  // ADD NEW SLIDE
  // ------------------------------
  const handleAddField = () => {
    setFields([
      ...fields,
      {
        title: "",
        description: "",
        slide_image: null,
        background_image: null,
      },
    ]);

    setErrors([
      ...errors,
      { title: "", description: "", slide_image: "", background_image: "" },
    ]);
  };

  // ------------------------------
  // DELETE SLIDE
  // ------------------------------
  const handleDeleteField = async (index: number) => {
    if (fields.length === 1 && fields[0].id) {
      toast.error("At least one slider must remain.");
      return;
    }

    const field = fields[index];

    if (!field.id) {
      setFields(fields.filter((_, i) => i !== index));
      setErrors(errors.filter((_, i) => i !== index));
      return;
    }

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This slide will be deleted!",
      icon: "warning",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    const response = await deleteheroslider(field.id);

    if (!response.success) {
      toast.error("Failed to delete slider");
      return;
    }

    toast.success("Slide deleted successfully!");
    await loadHeroSliders();
  };

  // ------------------------------
  // SAVE ALL SLIDES
  // ------------------------------
  const handleSubmit = async () => {
    const validationErrors = fields.map((f) => validate(f));
    setErrors(validationErrors);

    const hasError = validationErrors.some((e) => Object.keys(e).length > 0);
    if (hasError) {
      toast.error("Please fix all validation errors.");
      return;
    }

    const success = await saveHeroSliders(fields);

    if (success) {
      await loadHeroSliders();
    }
  };

  return (
    <div className="font-[Poppins] text-gray-700">
      <Label className="text-lg font-semibold">Hero Section Sliders</Label>

      {fields.map((field, index) => (
        <div key={index} className="border p-4 mt-4 bg-white rounded shadow">
          {/* Header */}
          <div className="flex justify-between border-b pb-2 mb-3">
            <h3 className="text-blue-700 font-semibold">
              {field.id ? "Edit - " : ""} Slide {index + 1}
            </h3>

            <button
              className="text-red-500 flex items-center gap-1"
              onClick={() => handleDeleteField(index)}
            >
              <FiTrash2 /> Delete
            </button>
          </div>

          {/* Title */}
          <Label>Title *</Label>
          <Input
            value={field.title}
            onChange={(e) => handleChange(index, "title", e.target.value)}
            className={errors[index]?.title ? "border-red-500" : ""}
          />

          {/* Description */}
          <Label>Description *</Label>
          <TextArea
            value={field.description}
            onChange={(v) => handleChange(index, "description", v)}
            className={errors[index]?.description ? "border-red-500" : ""}
          />

          {/* Slide Image */}
          <Label>Slide Image *</Label>
          <FileInput
            accept="image/*"
            onChange={(e: any) =>
              handleChange(index, "slide_image", e.target.files?.[0] || null)
            }
          />
          {typeof field.slide_image === "string" && (
            <img
              src={field.slide_image}
              className="w-40 h-20 mt-2 rounded object-cover"
            />
          )}

          {/* Background Image */}
          <Label className="mt-2">Background Image *</Label>
          <FileInput
            accept="image/*"
            onChange={(e: any) =>
              handleChange(
                index,
                "background_image",
                e.target.files?.[0] || null
              )
            }
          />
          {typeof field.background_image === "string" && (
            <img
              src={field.background_image}
              className="w-40 h-20 mt-2 rounded object-cover"
            />
          )}
        </div>
      ))}

      <button
        onClick={handleAddField}
        className="mt-4 px-4 py-2 border rounded text-blue-600 flex items-center gap-1 hover:bg-blue-50"
      >
        <FiPlus /> Add New Slide
      </button>

      <button
        onClick={handleSubmit}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Save Sliders
      </button>
    </div>
  );
};

export default Herosection;
