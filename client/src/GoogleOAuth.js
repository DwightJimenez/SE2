import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const clientId = "YOUR_GOOGLE_CLIENT_ID"; // Replace with your Google Client ID

const GoogleAuth = () => {
  const handleSuccess = (response) => {
    const token = response.credential;

    // Decode the token to get user info
    const decoded = JSON.parse(atob(token.split(".")[1]));
    const userEmail = decoded.email;

    // Check if email belongs to school domain
    if (userEmail.endsWith("@bicol-u.edu.ph")) {  // Change to your school domain
      localStorage.setItem("verifiedEmail", userEmail);
      window.location.href = "google-form.html"; // Redirect to form
    } else {
      alert("Please sign in with your school email.");
    }
  };

  const handleError = () => {
    alert("Login failed. Try again.");
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
