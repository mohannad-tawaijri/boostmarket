export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  avatar?: string;
  bio?: string;
  verified: boolean;
  boosterProfile?: BoosterProfile;
  createdAt: Date;
}

export interface BoosterProfile {
  id: string;
  userId: string;
  rating: number;
  completedOrders: number;
  totalEarnings: number;
  verified: boolean;
  availableForHire: boolean;
  games: string[];
  ranks?: any;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  category: ServiceCategory;
  game: string;
  price: number;
  deliveryTime: string;
  boosterId: string;
  booster?: User;
  active: boolean;
  featured: boolean;
  allowDirectPurchase: boolean;
  stock?: number | null;
  images: string[];
  requirements?: any;
  reviews?: Review[];
  createdAt: Date;
}

export type ServiceCategory =
  | 'RANK_BOOST'
  | 'COACHING'
  | 'ACCOUNT_LEVELING'
  | 'PLACEMENT_MATCHES'
  | 'DUOQ'
  | 'ITEMS'
  | 'CUSTOM'
  | 'WIN_BOOST'
  | 'OTHER';

export interface Order {
  id: string;
  serviceId: string;
  service?: Service;
  buyerId: string;
  buyer?: User;
  boosterId: string;
  booster?: User;
  status: OrderStatus;
  price: number;
  requirements?: any;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
}

export type OrderStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DISPUTED';

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionId?: string;
  status: string;
  createdAt: Date;
}

export interface Review {
  id: string;
  serviceId: string;
  orderId: string;
  reviewerId: string;
  reviewer?: User;
  boosterId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}

export type OfferStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED' | 'CANCELLED';

export interface CustomOffer {
  id: string;
  title: string;
  description?: string;
  price: number;
  deliveryTime: string;
  status: OfferStatus;
  senderId: string;
  receiverId: string;
  serviceId?: string;
  orderId?: string;
  expiresAt?: Date;
  respondedAt?: Date;
  createdAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender?: User;
  content?: string;
  imageUrl?: string;
  customOffer?: CustomOffer;
  read: boolean;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  participants: User[];
  messages: Message[];
  lastMessage?: Message;
  createdAt: Date;
  updatedAt: Date;
}

export enum GameCategory {
  LEAGUE_OF_LEGENDS = 'LEAGUE_OF_LEGENDS',
  VALORANT = 'VALORANT',
  CS2 = 'CS2',
  DOTA2 = 'DOTA2',
  OVERWATCH = 'OVERWATCH',
  APEX_LEGENDS = 'APEX_LEGENDS',
  FORTNITE = 'FORTNITE',
  ROCKET_LEAGUE = 'ROCKET_LEAGUE',
  RAINBOW_SIX = 'RAINBOW_SIX',
  COD_WARZONE = 'COD_WARZONE',
  PUBG = 'PUBG',
  OTHER = 'OTHER',
}

export const GAME_NAMES: Record<GameCategory, string> = {
  [GameCategory.LEAGUE_OF_LEGENDS]: 'League of Legends',
  [GameCategory.VALORANT]: 'Valorant',
  [GameCategory.CS2]: 'CS2',
  [GameCategory.DOTA2]: 'Dota 2',
  [GameCategory.OVERWATCH]: 'Overwatch 2',
  [GameCategory.APEX_LEGENDS]: 'Apex Legends',
  [GameCategory.FORTNITE]: 'Fortnite',
  [GameCategory.ROCKET_LEAGUE]: 'Rocket League',
  [GameCategory.RAINBOW_SIX]: 'Rainbow Six Siege',
  [GameCategory.COD_WARZONE]: 'Call of Duty: Warzone',
  [GameCategory.PUBG]: 'PUBG',
  [GameCategory.OTHER]: 'أخرى',
};

export const GAME_IMAGES: Record<GameCategory, string> = {
  [GameCategory.LEAGUE_OF_LEGENDS]: '/games/league-of-legends.svg',
  [GameCategory.VALORANT]: '/games/valorant.svg',
  [GameCategory.CS2]: '/games/cs2.svg',
  [GameCategory.DOTA2]: '/games/dota2.svg',
  [GameCategory.OVERWATCH]: '/games/overwatch2.svg',
  [GameCategory.APEX_LEGENDS]: '/games/apex-legends.svg',
  [GameCategory.FORTNITE]: '/games/fortnite.svg',
  [GameCategory.ROCKET_LEAGUE]: '/games/rocket-league.svg',
  [GameCategory.RAINBOW_SIX]: '/games/rainbow-six.svg',
  [GameCategory.COD_WARZONE]: '/games/warzone.svg',
  [GameCategory.PUBG]: '/games/pubg.svg',
  [GameCategory.OTHER]: '',
};

export const CATEGORY_NAMES: Record<ServiceCategory, string> = {
  RANK_BOOST: 'رفع الرانك',
  COACHING: 'تدريب',
  ACCOUNT_LEVELING: 'تلفليل الحساب',
  PLACEMENT_MATCHES: 'مباريات التصنيف',
  DUOQ: 'لعب ثنائي',
  WIN_BOOST: 'رفع فوزات',
  ITEMS: 'بيع أغراض',
  CUSTOM: 'مخصص',
  OTHER: 'أخرى',
};
