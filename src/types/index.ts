export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  avatar?: string;
  bio?: string;
  verified: boolean;
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
  tags?: string[];
  boosterId: string;
  booster?: User;
  active: boolean;
  featured: boolean;
  images: string[];
  requirements?: any;
  reviews?: Review[];
  createdAt: Date;
}

export type ServiceCategory =
  | 'RANK_BOOST'
  | 'COACHING'
  | 'ACCOUNT_LEVELING'
  | 'WIN_BOOST'
  | 'PLACEMENT_MATCHES'
  | 'DUOQ'
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

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender?: User;
  content: string;
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
  CSGO = 'CSGO',
  DOTA2 = 'DOTA2',
  OVERWATCH = 'OVERWATCH',
  APEX_LEGENDS = 'APEX_LEGENDS',
  FORTNITE = 'FORTNITE',
  ROCKET_LEAGUE = 'ROCKET_LEAGUE',
  RAINBOW_SIX = 'RAINBOW_SIX',
  COD_WARZONE = 'COD_WARZONE',
  OTHER = 'OTHER',
}

export const GAME_NAMES: Record<GameCategory, string> = {
  [GameCategory.LEAGUE_OF_LEGENDS]: 'League of Legends',
  [GameCategory.VALORANT]: 'Valorant',
  [GameCategory.CSGO]: 'CS:GO',
  [GameCategory.DOTA2]: 'Dota 2',
  [GameCategory.OVERWATCH]: 'Overwatch',
  [GameCategory.APEX_LEGENDS]: 'Apex Legends',
  [GameCategory.FORTNITE]: 'Fortnite',
  [GameCategory.ROCKET_LEAGUE]: 'Rocket League',
  [GameCategory.RAINBOW_SIX]: 'Rainbow Six Siege',
  [GameCategory.COD_WARZONE]: 'Call of Duty: Warzone',
  [GameCategory.OTHER]: 'Other',
};

export const CATEGORY_NAMES: Record<ServiceCategory, string> = {
  RANK_BOOST: 'Rank Boost',
  COACHING: 'Coaching',
  ACCOUNT_LEVELING: 'Account Leveling',
  WIN_BOOST: 'Win Boost',
  PLACEMENT_MATCHES: 'Placement Matches',
  DUOQ: 'Duo Queue',
  OTHER: 'Other',
};
