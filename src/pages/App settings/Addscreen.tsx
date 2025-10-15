import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import FileInput from "../../components/form/input/FileInput";
import Button from "../../components/ui/button/Button";
import { submitSplashScreen } from "../../utils/Handlerfunctions/formSubmitHandlers";

const Addscreen = () => {
  const [splashscreen_image, setSplashscreenImage] = useState<File | null>(
    null
  );
  const [title, setTitle] = useState("");
  const [_data, setData] = useState<any[]>([]);
  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    title: "",
    image: "",
  });

  // Validate individual fields
  const validateField = (field: string, value: any) => {
    let errorMsg = "";
    switch (field) {
      case "title":
        if (!value.trim()) errorMsg = "Title is required";
        break;
      case "image":
        if (!value) errorMsg = "Image is required";
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
    return errorMsg === "";
  };

  const handleSplashScreenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSplashscreenImage(file);
    validateField("image", file);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    validateField("title", value);
  };

  const handleSubmit = async () => {
    const isTitleValid = validateField("title", title);
    const isImageValid = validateField("image", splashscreen_image);

    if (!isTitleValid || !isImageValid) return;

    try {
      const newRecord = await submitSplashScreen(splashscreen_image, title);
      if (newRecord) {
        setData((prev) => [newRecord, ...prev]);
        setSplashscreenImage(null);
        setTitle("");
        navigate("/admin/settings/home_slider");
      }
    } catch (err) {
      console.error("Failed to submit splash screen:", err);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6">
          <ComponentCard title="Add New Splash Screen">
            <div className="space-y-6">
              {splashscreen_image && (
                <div className="w-32 h-32 border rounded overflow-hidden">
                  <img
                    src={URL.createObjectURL(splashscreen_image)}
                    alt="splashscreen preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="fileUpload">
                  Upload Image<span className="text-red-500">*</span>
                </Label>
                <FileInput
                  id="fileUpload"
                  onChange={handleSplashScreenChange}
                />
                {errors.image && (
                  <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                )}
              </div>

              <div>
                <Label htmlFor="title">
                  Title<span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="title"
                  placeholder="Enter splash screen Title"
                  value={title}
                  onChange={handleTitleChange}
                  error={!!errors.title}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>
            </div>
          </ComponentCard>
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        className="mt-3 bg-green-600 hover:bg-green-700"
      >
        Add
      </Button>
      <Button className="canclebtn" onClick={() => navigate(-1)}>
        Cancel
      </Button>
    </div>
  );
};

export default Addscreen;
