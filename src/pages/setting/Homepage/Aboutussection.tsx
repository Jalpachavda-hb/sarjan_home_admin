import React, { useEffect, useRef, useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import FileInput from "../../../components/form/input/FileInput";
import Button from "../../../components/ui/button/Button";
import TextArea from "../../../components/form/input/TextArea";
import { gettesaboutus } from "../../../utils/Handlerfunctions/getdata";
import { updateaboutussection } from "../../../utils/Handlerfunctions/formSubmitHandlers";
import { toast } from "react-toastify";

interface AboutType {
  id?: number;
  about_image: string | File | null;
  additional_image: string | File | null; // now video file or url
  header: string;
  description: string;
  youtube_link: string;
  houses_available: number | string;
  houses_sold: number | string;
  trusted_agents: number | string;
}

const Aboutussection: React.FC = () => {
  const [about, setAbout] = useState<AboutType>({
    about_image: "",
    additional_image: "",
    header: "",
    description: "",
    youtube_link: "",
    houses_available: "",
    houses_sold: "",
    trusted_agents: "",
  });

  // for locally created object URLs so we can revoke them later
  const aboutImageUrlRef = useRef<string | null>(null);
  const additionalMediaUrlRef = useRef<string | null>(null);

  // ------------------ LOAD ABOUT DATA ------------------
  const loadAboutData = async () => {
    try {
      const data = await gettesaboutus(); // returns direct about object
      if (data) {
        setAbout({
          id: data.id,
          about_image: data.about_image ?? "",
          additional_image: data.additional_image ?? "",
          header: data.header ?? "",
          description: data.description ?? "",
          youtube_link: data.youtube_link ?? "",
          houses_available: data.houses_available ?? "",
          houses_sold: data.houses_sold ?? "",
          trusted_agents: data.trusted_agents ?? "",
        });
      }
    } catch (err) {
      console.error("Failed to load about data", err);
      toast.error("Failed to load about data");
    }
  };

  useEffect(() => {
    loadAboutData();
    // cleanup on unmount
    return () => {
      if (aboutImageUrlRef.current)
        URL.revokeObjectURL(aboutImageUrlRef.current);
      if (additionalMediaUrlRef.current)
        URL.revokeObjectURL(additionalMediaUrlRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------------ HANDLE CHANGE ------------------
  const handleChange = (key: keyof AboutType, value: any) => {
    setAbout((prev) => ({ ...prev, [key]: value }));
  };

  // ------------------ HANDLE ABOUT IMAGE (image file) ------------------
  const onAboutImageChange = (file: File | null) => {
    // revoke previous url if any
    if (aboutImageUrlRef.current) {
      URL.revokeObjectURL(aboutImageUrlRef.current);
      aboutImageUrlRef.current = null;
    }
    if (file) {
      const url = URL.createObjectURL(file);
      aboutImageUrlRef.current = url;
      handleChange("about_image", file);
    } else {
      handleChange("about_image", null);
    }
  };

  // ------------------ HANDLE ADDITIONAL MEDIA (video only) ------------------
  const onAdditionalMediaChange = (file: File | null) => {
    // If user has entered YouTube link, block file selection (UI also disables it)
    if (about.youtube_link && about.youtube_link.trim() !== "") {
      toast.error(
        "YouTube link present — remove it to upload video from device."
      );
      return;
    }

    if (!file) {
      // user cleared file
      if (additionalMediaUrlRef.current) {
        URL.revokeObjectURL(additionalMediaUrlRef.current);
        additionalMediaUrlRef.current = null;
      }
      handleChange("additional_image", null);
      return;
    }

    // Validate file is video
    if (!file.type.startsWith("video/")) {
      toast.error("Only video files are allowed for 'Video from device'.");
      return;
    }

    // revoke previous url
    if (additionalMediaUrlRef.current) {
      URL.revokeObjectURL(additionalMediaUrlRef.current);
      additionalMediaUrlRef.current = null;
    }

    const url = URL.createObjectURL(file);
    additionalMediaUrlRef.current = url;
    handleChange("additional_image", file);
  };

  // ------------------ HANDLE YOUTUBE CHANGE ------------------
  const onYoutubeChange = (value: string) => {
    // If user has a device video set, prevent entering YouTube
    if (about.additional_image && typeof about.additional_image !== "string") {
      toast.error(
        "A device video is already selected — remove it to add a YouTube link."
      );
      return;
    }
    handleChange("youtube_link", value);
  };

  // ------------------ VALIDATION BEFORE SAVE ------------------
  const validateAll = (): { ok: boolean; message?: string } => {
    if (!about.header || !about.header.toString().trim())
      return { ok: false, message: "Header is required." };
    if (!about.description || !about.description.toString().trim())
      return { ok: false, message: "Description is required." };

    // either youtube_link or additional_image must be present (additional_image can be URL or File)
    const hasYoutube =
      about.youtube_link && about.youtube_link.toString().trim() !== "";
    const hasAdditional = !!(
      about.additional_image &&
      (typeof about.additional_image === "string"
        ? about.additional_image.trim() !== ""
        : true)
    );

    if (!hasYoutube && !hasAdditional)
      return {
        ok: false,
        message: "Either YouTube link or a device video must be provided.",
      };

    // if additional_image is File, ensure it's video
    if (about.additional_image && typeof about.additional_image !== "string") {
      const f = about.additional_image as File;
      if (!f.type.startsWith("video/"))
        return { ok: false, message: "Additional media must be a video file." };
    }

    return { ok: true };
  };

  // ------------------ SAVE / UPDATE ------------------
  const handleSave = async () => {
    const v = validateAll();
    if (!v.ok) {
      toast.error(v.message || "Validation failed");
      return;
    }

    const fd = new FormData();

    // id if present
    if (about.id) {
      fd.append("id", String(about.id));
    }

    // header / description / youtube
    fd.append("header", about.header);
    fd.append("description", about.description);
    fd.append("youtube_link", about.youtube_link || "");

    // Stats (send as strings)
    fd.append("houses_available", String(about.houses_available ?? ""));
    fd.append("houses_sold", String(about.houses_sold ?? ""));
    fd.append("trusted_agents", String(about.trusted_agents ?? ""));

    // About image: new file or existing url
    if (about.about_image instanceof File) {
      fd.append("about_image", about.about_image);
    } else if (typeof about.about_image === "string" && about.about_image) {
      fd.append("existing_about_image", about.about_image);
    }

    // Additional media (video): new file or existing url
    if (about.additional_image instanceof File) {
      fd.append("additional_image", about.additional_image);
    } else if (
      typeof about.additional_image === "string" &&
      about.additional_image
    ) {
      fd.append("existing_additional_image", about.additional_image);
    }

    try {
      const res = await updateaboutussection(fd);
      if (res) {
        toast.success("About section updated successfully!");
      } else {
        toast.error("Failed to update about section.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating about section.");
    } finally {
      // refresh
      await loadAboutData();
      // clean up object URLs created (if any)
      if (aboutImageUrlRef.current) {
        URL.revokeObjectURL(aboutImageUrlRef.current);
        aboutImageUrlRef.current = null;
      }
      if (additionalMediaUrlRef.current) {
        URL.revokeObjectURL(additionalMediaUrlRef.current);
        additionalMediaUrlRef.current = null;
      }
    }
  };

  // ------------------RENDER------------------
  return (
    <div className="space-y-6">
      <ComponentCard title="About Section">
        {/* ===== Image Upload / Preview ===== */}
        <div className="space-y-4">
          <Label>Current About Image :</Label>
          <div className="w-50 h-32 border rounded overflow-hidden bg-gray-100 flex items-center justify-center">
            {about.about_image ? (
              typeof about.about_image === "string" ? (
                <img
                  src={about.about_image}
                  className="w-full h-full object-cover"
                  alt="About"
                />
              ) : (
                <img
                  src={URL.createObjectURL(about.about_image)}
                  className="w-full h-full object-cover"
                  alt="About"
                />
              )
            ) : (
              <span className="text-gray-400 text-sm">Preview Image Here</span>
            )}
          </div>

          <div>
            <Label htmlFor="aboutImage">
              Upload About Image <span className="text-red-500">*</span>
            </Label>
            <FileInput
              id="aboutImage"
              accept="image/*"
              onChange={(e: any) =>
                onAboutImageChange(e.target.files?.[0] || null)
              }
            />
          </div>
        </div>

        {/* ===== Header ===== */}
        <div className="mt-6">
          <Label htmlFor="aboutHeader">
            About Description Header <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            id="aboutHeader"
            value={about.header}
            onChange={(e) => handleChange("header", e.target.value)}
            placeholder="Enter section header"
          />
        </div>

        {/* ===== Description ===== */}
        <div className="mt-4">
          <Label>
            About Description <span className="text-red-500">*</span>
          </Label>
          <TextArea
            value={about.description}
            onChange={(val) => handleChange("description", val)}
            placeholder="Enter about paragraph"
          />
        </div>

        {/* ===== YouTube + Additional Video ===== */}
        <div className="grid grid-cols-1 gap-4 mt-6">
          <div>
            <Label>Youtube Video Link</Label>
            <Input
              value={about.youtube_link}
              onChange={(e) => onYoutubeChange(e.target.value)}
              placeholder="Enter Youtube Video Link"
              disabled={
                !!(
                  about.additional_image &&
                  typeof about.additional_image !== "string"
                )
              }
            />
          </div>

          <div>
            <Label>Video from device (optional)</Label>

            {/* preview video or existing url */}
            {about.additional_image ? (
              typeof about.additional_image === "string" ? (
                <video controls className="w-full max-h-48 mb-2">
                  <source src={about.additional_image} />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <video
                  controls
                  src={
                    additionalMediaUrlRef.current ??
                    URL.createObjectURL(about.additional_image)
                  }
                  className="w-full max-h-48 mb-2"
                />
              )
            ) : null}

            <FileInput
              id="extraVideo"
              accept="video/*"
              onChange={(e: any) =>
                onAdditionalMediaChange(e.target.files?.[0] || null)
              }
              disabled={
                !!(about.youtube_link && about.youtube_link.trim() !== "")
              }
            />
            <p className="text-sm text-gray-500 mt-1">
              If you upload a video from device, the YouTube link will be
              disabled and vice versa.
            </p>
          </div>
        </div>

        {/* ===== Stats Section ===== */}
        <div className="grid grid-cols-3 gap-6 mt-6">
          <div>
            <Label>Houses Available</Label>
            <Input
              type="number"
              value={about.houses_available}
              onChange={(e) => handleChange("houses_available", e.target.value)}
              placeholder="Enter count"
            />
          </div>
          <div>
            <Label>Houses Sold</Label>
            <Input
              type="number"
              value={about.houses_sold}
              onChange={(e) => handleChange("houses_sold", e.target.value)}
              placeholder="Enter count"
            />
          </div>
          <div>
            <Label>Trusted Agents</Label>
            <Input
              type="number"
              value={about.trusted_agents}
              onChange={(e) => handleChange("trusted_agents", e.target.value)}
              placeholder="Enter count"
            />
          </div>
        </div>

        {/* ===== Save Button ===== */}
        <div className="mt-8 flex justify-end">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </ComponentCard>
    </div>
  );
};

export default Aboutussection;
