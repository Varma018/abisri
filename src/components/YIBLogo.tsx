import React from 'react';
import officialLogoImage from '../assets/images/yib_corporate_logo_1789391393070.jpg';

export interface YIBLogoProps {
  variant?: 'dark' | 'light'; // 'dark' for light backgrounds; 'light' for dark backgrounds
  layout?: 'stacked' | 'horizontal' | 'mark-only' | 'full' | 'vertical';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  showTagline?: boolean;
  className?: string;
  id?: string;
}

/**
 * Universal YIB Corporate Logo Component.
 * Directly renders the EXACT, authentic corporate logo uploaded by the user
 * (with the red crane monogram, dark B, YARDS INFRA AND BUILDERS LLP typography, and BUILDING TOMORROW, TODAY tagline).
 */
export const YIBLogo: React.FC<YIBLogoProps> = ({
  variant = 'dark',
  size = 'md',
  className = '',
  id,
}) => {
  const sizeClasses: Record<string, string> = {
    xs: 'h-9 max-w-[140px]',
    sm: 'h-11 max-w-[170px]',
    md: 'h-14 sm:h-16 max-w-[240px]',
    lg: 'h-28 sm:h-36 max-w-[320px]',
    xl: 'h-52 sm:h-64 max-w-[420px]',
    '2xl': 'h-72 sm:h-80 max-w-[520px]',
    full: 'w-full max-w-lg h-auto',
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;

  if (variant === 'light') {
    // For dark backgrounds (such as the Footer), wrap the exact corporate logo in a neat crisp white container
    return (
      <div
        id={id}
        className={`bg-white p-2.5 rounded-lg shadow-md inline-flex items-center justify-center ${className}`}
      >
        <img
          src={officialLogoImage}
          alt="Yards Infra and Builders LLP - Building Tomorrow, Today"
          className={`${selectedSize} w-auto object-contain`}
          loading="eager"
        />
      </div>
    );
  }

  // For light backgrounds (Navbar, Hero section, About page, Modals, Contact section)
  return (
    <div
      id={id}
      className={`inline-flex items-center justify-center ${className}`}
    >
      <img
        src={officialLogoImage}
        alt="Yards Infra and Builders LLP - Building Tomorrow, Today"
        className={`${selectedSize} w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02] mix-multiply`}
        style={{ mixBlendMode: 'multiply' }}
        loading="eager"
      />
    </div>
  );
};

export default YIBLogo;
