import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Wrapper to dynamically alter the background of the body element.
 */
function BodyBackgroundWrapper() {
    const location = useLocation();
  
    useEffect(() => {
      // Reset all background classes
      document.body.className = "";
  
      // Apply a background class based on the route
      switch (location.pathname) {
        case "/home":
          document.body.classList.add("home-background");
          break;
      
        default:
          break;
      }

      // console.log(`The background here is: ${document.body.className || "default-background"}`)
      // if (location.pathname === "/") {
      //   document.body.classList.add("home-background");
      // } else if (location.pathname === "/about") {
      //   document.body.classList.add("about-background");
      // }
    }, [location.pathname]);
  
  
    return null; // This component does not render anything
  }

  export default BodyBackgroundWrapper