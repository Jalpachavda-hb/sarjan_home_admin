// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
// import { ThemeProvider } from "./context/ThemeContext.tsx";
import { useEffect } from "react";
import { fetchWebSetting } from "./utils/Handlerfunctions/getdata.ts";
import { BrowserRouter } from "react-router-dom";

function WebSettingsUpdater() {
  useEffect(() => {
    fetchWebSetting().then((data) => {
      if (data?.favicon) {
        let link: HTMLLinkElement | null =
          document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement("link");
          link.rel = "icon";
          document.head.appendChild(link);
        }
        link.href = data.favicon;
      }

      if (data?.title) {
        document.title = data.title;
      }
    });
  }, []);

  return null;
}

createRoot(document.getElementById("root")!).render(
  <>
    {/* <StrictMode> */}
    {/* <ThemeProvider> */}
    <AppWrapper>
      <BrowserRouter>
        <WebSettingsUpdater />
        <App />
      </BrowserRouter>
    </AppWrapper>
    {/* </ThemeProvider> */}
    {/* </StrictMode>, */}
  </>
);
