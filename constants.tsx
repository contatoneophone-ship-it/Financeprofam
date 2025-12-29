
import React from 'react';
import { 
  Utensils, Gamepad2, Home, Bus, Activity, GraduationCap, 
  TrendingUp, Package, Receipt, Gavel, PencilRuler, Shirt 
} from 'lucide-react';
import { CategoryType } from './types';

export const CATEGORY_ICONS: Record<CategoryType, React.ReactNode> = {
  [CategoryType.FOOD]: <Utensils className="w-5 h-5" />,
  [CategoryType.LEISURE]: <Gamepad2 className="w-5 h-5" />,
  [CategoryType.HOUSING]: <Home className="w-5 h-5" />,
  [CategoryType.TRANSPORT]: <Bus className="w-5 h-5" />,
  [CategoryType.HEALTH]: <Activity className="w-5 h-5" />,
  [CategoryType.EDUCATION]: <GraduationCap className="w-5 h-5" />,
  [CategoryType.INVESTMENT]: <TrendingUp className="w-5 h-5" />,
  [CategoryType.TAXES]: <Gavel className="w-5 h-5" />,
  [CategoryType.FEES]: <Receipt className="w-5 h-5" />,
  [CategoryType.SCHOOL_SUPPLIES]: <PencilRuler className="w-5 h-5" />,
  [CategoryType.CLOTHING]: <Shirt className="w-5 h-5" />,
  [CategoryType.OTHER]: <Package className="w-5 h-5" />,
};

export const CATEGORY_COLORS: Record<CategoryType, string> = {
  [CategoryType.FOOD]: '#F87171',
  [CategoryType.LEISURE]: '#FB923C',
  [CategoryType.HOUSING]: '#60A5FA',
  [CategoryType.TRANSPORT]: '#34D399',
  [CategoryType.HEALTH]: '#F472B6',
  [CategoryType.EDUCATION]: '#A78BFA',
  [CategoryType.INVESTMENT]: '#FACC15',
  [CategoryType.TAXES]: '#94A3B8',
  [CategoryType.FEES]: '#818CF8',
  [CategoryType.SCHOOL_SUPPLIES]: '#FB7185',
  [CategoryType.CLOTHING]: '#2DD4BF',
  [CategoryType.OTHER]: '#94A3B8',
};

export const AVATARS = [
  'https://picsum.photos/seed/1/200',
  'https://picsum.photos/seed/2/200',
  'https://picsum.photos/seed/3/200',
  'https://picsum.photos/seed/4/200',
  'https://picsum.photos/seed/5/200',
];

export const INITIAL_MEMBERS = [
  { id: '1', name: 'João', avatar: AVATARS[0], income: 5000 },
  { id: '2', name: 'Maria', avatar: AVATARS[1], income: 4500 },
];
