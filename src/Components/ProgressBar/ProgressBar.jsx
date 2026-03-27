import { useEffect } from "react";
import NProgress from "nprogress";
import { useLocation } from "react-router-dom";

const ProgressBar = () => {
  const location = useLocation();

  useEffect(() => {
    NProgress.start();

    const timer = setTimeout(() => {
      NProgress.done();
    }, 300);

    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [location]);

  return null;
};

export default ProgressBar;