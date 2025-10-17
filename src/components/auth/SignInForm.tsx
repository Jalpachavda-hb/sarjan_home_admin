

// import { useState } from "react";
// import { FiEye, FiEyeOff } from "react-icons/fi";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { handleLoginSubmit } from "../../utils/Handlerfunctions/formSubmitHandlers";

// const Login = () => {
//   const [contact, setContact] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState<{ contact?: string; password?: string }>(
//     {}
//   );

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
//         <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
//           Sarjan Home Admin Login
//         </h2>

//         <form
//           onSubmit={(e) =>
//             handleLoginSubmit({ e, contact, password, setErrors, setLoading })
//           }
//           className="space-y-5"
//         >
//           {/* Contact */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Contact Number
//             </label>
//             <input
//               type="text"
//               value={contact}
//               onChange={(e) => {
//                 const val = e.target.value.replace(/\D/g, ""); // only digits
//                 if (val.length <= 10) {
//                   setContact(val);
//                   setErrors((prev) => ({ ...prev, contact: undefined })); // 🔥 clear contact error
//                 }
//               }}
//               maxLength={10}
//               placeholder="Enter your contact number"
//               className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                 errors.contact ? "border-red-500" : ""
//               }`}
//             />
//             {errors.contact && (
//               <p className="text-red-500 text-sm mt-1">{errors.contact}</p>
//             )}
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 value={password}
//                 onChange={(e) => {
//                   setPassword(e.target.value);
//                   setErrors((prev) => ({ ...prev, password: undefined }));
//                 }}
//                 placeholder="Enter your password"
//                 className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 ${
//                   errors.password ? "border-red-500" : ""
//                 }`}
//               />
             
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
//               >
//                 {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
//               </button>
//             </div>
//             {errors.password && (
//               <p className="text-red-500 text-sm mt-1">{errors.password}</p>
//             )}
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-2 rounded-lg font-semibold transition text-white ${
//               loading
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-blue-600 hover:bg-blue-700"
//             }`}
//           >
//             {loading ? "Signing in..." : "Sign In"}
//           </button>
//         </form>
//       </div>
//       <ToastContainer position="top-right" />
//     </div>
//   );
// };

// export default Login;


import { useState, FormEvent } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
// import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handleLoginSubmit } from "../../utils/Handlerfunctions/formSubmitHandlers";

// Define the type for the error messages
interface LoginErrors {
  contact?: string;
  password?: string;
}

const Login: React.FC = () => {
  const [contact, setContact] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<LoginErrors>({});

  // Wrapper to handle TS event type
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    handleLoginSubmit({
      e,
      contact,
      password,
      setErrors,
      setLoading,
    });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Left side - Golden themed background */}
      <div
        className="hidden md:flex w-1/2 bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center text-white px-10">
          <h1 className="text-4xl font-bold mb-3 text-[#ffffff] drop-shadow-md">
            Welcome to Sarjan Homes
          </h1>
          <p className="text-lg text-gray-200 max-w-md">
            Manage your premium properties and clients with confidence.
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 border-t-4 border-[#ae8643]">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Sarjan Home
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Sign in to access your dashboard
          </p>

          <form onSubmit={onSubmit} className="space-y-5">
            {/* Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number
              </label>
              <input
                type="text"
                value={contact}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  if (val.length <= 10) {
                    setContact(val);
                    setErrors((prev) => ({ ...prev, contact: undefined }));
                  }
                }}
                maxLength={10}
                placeholder="Enter your contact number"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ae8643] ${
                  errors.contact ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.contact && (
                <p className="text-red-500 text-sm mt-1">{errors.contact}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ae8643] pr-10 ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-[#ae8643]"
                >
                  {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg font-semibold transition text-white shadow-md ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#ae8643] hover:bg-[#946d35]"
              }`}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>

      {/* <ToastContainer position="top-right" /> */}
    </div>
  );
};

export default Login;