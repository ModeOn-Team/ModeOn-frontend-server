import Header from "./Header";

const MainLayout = ({ children, className = "" }) => {
    return (
    <div className="min-h-screen bg-blue-50 flex justify-center">
      <Header/>
      <div className={`w-full mt-16 bg-gray-50 z-0 ${className}`}>{children}</div>
    </div>
  );
};

export default MainLayout;