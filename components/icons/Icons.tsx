
import React from 'react';
import { Svg, Path } from 'react-native-svg';

// FIX: Removed styled HOC from nativewind as it is no longer needed. ClassName props can be used directly.

interface IconProps {
  className?: string;
  color?: string;
  size?: number;
}

// FIX: Replaced defaultProps with default parameters in function signature.
export const HomeIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 24 }) => (
  <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} height={size} width={size}>
    <Path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
  </Svg>
);


// FIX: Replaced defaultProps with default parameters in function signature.
export const ListBulletIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 24 }) => (
  <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} height={size} width={size}>
    <Path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </Svg>
);

// FIX: Replaced defaultProps with default parameters in function signature.
export const UserCircleIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 24 }) => (
  <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} height={size} width={size}>
    <Path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
  </Svg>
);

// FIX: Replaced defaultProps with default parameters in function signature.
export const ChatBubbleLeftRightIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 24 }) => (
  <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} height={size} width={size}>
    <Path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.722.28c-.443.034-.864.163-1.24.373a13.5 13.5 0 01-3.26.974c-.58.156-1.19.24-1.808.24s-1.228-.084-1.808-.24a13.5 13.5 0 01-3.26-.974 41.22 41.22 0 01-1.24-.373L3.23 17.28c-1.133-.093-1.98-1.057-1.98-2.193v-4.286c0-.97.616-1.813 1.5-2.097M16.5 9.75c0 .621-.504 1.125-1.125 1.125H8.625c-.621 0-1.125-.504-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125h6.75c.621 0 1.125.504 1.125 1.125v1.5z" />
  </Svg>
);

// FIX: Replaced defaultProps with default parameters in function signature.
export const ShoppingCartIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 24 }) => (
  <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} height={size} width={size}>
    <Path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.328 1.093-.828l2.91-6.616c.213-.482-.14-1.034-.67-1.034H5.378M7.5 14.25L5.106 5.165A1.125 1.125 0 004.02 4.135H2.25" />
  </Svg>
);

// FIX: Replaced defaultProps with default parameters in function signature.
export const TrashIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 20 }) => (
    <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} height={size} width={size}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </Svg>
);

// FIX: Replaced defaultProps with default parameters in function signature.
export const SparklesIcon: React.FC<IconProps> = ({ color = '#10b981', size = 32 }) => (
  <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} height={size} width={size}>
    <Path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 22.5l-.648-1.938a3.375 3.375 0 00-2.672-2.672L11.25 18l1.938-.648a3.375 3.375 0 002.672-2.672L16.25 13.5l.648 1.938a3.375 3.375 0 002.672 2.672L21 18.75l-1.938.648a3.375 3.375 0 00-2.672 2.672z" />
  </Svg>
);


// FIX: Replaced defaultProps with default parameters in function signature.
export const ChevronLeftIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 24 }) => (
    <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} height={size} width={size}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </Svg>
);

// FIX: Replaced defaultProps with default parameters in function signature.
export const MenuIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 24 }) => (
  <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} height={size} width={size}>
    <Path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </Svg>
);

// FIX: Replaced defaultProps with default parameters in function signature.
export const PlusIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 24 }) => (
  <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} height={size} width={size}>
    <Path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </Svg>
);

// FIX: Replaced defaultProps with default parameters in function signature.
export const BellIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 24 }) => (
  <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} height={size} width={size}>
    <Path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
  </Svg>
);
