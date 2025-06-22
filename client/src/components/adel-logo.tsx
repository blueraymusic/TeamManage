interface AdelLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function AdelLogo({ size = "md", className = "" }: AdelLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16",
    xl: "w-24 h-24"
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <div className="w-full h-full relative overflow-hidden rounded-full">
        {/* Main spherical gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800 rounded-full"></div>
        
        {/* Animated gradient stripes */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="absolute top-1 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-70 transform -skew-y-12"></div>
          <div className="absolute top-3 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-60 transform -skew-y-12"></div>
          <div className="absolute top-6 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-indigo-300 to-transparent opacity-50 transform -skew-y-12"></div>
          <div className="absolute top-10 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-60 transform -skew-y-12"></div>
          <div className="absolute bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-70 transform -skew-y-12"></div>
        </div>

        {/* Highlight effect for 3D appearance */}
        <div className="absolute top-1 left-1 w-2/3 h-2/3 bg-gradient-to-br from-white via-blue-100 to-transparent opacity-20 rounded-full blur-sm"></div>
        
        {/* Dark stripes for depth */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-900 to-transparent opacity-40 transform -skew-y-12"></div>
          <div className="absolute top-7 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-900 to-transparent opacity-40 transform -skew-y-12"></div>
          <div className="absolute bottom-4 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-900 to-transparent opacity-40 transform -skew-y-12"></div>
        </div>
      </div>
    </div>
  );
}