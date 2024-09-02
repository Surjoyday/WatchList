import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// function Test() {
//   const [movieRating, setMovieRating] = useState(0);
//   return (
//     <div>
//       <StartRating maxRating={5} />
//       <p>You rated {movieRating}</p>
//     </div>
//   );
// }

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     {/* <Test /> */}
//     <App />
//     {/* <StartRating maxRating={10} /> */}
//   </StrictMode>
// );
