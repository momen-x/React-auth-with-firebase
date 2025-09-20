import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";
import { deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import moment from "moment";
import ResetPasswordDialog from "./Reset-Password";

const ProfilePage = () => {
  const [user] = useAuthState(auth);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!user) return;

    const confirmed = window.confirm(
      `⚠️ WARNING: This action cannot be undone!\n\nAre you sure you want to permanently delete your account?\n\nEmail: ${user.email}\nAll your data will be lost forever.`
    );

    if (!confirmed) return;

 
    const currentPassword = window.prompt(
      "For security, please enter your current password to confirm account deletion:"
    );

    if (!currentPassword) {
      alert("Password is required to delete your account.");
      return;
    }

    setIsDeleting(true);

    try {
      
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      await reauthenticateWithCredential(user, credential);

     
      await deleteUser(user);

      alert("Your account has been successfully deleted.");
   
    } catch (error: any) {
      console.error("Delete account error:", error);
      
      switch (error.code) {
        case "auth/wrong-password":
          alert("Incorrect password. Account deletion cancelled.");
          break;
        case "auth/requires-recent-login":
          alert("Please sign out and sign in again, then try deleting your account.");
          break;
        case "auth/too-many-requests":
          alert("Too many failed attempts. Please try again later.");
          break;
        default:
          alert("An error occurred while deleting your account. Please try again.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user) {
    return (
      <div style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <>
      <div style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      
      }}>
        <div style={{
        
          padding: "40px",
          borderRadius: "15px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          maxWidth: "500px",
          width: "90%"
        }}>
          <div style={{
            marginBottom: "30px",
            paddingBottom: "20px",
            borderBottom: "2px solid #f0f0f0"
          }}>
            <h1 style={{ 
              marginBottom: "10px",
              fontSize: "2rem"
            }}>
              Welcome, {user.displayName || "User"}! 👋
            </h1>
            <p style={{ fontSize: "1.1rem" }}>
              Your Profile Information
            </p>
          </div>

          <div style={{ 
            textAlign: "left", 
            marginBottom: "30px",
            padding: "20px",
            borderRadius: "10px"
          }}>
            <div style={{ marginBottom: "15px" }}>
              <strong >📧 Email:</strong>
              <span style={{ marginLeft: "10px" }}>{user.email}</span>
            </div>
            
            <div style={{ marginBottom: "15px" }}>
              <strong >👤 Display Name:</strong>
              <span style={{ marginLeft: "10px" }}>
                {user.displayName || "Not set"}
              </span>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <strong style={{  }}>🕐 Last Sign-in:</strong>
              <span style={{ marginLeft: "10px", }}>
                {moment(user.metadata?.lastSignInTime).format('MMM Do YY, h:mm A')}
              </span>
            </div>

            <div>
              <strong >📅 Account Created:</strong>
              <span style={{ marginLeft: "10px"}}>
                {moment(user.metadata?.creationTime).format('MMMM Do YYYY, h:mm A')}
              </span>
            </div>
          </div>

          <div style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap"
          }}>
            <button
              onClick={() => setIsResetPasswordOpen(true)}
              style={{
                padding: "12px 24px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                transition: "background-color 0.2s",
                minWidth: "150px"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#0056b3"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#007bff"}
            >
              🔒 Reset Password
            </button>

            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              style={{
                padding: "12px 24px",
                backgroundColor: isDeleting ? "#ccc" : "#dc3545",
              
                border: "none",
                borderRadius: "8px",
                cursor: isDeleting ? "not-allowed" : "pointer",
                fontSize: "14px",
                fontWeight: "500",
                transition: "background-color 0.2s",
                minWidth: "150px"
              }}
              onMouseEnter={(e) => {
                if (!isDeleting) {
                  e.currentTarget.style.backgroundColor = "#c82333";
                }
              }}
              onMouseLeave={(e) => {
                if (!isDeleting) {
                  e.currentTarget.style.backgroundColor = "#dc3545";
                }
              }}
            >
              {isDeleting ? "⏳ Deleting..." : "🗑️ Delete Account"}
            </button>
          </div>

          <div style={{
            marginTop: "20px",
            padding: "15px",
          
            border: "1px solid #ffeaa7",
            borderRadius: "8px",
            fontSize: "12px",
          
          }}>
            <strong>⚠️ Security Note:</strong> Both actions require your current password for verification.
          </div>
        </div>
      </div>

      {/* Reset Password Dialog */}
      <ResetPasswordDialog 
        isOpen={isResetPasswordOpen}
        onClose={() => setIsResetPasswordOpen(false)}
      />
    </>
  );
};

export default ProfilePage;