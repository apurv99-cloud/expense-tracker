import { useLayoutEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaHome,
  FaMoneyBill,
  FaCreditCard,
  FaList,
  FaUser,
  FaBars,
  FaTimes,
} from "react-icons/fa";

/* ✅ USE ABSOLUTE PATHS ONLY */
const navItems = [
  { label: "Dashboard", icon: <FaHome />, path: "/dashboard" },
  { label: "Income", icon: <FaMoneyBill />, path: "income" },
  { label: "Expense", icon: <FaCreditCard />, path: "expense" },
  { label: "Transactions", icon: <FaList />, path: "transaction" },
  { label: "Profile", icon: <FaUser />, path: "profile" },
];

const Sidebar = () => {
  const location = useLocation();
  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [pill, setPill] = useState({ width: 0, left: 0 });
  const [open, setOpen] = useState(false);

  /* 🔹 ACTIVE TAB FROM URL */
  useLayoutEffect(() => {
    const idx = navItems.findIndex((i) => location.pathname.startsWith(i.path));
    setActiveIndex(idx === -1 ? 0 : idx);
  }, [location.pathname]);

  /* 🔹 DESKTOP FLOATING PILL */
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const index = hoverIndex ?? activeIndex;
    const item = itemRefs.current[index];
    const container = containerRef.current;

    if (item && container) {
      const itemRect = item.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      setPill({
        width: itemRect.width,
        left: itemRect.left - containerRect.left,
      });
    }
  }, [activeIndex, hoverIndex]);

  return (
    <>
      {/* ================= MOBILE TOP BAR ================= */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50">
        <div
          className="flex items-center gap-3 px-4 py-3
                        bg-white/90 backdrop-blur-lg shadow-sm"
        >
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg bg-white shadow"
          >
            <FaBars size={18} />
          </button>

          <h1 className="font-semibold text-gray-800 text-base">
            Expense Tracker
          </h1>
        </div>
      </div>

      {/* ================= MOBILE DRAWER ================= */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40">
          <div className="bg-white w-72 h-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-lg">Navigation</h3>
              <button onClick={() => setOpen(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium
                     ${
                       isActive
                         ? "bg-[#875cf5] text-white"
                         : "text-gray-700 hover:bg-gray-100"
                     }`
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= DESKTOP NAVBAR ================= */}
      <div className="hidden md:block fixed top-4 left-1/2 -translate-x-1/2 z-40">
        <div
          ref={containerRef}
          className="relative flex items-center
                     bg-white shadow-xl rounded-full px-2 py-2"
          onMouseLeave={() => setHoverIndex(null)}
        >
          {/* FLOATING PILL */}
          <div
            className="absolute top-2 bottom-2 rounded-full bg-[#875cf5]
                       transition-all duration-300 ease-out
                       pointer-events-none"
            style={{
              width: pill.width,
              transform: `translateX(${pill.left}px)`,
            }}
          />

          {navItems.map((item, index) => {
            const isActive = (hoverIndex ?? activeIndex) === index;

            return (
              <NavLink
                key={item.label}
                to={item.path}
                className="relative z-10"
              >
                <span
                  ref={(el) => (itemRefs.current[index] = el)}
                  onMouseEnter={() => setHoverIndex(index)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full
                              font-medium transition-colors duration-300
                              ${
                                isActive
                                  ? "text-white"
                                  : "text-gray-700 hover:text-black"
                              }`}
                >
                  {item.icon}
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
