import { useLocation, useNavigate } from "react-router-dom";
import SignInModal from "@/components/SignInModal";

const SignInPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Save intended path (default to dashboard)
  const from = location.state?.from?.pathname || "/dashboard";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <SignInModal
         isOpen={true}
        onClose={() => navigate(-1)}
        onSwitchToSignUp={() => {}}
        redirectTo={from} // <-- pass it to modal
      />
    </div>
  );
};

export default SignInPage;
