import Footer from "../components/Footer";

export default function Auth() {
  const handleSignIn = () => {
    window.location.href = "http://localhost:3001/auth/github";
  };

  return (
    <>
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-[40px] rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.1)] text-center space-y-[24px]">
        <h2 className="text-[25px]">Sign in to DevHub</h2>
        <button onClick={handleSignIn} className="py-[12px] px-[24px] rounded-[8px] bg-[green] shadow-[0_12px_10px_rgba(0,0,0,0.1)]" >
          Sign in with GitHub
        </button>
      </div>
    </div>
    <Footer/>
    </>
  );
}