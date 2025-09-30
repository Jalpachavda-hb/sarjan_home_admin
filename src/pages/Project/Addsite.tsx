import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import FileInput from "../../components/form/input/FileInput";
import Select from "../../components/form/Select";
import Button from "../../components/ui/button/Button";
import TextArea from "../../components/form/input/TextArea";
import DynamicInputFields from "../../components/form/form-elements/DynamicInputFields ";
import Dynamicgroup from "../../components/form/form-elements/Dynamicgroup";
import { addNewSite } from "../../utils/Handlerfunctions/formSubmitHandlers";
import { editSiteData } from "../../utils/Handlerfunctions/formEditHandlers";

import { toast } from "react-toastify";
import {
  fetchProjectTypes,
  fetchProjectcategory,
  fetchSitedetails,
} from "../../utils/Handlerfunctions/getdata";

// Icons
const EyeIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

interface Option {
  value: string;
  label: string;
}

interface SpecialityField {
  title: string;
  description: string;
  icon?: string;
}

interface FileWithPreview {
  file: File | null;
  preview: string;
  isNew: boolean;
}

interface FilePreview {
  url: string;
  name: string;
  type: "image" | "document" | "video";
}

const SiteStepper = ({ step }: { step: number }) => {
  const steps = [
    { number: 1, label: "Site Information" },
    { number: 2, label: "Other Details" },
  ];

  return (
    <div className="flex mb-8 w-full">
      {steps.map((s, index) => (
        <div key={s.number} className="flex items-center w-full">
          <div className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 
              ${
                step === s.number
                  ? "bg-blue-600 text-white border-blue-600"
                  : step > s.number
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-gray-200 text-gray-600 border-gray-300"
              }
              `}
            >
              {s.number}
            </div>
            <span
              className={`ml-2 font-medium ${
                step === s.number ? "text-blue-600" : "text-gray-500"
              }`}
            >
              {s.label}
            </span>
          </div>
          {index !== steps.length - 1 && (
            <div className="flex-1 h-[2px] bg-gray-300 mx-4" />
          )}
        </div>
      ))}
    </div>
  );
};

const FilePreviewGrid = ({
  files,
  title,
  onRemove,
}: {
  files: FilePreview[];
  title: string;
  onRemove?: (index: number) => void;
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (files.length === 0) return null;

  return (
    <>
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-700 mb-3">{title}:</p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {files.map((file, index) => (
            <div
              key={index}
              className="relative group border rounded-lg overflow-hidden bg-gray-50"
            >
              {file.type === "image" ? (
                <div className="aspect-square">
                  <img
                    src={file.url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => setSelectedImage(file.url)}
                  />
                </div>
              ) : (
                <div className="aspect-square flex flex-col items-center justify-center p-3 bg-blue-50">
                  <svg
                    className="w-8 h-8 text-blue-500 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="text-xs text-center text-gray-600 break-words">
                    {file.name || `Document ${index + 1}`}
                  </span>
                </div>
              )}

              {/* View Button for URLs */}
              {(file.url.startsWith("http") ||
                file.url.startsWith("https")) && (
                <button
                  onClick={() => window.open(file.url, "_blank")}
                  className="absolute top-2 right-2 bg-blue-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  title="View in new tab"
                >
                  <EyeIcon />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Full size preview"
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white text-gray-800 p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const Addsite = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // API Options
  const [projectTypesOptions, setProjectTypesOptions] = useState<Option[]>([]);
  const [projectCategoryOptions, setProjectCategoryOptions] = useState<
    Option[]
  >([]);

  // Form Fields
  const [selectedProjectType, setSelectedProjectType] = useState<string>("");
  const [selectedProjectCategory, setSelectedProjectCategory] =
    useState<string>("");
  const [title, setTitle] = useState("");
  const [reraNumber, setReraNumber] = useState("");
  const [bhkDetails, setBhkDetails] = useState("");
  const [description, setDescription] = useState("");
  const [mapLink, setMapLink] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const navigate = useNavigate();
  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Dynamic Arrays
  const [amenities, setAmenities] = useState<string[]>([]);
  const [specialities, setSpecialities] = useState<SpecialityField[]>([]);

  // File Uploads with previews
  const [bannerImage, setBannerImage] = useState<FileWithPreview>({
    file: null,
    preview: "",
    isNew: false,
  });
  const [galleryImages, setGalleryImages] = useState<FilePreview[]>([]);
  const [keyPlan, setKeyPlan] = useState<FilePreview[]>([]);
  const [layoutPlan, setLayoutPlan] = useState<FilePreview[]>([]);
  const [floorPlan, setFloorPlan] = useState<FilePreview[]>([]);
  const [brochure, setBrochure] = useState<FileWithPreview>({
    file: null,
    preview: "",
    isNew: false,
  });
  const [reraDocuments, setReraDocuments] = useState<FilePreview[]>([]);

  // New file selections
  const [newGalleryImages, setNewGalleryImages] = useState<File[]>([]);
  const [newKeyPlan, setNewKeyPlan] = useState<File[]>([]);
  const [newLayoutPlan, setNewLayoutPlan] = useState<File[]>([]);
  const [newFloorPlan, setNewFloorPlan] = useState<File[]>([]);
  const [newReraDocuments, setNewReraDocuments] = useState<File[]>([]);

  // Load API data
  useEffect(() => {
    const loadProjectTypes = async () => {
      try {
        const res = await fetchProjectTypes();
        if (res && Array.isArray(res)) {
          setProjectTypesOptions(
            res.map((i: any) => ({ value: i.id.toString(), label: i.name }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch project types", err);
      }
    };

    const loadProjectCategories = async () => {
      try {
        const res = await fetchProjectcategory();
        if (res && Array.isArray(res)) {
          setProjectCategoryOptions(
            res.map((i: any) => ({ value: i.id.toString(), label: i.name }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch project categories", err);
      }
    };

    loadProjectTypes();
    loadProjectCategories();
  }, []);

  // Load site data for edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const loadSiteData = async () => {
        setIsLoading(true);
        try {
          const response = await fetchSitedetails(id);
          if (response && response.site) {
            const siteData = response.site;

            // Select fields
            setSelectedProjectType(siteData.project_type_id?.toString() || "");
            setSelectedProjectCategory(
              siteData.project_category_id?.toString() || ""
            );
            setTitle(siteData.title || "");
            setReraNumber(siteData.rera_number || "");
            setBhkDetails(siteData.bhk_details || "");
            setDescription(siteData.descr || "");
            setMapLink(siteData.map_link || "");
            setVideoLink(siteData.video_link || "");

            // Amenities
            // setAmenities(
            //   siteData.amenities ? siteData.amenities.split(",") : []
            // );
            try {
              const parsedAmenities = siteData.amenities
                ? JSON.parse(siteData.amenities)
                : [];
              setAmenities(parsedAmenities); // now it's ['1', '2']
            } catch (e) {
              console.error("Invalid amenities JSON:", e);
              setAmenities([]);
            }

            // Specification
            try {
              const parsedSpecs = siteData.specification
                ? JSON.parse(siteData.specification)
                : [];
              setSpecialities(parsedSpecs);
            } catch (e) {
              console.error("Invalid specification JSON:", e);
              setSpecialities([]);
            }

            // Files - Convert URLs to FilePreview objects
            if (siteData.banner) {
              setBannerImage({
                file: null,
                preview: siteData.banner,
                isNew: false,
              });
            }

            if (siteData.brochure) {
              setBrochure({
                file: null,
                preview: siteData.brochure,
                isNew: false,
              });
            }

            // Gallery Images
            const galleryPreviews: FilePreview[] = (
              response.gallery_images || []
            ).map((g: any) => ({
              url: g.gallery_image,
              name: `Gallery Image`,
              type: "image",
            }));
            setGalleryImages(galleryPreviews);

            // Key Plan
            const keyPlanPreviews: FilePreview[] = (
              response.unit_plans || []
            ).map((u: any) => ({
              url: u.unit_plan_image,
              name: `Key Plan`,
              type: "image",
            }));
            setKeyPlan(keyPlanPreviews);

            // Layout Plan
            const layoutPlanPreviews: FilePreview[] = (
              response.bird_views || []
            ).map((b: any) => ({
              url: b.bird_view_image,
              name: `Layout Plan`,
              type: "image",
            }));
            setLayoutPlan(layoutPlanPreviews);

            // Floor Plan
            const floorPlanPreviews: FilePreview[] = (
              response.floor_images || []
            ).map((f: any) => ({
              url: f.floor_image,
              name: `Floor Plan`,
              type: "image",
            }));
            setFloorPlan(floorPlanPreviews);

            // RERA Documents
            const reraPreviews: FilePreview[] = (
              response.rera_documents || []
            ).map((r: any) => ({
              url: r.rera_documents,
              name: `RERA Document`,
              type: "document",
            }));
            setReraDocuments(reraPreviews);
          }
        } catch (error) {
          console.error("Error loading site data:", error);
          toast.error("Failed to load site data");
        } finally {
          setIsLoading(false);
        }
      };
      loadSiteData();
    }
  }, [isEditMode, id]);

  // File upload handlers with preview
  const handleSingleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (fileWithPreview: FileWithPreview) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setter({
        file,
        preview,
        isNew: true,
      });
    }
  };

  const handleMultipleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (files: File[]) => void,
    previewSetter?: (previews: FilePreview[]) => void
  ) => {
    const files = Array.from(e.target.files || []);
    setter(files);

    // Create previews for new files
    if (previewSetter) {
      const newPreviews: FilePreview[] = files.map((file) => ({
        url: URL.createObjectURL(file),
        name: file.name,
        type: file.type.startsWith("image/") ? "image" : "document",
      }));
      previewSetter(newPreviews);
    }
  };

  // Remove file handlers
  const removeGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeKeyPlan = (index: number) => {
    setKeyPlan((prev) => prev.filter((_, i) => i !== index));
  };

  const removeLayoutPlan = (index: number) => {
    setLayoutPlan((prev) => prev.filter((_, i) => i !== index));
  };

  const removeFloorPlan = (index: number) => {
    setFloorPlan((prev) => prev.filter((_, i) => i !== index));
  };

  const removeReraDocument = (index: number) => {
    setReraDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const newErrors: { [key: string]: string } = {};

    if (!selectedProjectType)
      newErrors.selectedProjectType = "Project Type is required";
    if (!selectedProjectCategory)
      newErrors.selectedProjectCategory = "Project Category is required";
    if (!title.trim()) newErrors.title = "Title is required";
    if (!reraNumber.trim()) newErrors.reraNumber = "Rera Number is required";
    if (!bhkDetails.trim()) newErrors.bhkDetails = "BHK Details is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!bannerImage.file && !bannerImage.preview)
      newErrors.bannerImage = "Banner Image is required";
    if (galleryImages.length === 0 && newGalleryImages.length === 0)
      newErrors.galleryImages = "At least one Gallery Image is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (step === 1) setStep(2);
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Basic fields
      formData.append("project_type", selectedProjectType);
      formData.append("project_category", selectedProjectCategory);
      formData.append("title", title);
      formData.append("descr", description);
      formData.append("bhk_details", bhkDetails);
      formData.append("rera_number", reraNumber);
      formData.append("map_link", mapLink);
      formData.append("video_link", videoLink);

      // Amenities and Specialities
      formData.append("amenities", JSON.stringify(amenities));
      formData.append("specification", JSON.stringify(specialities));

      // Banner & Brochure
      if (bannerImage.isNew && bannerImage.file) {
        formData.append("banner_image", bannerImage.file);
      }
      if (brochure.isNew && brochure.file) {
        formData.append("brochure", brochure.file);
      }

      // Gallery Images (new files only)
      newGalleryImages.forEach((file) => {
        formData.append("gallery_image[]", file);
      });

      // Key Plan
      newKeyPlan.forEach((file) => formData.append("unit_plan[]", file));

      // Layout Plan
      newLayoutPlan.forEach((file) => formData.append("bird_view[]", file));

      // Floor Plan
      newFloorPlan.forEach((file) => formData.append("floor_plan[]", file));

      // RERA Documents
      newReraDocuments.forEach((file) =>
        formData.append("rera_certificate[]", file)
      );

      let result;
      if (isEditMode && id) {
        result = await editSiteData(id, formData);
      } else {
        result = await addNewSite(formData);
      }
      if (result && result.status === 200) {
        toast.success(`Site ${isEditMode ? "updated" : "added"} successfully!`);
       
          navigate("/admin/projects/site_details");
   
      }

    } catch (error) {
      console.error("Error submitting site:", error);
      toast.error(`Failed to ${isEditMode ? "update" : "add"} site`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">
        {isEditMode ? "Edit Site" : "Add Site"}
      </h2>
      <SiteStepper step={step} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        {step === 1 && (
          <ComponentCard title="Site Information">
            <div className="space-y-6">
              <div>
                <Label>
                  Select Project Type<span className="text-red-500">*</span>
                </Label>
                <Select
                  options={projectTypesOptions}
                  value={selectedProjectType}
                  onChange={(value) => {
                    setSelectedProjectType(value);
                    if (errors.selectedProjectType) {
                      setErrors((prev) => ({
                        ...prev,
                        selectedProjectType: "",
                      }));
                    }
                  }}
                  placeholder="Select project type"
                />
                {errors.selectedProjectType && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.selectedProjectType}
                  </p>
                )}
              </div>

              <div>
                <Label>
                  Select Project Category<span className="text-red-500">*</span>
                </Label>
                <Select
                  options={projectCategoryOptions}
                  value={selectedProjectCategory}
                  onChange={(value) => {
                    setSelectedProjectCategory(value);
                    if (errors.selectedProjectCategory) {
                      setErrors((prev) => ({
                        ...prev,
                        selectedProjectCategory: "",
                      }));
                    }
                  }}
                  placeholder="Select project category"
                />
                {errors.selectedProjectCategory && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.selectedProjectCategory}
                  </p>
                )}
              </div>

              <div>
                <Label>
                  Title<span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Enter Title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) {
                      setErrors((prev) => ({ ...prev, title: "" }));
                    }
                  }}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <Label>
                  Rera Number<span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Enter Rera Number"
                  value={reraNumber}
                  onChange={(e) => {
                    setReraNumber(e.target.value);
                    if (errors.reraNumber) {
                      setErrors((prev) => ({ ...prev, reraNumber: "" }));
                    }
                  }}
                />
                {errors.reraNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.reraNumber}
                  </p>
                )}
              </div>

              <div>
                <Label>
                  BHK Details<span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Enter BHK Details"
                  value={bhkDetails}
                  onChange={(e) => {
                    setBhkDetails(e.target.value);
                    if (errors.bhkDetails) {
                      setErrors((prev) => ({ ...prev, bhkDetails: "" }));
                    }
                  }}
                />
                {errors.bhkDetails && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.bhkDetails}
                  </p>
                )}
              </div>

              <div>
                <Label>
                  Description<span className="text-red-500">*</span>
                </Label>
                <TextArea
                  value={description}
                  onChange={(value) => {
                    setDescription(value);
                    if (errors.description) {
                      setErrors((prev) => ({ ...prev, description: "" }));
                    }
                  }}
                  placeholder="Enter description"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              <div>
                <Label>Google Map Link (iframe)</Label>
                <div className="flex gap-2 mt-2 items-center w-full">
                  <div className="flex-1">
                    <Input
                      placeholder="Enter Google Map Link"
                      value={mapLink}
                      onChange={(e) => setMapLink(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  {mapLink && (
                    <button
                      type="button"
                      onClick={() => window.open(mapLink, "_blank")}
                      className="flex items-center gap-1 px-3 py-2 border rounded text-blue-600 hover:bg-blue-50 transition whitespace-nowrap"
                    >
                      <EyeIcon className="w-4 h-4" />
                      View
                    </button>
                  )}
                </div>
              </div>

              <div>
                <Label>Youtube Video Link</Label>
                <div className="flex gap-2 mt-2 items-center w-full">
                  <div className="flex-1">
                    <Input
                      placeholder="Enter Youtube Video Link"
                      value={videoLink}
                      onChange={(e) => setVideoLink(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  {videoLink && (
                    <button
                      type="button"
                      onClick={() => window.open(videoLink, "_blank")}
                      className="flex items-center gap-1 px-3 py-2 border rounded text-blue-600 hover:bg-blue-50 transition whitespace-nowrap"
                    >
                      <EyeIcon className="w-4 h-4" />
                      View
                    </button>
                  )}
                </div>
              </div>
            </div>
          </ComponentCard>
        )}

        {step === 2 && (
          <>
            <ComponentCard title="Upload Images">
              <div className="space-y-6">
                {/* Banner Image */}
                <div>
                  <Label>
                    Banner Image<span className="text-red-500">*</span>
                  </Label>
                  <FileInput
                    id="bannerUpload"
                    onChange={(e) => {
                      handleSingleFileUpload(e, setBannerImage);
                      if (errors.bannerImage) {
                        setErrors((prev) => ({ ...prev, bannerImage: "" }));
                      }
                    }}
                  />
                  {errors.bannerImage && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.bannerImage}
                    </p>
                  )}
                  {bannerImage.preview && (
                    <FilePreviewGrid
                      files={[
                        {
                          url: bannerImage.preview,
                          name: "Banner Image",
                          type: "image",
                        },
                      ]}
                      title="Banner Preview"
                    />
                  )}
                </div>

                {/* Gallery Images */}
                <div>
                  <Label>
                    Gallery Images (Multiple)
                    <span className="text-red-500">*</span>
                  </Label>
                  <FileInput
                    id="galleryUpload"
                    onChange={(e) => {
                      handleMultipleFileUpload(e, setNewGalleryImages);
                      if (errors.galleryImages) {
                        setErrors((prev) => ({ ...prev, galleryImages: "" }));
                      }
                    }}
                    multiple
                  />
                  {errors.galleryImages && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.galleryImages}
                    </p>
                  )}
                  <FilePreviewGrid
                    files={galleryImages}
                    title="Existing Gallery Images"
                    onRemove={removeGalleryImage}
                  />
                </div>

                {/* Key Plan */}
                <div>
                  <Label>Key Plan (Multiple)</Label>
                  <FileInput
                    id="keyPlanUpload"
                    onChange={(e) => handleMultipleFileUpload(e, setNewKeyPlan)}
                    multiple
                  />
                  <FilePreviewGrid
                    files={keyPlan}
                    title="Existing Key Plans"
                    onRemove={removeKeyPlan}
                  />
                </div>

                {/* Layout Plan */}
                <div>
                  <Label>Layout Plan (Multiple)</Label>
                  <FileInput
                    id="layoutPlanUpload"
                    onChange={(e) =>
                      handleMultipleFileUpload(e, setNewLayoutPlan)
                    }
                    multiple
                  />
                  <FilePreviewGrid
                    files={layoutPlan}
                    title="Existing Layout Plans"
                    onRemove={removeLayoutPlan}
                  />
                </div>

                {/* Floor Plan */}
                <div>
                  <Label>Floor Plan (Multiple)</Label>
                  <FileInput
                    id="floorPlanUpload"
                    onChange={(e) =>
                      handleMultipleFileUpload(e, setNewFloorPlan)
                    }
                    multiple
                  />
                  <FilePreviewGrid
                    files={floorPlan}
                    title="Existing Floor Plans"
                    onRemove={removeFloorPlan}
                  />
                </div>

                {/* Brochure */}
                <div>
                  <Label>Brochure</Label>
                  <FileInput
                    id="brochureUpload"
                    onChange={(e) => handleSingleFileUpload(e, setBrochure)}
                  />
                  {brochure.preview && (
                    <FilePreviewGrid
                      files={[
                        {
                          url: brochure.preview,
                          name: "Brochure",
                          type: brochure.preview.includes(".pdf")
                            ? "document"
                            : "image",
                        },
                      ]}
                      title="Brochure Preview"
                    />
                  )}
                </div>

                {/* RERA Documents */}
                <div>
                  <Label>RERA Documents (Multiple)</Label>
                  <FileInput
                    id="reraDocsUpload"
                    onChange={(e) =>
                      handleMultipleFileUpload(e, setNewReraDocuments)
                    }
                    multiple
                  />
                  <FilePreviewGrid
                    files={reraDocuments}
                    title="Existing RERA Documents"
                    onRemove={removeReraDocument}
                  />
                </div>
              </div>
            </ComponentCard>

            <ComponentCard title="Add Amenities">
              <DynamicInputFields
                onChange={setAmenities}
                initialValues={amenities}
              />
            </ComponentCard>

            <ComponentCard title="Add Speciality">
              <Dynamicgroup
                onChange={setSpecialities}
                initialValues={specialities}
              />
            </ComponentCard>
          </>
        )}
      </div>

      <div className="mt-6 flex justify-between">
        {step > 1 && (
          <Button onClick={() => setStep(step - 1)}>Previous</Button>
        )}
        {step < 2 ? (
          <Button
            onClick={() => {
              const newErrors: { [key: string]: string } = {};

              if (!selectedProjectType)
                newErrors.selectedProjectType = "Project Type is required";
              if (!selectedProjectCategory)
                newErrors.selectedProjectCategory =
                  "Project Category is required";
              if (!title.trim()) newErrors.title = "Title is required";
              if (!reraNumber.trim())
                newErrors.reraNumber = "Rera Number is required";
              if (!bhkDetails.trim())
                newErrors.bhkDetails = "BHK Details is required";
              if (!description.trim())
                newErrors.description = "Description is required";

              setErrors(newErrors);

              if (Object.keys(newErrors).length === 0) {
                setStep(step + 1);
              }
            }}
            className="ml-auto bg-green-600 hover:bg-green-700"
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="ml-auto bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting
              ? isEditMode
                ? "Updating..."
                : "Submitting..."
              : isEditMode
              ? "Update"
              : "Submit"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Addsite;
