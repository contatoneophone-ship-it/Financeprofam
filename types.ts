
export enum CategoryType {
  FOOD = 'Alimentação',
  LEISURE = 'Lazer',
  HOUSING = 'Moradia',
  TRANSPORT = 'Transporte',
  HEALTH = 'Saúde',
  EDUCATION = 'Educação',
  INVESTMENT = 'Investimento',
  TAXES = 'Impostos',
  FEES = 'Taxas/Serviços',
  SCHOOL_SUPPLIES = 'Material Escolar',
  CLOTHING = 'Vestuário',
  OTHER = 'Outros'
}

export enum TransactionType {
  INCOME = 'RECEITA',
  EXPENSE = 'DESPESA',
  INVESTMENT = 'INVESTIMENTO'
}

export enum PaymentMethod {
  CREDIT = 'CREDITO',
  DEBIT = 'DEBITO',
  CASH = 'DINHEIRO',
  PIX = 'PIX',
  TRANSFER = 'TRANSFERÊNCIA'
}

export enum EntityType {
  PERSON = 'Pessoa',
  COMPANY = 'Empresa'
}

export enum CardType {
  CREDIT = 'Crédito',
  DEBIT = 'Débito'
}

export enum GoalType {
  EMERGENCY = 'Reserva de Emergência',
  OBJECTIVE = 'Objetivo/Meta',
  RETIREMENT = 'Aposentadoria'
}

export interface UserAccount {
  id: string;
  username: string;
  name: string;
  password: string;
}

export interface InvestmentGoal {
  id: string;
  name: string;
  type: GoalType;
  targetTotal: number;
  currentTotal: number;
  monthlyTargetPercent?: number; // Ex: 15% da renda
  color: string;
}

export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  document?: string;
}

export interface Member {
  id: string;
  name: string;
  avatar: string;
  income: number;
}

export interface Card {
  id: string;
  memberId: string;
  type: CardType; 
  name: string;
  lastDigits: string;
  limit: number;
  closingDay: number;
  dueDay: number;
  color: string;
}

export interface Transaction {
  id: string;
  memberId: string;
  entityId?: string; 
  cardId?: string; 
  type: TransactionType;
  paymentMethod: PaymentMethod;
  category: CategoryType;
  description: string;
  amount: number;
  date: string;
  installments?: number;
  currentInstallment?: number;
  parentId?: string;
  goalId?: string; // Vinculo com uma meta de investimento
}

export interface AppState {
  members: Member[];
  cards: Card[];
  entities: Entity[];
  transactions: Transaction[];
  goals: InvestmentGoal[];
  users: UserAccount[];
  theme: 'light' | 'dark';
  isAuthenticated: boolean;
  currentUser: UserAccount | null;
}
