interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'light' | 'dark';
  showText?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'h-[24px]',
  md: 'h-[42px]',
  lg: 'h-[48px]',
  xl: 'h-[78px]'
};

const textSizeClasses = {
  sm: 'text-[18px]',
  md: 'text-[21px]',
  lg: 'text-[36px]',
  xl: 'text-[62px]'
};

export function Logo({ 
  size = 'md', 
  showText = true, 
  className = '' 
}: LogoProps) {
  const iconHeight = sizeClasses[size];
  const textSize = textSizeClasses[size];

  return (
    <div className={`flex items-center -gap-[10px] ${className}`}>
        <div className={`${iconHeight} aspect-square -mr-[7px]`}>
        <svg
            viewBox="0 0 48 48"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Code brackets */}
            <path
            d="M16 18L12 24L16 30"
            stroke="#F1F1F1"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            />
            <path
            d="M32 18L36 24L32 30"
            stroke="#F1F1F1"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            />

            {/* Therefore symbol dots */}
            <circle cx="24" cy="20" r="1.5" fill="#9167e0e8" />
            <circle cx="22" cy="26" r="1.5" fill="#9167e0e8" />
            <circle cx="26" cy="26" r="1.5" fill="#9167e0e8" />
        </svg>
        </div>

        {showText && (
        <div className={`${textSize} font-medium`} style={{ color: '#F1F1F1' }}>
            <span>dev</span>
            <span style={{ color: '#9167e0e8' }}>Hub</span>
        </div>
        )}
    </div>
    );
}