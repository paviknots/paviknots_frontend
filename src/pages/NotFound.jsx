import { Link } from "react-router-dom";
import { FileQuestion, ArrowLeft, Home } from "lucide-react";
import "./NotFound.css";

const NotFound = () => {
  return (
    <section className="NotFound">
      <div className="NotFound-content">
        <div className="NotFound-icon">
          <FileQuestion size={48} strokeWidth={1.3} />
        </div>

        <span className="NotFound-code">404 ERROR</span>

        <h1>
          Page Not <em>Found.</em>
        </h1>

        <p>
          Sorry, the page you're looking for doesn't exist or may have been
          moved. Let's get you back to something beautiful.
        </p>

        <div className="NotFound-actions">
          <Link to="/" className="NotFound-home">
            <Home size={17} />
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
