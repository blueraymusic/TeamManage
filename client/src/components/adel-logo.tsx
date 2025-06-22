import logoImage from "@assets/logoO_1750628737384.png";

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
    <div className={`flex items-center space-x-3 ${className}`}>
      <img 
        src={logoImage} 
        alt="ADEL Logo"
        className={`${sizeClasses[size]} object-contain`}
      />
      <div className="text-2xl font-bold text-blue-600">ADEL</div>
    </div>
  );
}