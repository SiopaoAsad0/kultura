import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import API from "../api/axios";

export default function ActivityTracker() {
  const location = useLocation();

  useEffect(() => {
    const device = window.innerWidth < 768 ? "mobile" : window.innerWidth < 1024 ? "tablet" : "desktop";
    API.post("/activity/view", {
      path: location.pathname,
      page: document.title || location.pathname,
      device,
    }).catch(() => {});
  }, [location.pathname]);

  return null;
}
