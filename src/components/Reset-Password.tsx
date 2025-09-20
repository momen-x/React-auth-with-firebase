import { useState, type FormEvent } from "react";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";

interface ResetPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResetPasswordDialog = ({ isOpen, onClose }: ResetPasswordDialogProps) => {
  const [user] = useAuthState(auth);
  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    general: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearForm = () => {
    setPassword({
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setErrors({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      general: ""
    });
  };

  const validateForm = () => {
    const newErrors = {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      general: ""
    };
    let isValid = true;

    if (!password.oldPassword) {
      newErrors.oldPassword = "Current password is required";
      isValid = false;
    }

    if (!password.newPassword) {
      newErrors.newPassword = "New password is required";
      isValid = false;
    } else if (password.newPassword.length < 6) {
      newErrors.newPassword = "New password must be at least 6 characters";
      isValid = false;
    }

    if (!password.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
      isValid = false;
    } else if (password.newPassword !== password.confirmPassword) {
      newErrors.confirmPassword = "New passwords don't match";
      isValid = false;
    }

    if (password.oldPassword === password.newPassword) {
      newErrors.newPassword = "New password must be different from current password";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) return;

    setIsSubmitting(true);
    setErrors({ oldPassword: "", newPassword: "", confirmPassword: "", general: "" });

    try {
   
      const credential = EmailAuthProvider.credential(user.email!, password.oldPassword);
      await reauthenticateWithCredential(user, credential);

 
      await updatePassword(user, password.newPassword);

      alert("Password updated successfully!");
      clearForm();
      onClose();
    } catch (error: any) {
      console.error("Password reset error:", error);
      
      switch (error.code) {
        case "auth/wrong-password":
          setErrors(prev => ({ ...prev, oldPassword: "Current password is incorrect" }));
          break;
        case "auth/weak-password":
          setErrors(prev => ({ ...prev, newPassword: "New password is too weak" }));
          break;
        case "auth/requires-recent-login":
          setErrors(prev => ({ ...prev, general: "Please sign out and sign in again before changing your password" }));
          break;
        case "auth/too-many-requests":
          setErrors(prev => ({ ...prev, general: "Too many failed attempts. Please try again later" }));
          break;
        default:
          setErrors(prev => ({ ...prev, general: "An error occurred. Please try again" }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      clearForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1000,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
        onClick={handleClose}
      >
    
        <div 
          style={{
            backgroundColor: "white",
            borderRadius: "10px",
            padding: "30px",
            width: "90%",
            maxWidth: "500px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            position: "relative"
          }}
          onClick={(e) => e.stopPropagation()}
        >
        
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            style={{
              position: "absolute",
              top: "15px",
              right: "15px",
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              color: "#666",
              opacity: isSubmitting ? 0.5 : 1
            }}
          >
            ×
          </button>

          <h2 style={{ marginBottom: "20px", color: "#333" }}>Reset Password</h2>

          {errors.general && (
            <div style={{
              backgroundColor: "#f8d7da",
              color: "#721c24",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "15px",
              fontSize: "14px"
            }}>
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "15px" }}>
              <label 
                htmlFor="oldPassword" 
                style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}
              >
                Current Password
              </label>
              <input 
                type="password" 
                id="oldPassword" 
                name="oldPassword" 
                value={password.oldPassword}
                onChange={(e) => setPassword({...password, oldPassword: e.target.value})}
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: errors.oldPassword ? "1px solid #dc3545" : "1px solid #ddd",
                  borderRadius: "5px",
                  fontSize: "14px",
                  opacity: isSubmitting ? 0.7 : 1
                }}
                placeholder="Enter your current password"
              />
              {errors.oldPassword && (
                <p style={{ fontSize: "12px", color: "#dc3545", marginTop: "5px", marginBottom: "0" }}>
                  {errors.oldPassword}
                </p>
              )}
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label 
                htmlFor="newPassword" 
                style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}
              >
                New Password
              </label>
              <input 
                type="password" 
                id="newPassword" 
                name="newPassword" 
                value={password.newPassword}
                onChange={(e) => setPassword({...password, newPassword: e.target.value})}
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: errors.newPassword ? "1px solid #dc3545" : "1px solid #ddd",
                  borderRadius: "5px",
                  fontSize: "14px",
                  opacity: isSubmitting ? 0.7 : 1
                }}
                placeholder="Enter your new password (min 6 characters)"
              />
              {errors.newPassword && (
                <p style={{ fontSize: "12px", color: "#dc3545", marginTop: "5px", marginBottom: "0" }}>
                  {errors.newPassword}
                </p>
              )}
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label 
                htmlFor="confirmPassword" 
                style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}
              >
                Confirm New Password
              </label>
              <input 
                type="password" 
                id="confirmPassword" 
                name="confirmPassword" 
                value={password.confirmPassword}
                onChange={(e) => setPassword({...password, confirmPassword: e.target.value})}
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: errors.confirmPassword ? "1px solid #dc3545" : "1px solid #ddd",
                  borderRadius: "5px",
                  fontSize: "14px",
                  opacity: isSubmitting ? 0.7 : 1
                }}
                placeholder="Confirm your new password"
              />
              {errors.confirmPassword && (
                <p style={{ fontSize: "12px", color: "#dc3545", marginTop: "5px", marginBottom: "0" }}>
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button 
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                style={{
                  padding: "10px 20px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  backgroundColor: "#f8f9fa",
                  color: "#333",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  opacity: isSubmitting ? 0.5 : 1
                }}
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  backgroundColor: isSubmitting ? "#ccc" : "#007bff",
                  color: "white",
                  cursor: isSubmitting ? "not-allowed" : "pointer"
                }}
              >
                {isSubmitting ? "Updating..." : "Reset Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordDialog;