import projections from "@/assets/undraw_projections_fhch.svg";
import investment from "@/assets/undraw_investment-data_frxx.svg";

const AuthLayout = ({ children, type = "login" }) => {
  const bgImage = type === "login" ? projections : investment;

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* LEFT – PURPLE BRAND SECTION */}
      <div className="relative hidden md:flex bg-purple-600 text-white px-16">
        {/* BRAND – TOP LEFT */}
        <div className="absolute top-10 left-16">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Expense-Tracker
          </h1>
        </div>

        {/* CENTER CONTENT */}
        <div className="flex flex-col justify-center">
          <p className="text-sm uppercase tracking-wide text-purple-200 mb-3">
            Secure Expense Platform
          </p>

          <h2 className="text-4xl font-extrabold leading-tight mb-6">
            Track your expenses <br /> with clarity
          </h2>

          <p className="max-w-md text-purple-100 text-lg mb-12">
            A simple, secure and powerful way to manage your daily spending.
          </p>

          <div className="flex gap-12 text-purple-100">
            <div>
              <p className="text-2xl font-bold text-white">100%</p>
              <p className="text-sm">Secure</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">Fast</p>
              <p className="text-sm">Performance</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">Simple</p>
              <p className="text-sm">UI</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT – WHITE AREA WITH SVG BACKGROUND */}
      <div className="relative flex items-center justify-center bg-gray-50 overflow-hidden">
        {/* SVG BACKGROUND */}
        <div
          className="absolute inset-0 bg-no-repeat bg-right-bottom opacity-20"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "520px",
          }}
        />

        {/* AUTH CARD */}
        <div className="relative z-10 w-full max-w-md px-6">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
