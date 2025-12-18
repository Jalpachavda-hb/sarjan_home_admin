import { useState, useEffect } from "react";
import ComponentCard from "../components/common/ComponentCard";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import FileInput from "../components/form/input/FileInput";
import Button from "../components/ui/button/Button";
import TextArea from "../components/form/input/TextArea";
import { getcontactusdata } from "../utils/Handlerfunctions/getdata";
import { updatecontact } from "../utils/Handlerfunctions/formSubmitHandlers";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

interface ContactData {
  email: string;
  contact_number: string;
  address: string;
  map_link: string;
  image: string;
}

const markerIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [32, 32],
});

function LocationMarker({
  lat,
  lng,
  setLat,
  setLng,
}: {
  lat: number;
  lng: number;
  setLat: (v: number) => void;
  setLng: (v: number) => void;
}) {
  useMapEvents({
    click(e) {
      setLat(e.latlng.lat);
      setLng(e.latlng.lng);
    },
  });

  return (
    <Marker
      position={[lat, lng]}
      draggable
      eventHandlers={{
        dragend(e) {
          const pos = e.target.getLatLng();
          setLat(pos.lat);
          setLng(pos.lng);
        },
      }}
      icon={markerIcon}
    />
  );
}

const Contactus = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [mapLink, setMapLink] = useState("");

  const [openPicker, setOpenPicker] = useState(false);
  const [lat, setLat] = useState(21.1702);
  const [lng, setLng] = useState(72.8311);

  const [errors, setErrors] = useState({
    email: "",
    contact: "",
    address: "",
    imageFile: "",
    mapLink: "",
  });

  const validateField = (field: string, value: any) => {
    let error = "";
    switch (field) {
      case "email":
        if (!value.trim()) error = "Email is required";
        break;
      case "contact":
        if (!value.trim()) error = "Contact number is required";
        break;
      case "address":
        if (!value.trim()) error = "Address is required";
        break;
      case "mapLink":
        if (!value.trim()) error = "Map link is required";
        break;
      case "imageFile":
        if (!value && !imagePreview) error = "Please upload an image";
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return error === "";
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0];
    setImageFile(file || null);

    if (file) setImagePreview(URL.createObjectURL(file));

    validateField("imageFile", file);
  };

  useEffect(() => {
    getcontactusdata()
      .then((res) => {
        const d: ContactData = res?.data;
        setEmail(d.email || "");
        setContact(d.contact_number || "");
        setAddress(d.address || "");
        setMapLink(d.map_link || "");
        setImagePreview(d.image || null);
      })
      .catch((err) => console.error("Fetch Error:", err));
  }, []);

  const handleUpdate = async () => {
    const ok =
      validateField("email", email) &&
      validateField("contact", contact) &&
      validateField("address", address) &&
      validateField("mapLink", mapLink) &&
      validateField("imageFile", imageFile);

    if (!ok) return;

    const formData = new FormData();
    formData.append("email", email);
    formData.append("contact_number", contact);
    formData.append("address", address);
    formData.append("map_link", mapLink);
    if (imageFile) formData.append("image", imageFile);

    try {
      const updated = await updatecontact(formData);
      const d: ContactData = updated.data;

      setEmail(d.email);
      setContact(d.contact_number);
      setAddress(d.address);
      setMapLink(d.map_link);
      setImagePreview(d.image);
    } catch (err) {
      console.error("Update Error:", err);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-6">
        <ComponentCard title="Contact Us Settings">
          <div className="space-y-6">
            <Label>Current Image:</Label>
            {imagePreview && (
              <div className="w-50 h-32 border rounded overflow-hidden">
                <img
                  src={imagePreview}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <Label>Upload New Image *</Label>
            <FileInput onChange={handleImageChange} />
            {errors.imageFile && (
              <p className="text-red-500 text-sm">{errors.imageFile}</p>
            )}

            <Label>Email *</Label>
            <Input
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateField("email", e.target.value);
              }}
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}

            <Label>Contact Number *</Label>
            <Input
              type="text"
              value={contact}
              onChange={(e) => {
                setContact(e.target.value);
                validateField("contact", e.target.value);
              }}
            />
            {errors.contact && <p className="text-red-500">{errors.contact}</p>}

            <Label>Address *</Label>
            <TextArea
              value={address}
              onChange={(val) => {
                setAddress(val);
                validateField("address", val);
              }}
            />
            {errors.address && <p className="text-red-500">{errors.address}</p>}

            <Label>Map Location *</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="text"
                value={mapLink}
                onClick={() => setOpenPicker(true)}
              />

              <Button
                className="bg-blue-600"
                onClick={() => setOpenPicker(true)}
              >
                Choose Map
              </Button>
            </div>
            {errors.mapLink && <p className="text-red-500">{errors.mapLink}</p>}
          </div>
        </ComponentCard>
      </div>

      <Button className="mt-3 bg-green-600" onClick={handleUpdate}>
        Update
      </Button>

      {openPicker && (
        <div className="fixed inset-0  mt-15 flex items-center justify-center ml-50  bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl  w-[95%] md:w-[800px] p-6 animate-fadeIn">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Select Location
            </h2>

            {/* MAP CONTAINER */}
            <div className="rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 shadow-sm">
              <MapContainer
                center={[lat, lng]}
                zoom={15}
                style={{ height: "350px", width: "100%" }}
                className="rounded-lg"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker
                  lat={lat}
                  lng={lng}
                  setLat={setLat}
                  setLng={setLng}
                />
              </MapContainer>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={() => setOpenPicker(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 
                     rounded-lg font-medium text-gray-700 dark:text-gray-200 transition"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  const link = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=18/${lat}/${lng}`;
                  setMapLink(link);
                  validateField("mapLink", link);
                  setOpenPicker(false);
                }}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium 
                     shadow transition"
              >
                Select Location
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contactus;
