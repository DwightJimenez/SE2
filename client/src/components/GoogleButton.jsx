import { useGoogleLogin } from "@react-oauth/google";

export default function GoogleButton({ onLoginSuccess, onLoginError }) {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log(tokenResponse);
      if (onLoginSuccess) onLoginSuccess(tokenResponse);
    },
    onError: (error) => {
      console.error("Google Login Failed", error);
      if (onLoginError) onLoginError(error);
    },
  });

  return (
    <button
      onClick={() => login()}
      className="bg-white   text-white py-2 px-4 rounded w-full"
    >
      Sign in with Google
    </button>
  );
}
