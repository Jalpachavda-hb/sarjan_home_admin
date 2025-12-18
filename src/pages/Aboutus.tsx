import React, { useEffect, useState } from "react";
import ComponentCard from "../components/common/ComponentCard";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import FileInput from "../components/form/input/FileInput";
import Button from "../components/ui/button/Button";
import TextArea from "../components/form/input/TextArea";
import { getmainaboutussection } from "../utils/Handlerfunctions/getdata";
import { updateaboutmain } from "../utils/Handlerfunctions/formSubmitHandlers";
import { toast } from "react-toastify";

const Aboutus: React.FC = () => {
  const [header, setHeader] = useState("");
  const [description, setDescription] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // ---------------- FETCH EXISTING DATA ----------------
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await getmainaboutussection();
      if (res?.data) {
        const d = res.data;

        setHeader(d.header || "");
        setDescription(d.description || "");
        setYoutubeLink(d.youtubelink || "");
        setImagePreview(d.image || null);
      }
    } catch (err) {
      toast.error("Failed to load About Us");
    }
  };

  // ---------------- IMAGE CHANGE ----------------
  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0];
    setImageFile(file || null);

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ---------------- SUBMIT / UPDATE ----------------
  const handleUpdate = async () => {
    if (!header.trim()) return toast.error("Header is required");
    if (!description.trim()) return toast.error("Description is required");

    const fd = new FormData();
    fd.append("header", header);
    fd.append("description", description);
    fd.append("youtubelink", youtubeLink);

    if (imageFile) {
      fd.append("image", imageFile);
    } else if (imagePreview) {
      fd.append("existing_image", imagePreview);
    }

    try {
      const res = await updateaboutmain(fd);

      if (res) {
        toast.success("About Us updated successfully!");
        loadData();
      }
    } catch (err) {
      toast.error("Update failed");
      console.error(err);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6">
          <ComponentCard title="About Section">
            <div className="space-y-6">

              {/* ===== Current Image ===== */}
              <Label>Current Image :</Label>
              <div className="w-50 h-32 border rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    className="w-full h-full object-cover"
                    alt="About"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">Preview Image Here</span>
                )}
              </div>

              {/* Upload Image */}
              <Label>
                Upload New Image <span className="text-red-500">*</span>
              </Label>
              <FileInput accept="image/*" onChange={handleImageChange} />

              {/* Header */}
              <Label>
                Header <span className="text-red-500">*</span>
              </Label>
              <Input
                value={header}
                onChange={(e) => setHeader(e.target.value)}
                placeholder="Enter header"
              />

              {/* Description */}
              <Label>
                Description <span className="text-red-500">*</span>
              </Label>
              <TextArea
                value={description}
                onChange={(val) => setDescription(val)}
                placeholder="Enter description"
              />

              {/* Youtube Link */}
              <Label>YouTube Video Link</Label>
              <Input
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
                placeholder="Enter YouTube video link"
              />
            </div>
          </ComponentCard>
        </div>
      </div>

      {/* ===== Update Button ===== */}
      <div className="flex justify-end mt-4">
        <Button
          onClick={handleUpdate}
          className="bg-green-600 hover:bg-green-700"
        >
          Update
        </Button>
      </div>
    </div>
  );
};

export default Aboutus;
