import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function BodyBackgroundWrapper() {
    const location = useLocation();
  
    useEffect(() => {
      // Reset all background classes
      document.body.className = "";
  
      // Apply a background class based on the route
      switch (location.pathname) {
        case "/":
          document.body.classList.add("home-background");
          break;
      
        default:
          break;
      }
      // if (location.pathname === "/") {
      //   document.body.classList.add("home-background");
      // } else if (location.pathname === "/about") {
      //   document.body.classList.add("about-background");
      // }
    }, [location.pathname]);
  
    console.log(`The background here is: ${document.body.className}`)
  
    return null; // This component does not render anything
  }

  export default BodyBackgroundWrapper