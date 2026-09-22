/**
 * 7 Status Resmi FSM Anggaran / RAB (sesuai backend budget_status)
 */
export const BUDGET_STATUSES = [
  'draft',
  'submitted',
  'review',
  'needs_revision',
  'approved',
  'in_progress',
  'done',
] as const;

export type BudgetStatus = (typeof BUDGET_STATUSES)[number];

/**
 * 2 Jenis Mutasi Kas (Pemasukan & Pengeluaran)
 */
export const TRANSACTION_TYPES = ['income', 'expense'] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

/**
 * 3 Status Iuran Anggota
 */
export const DUES_STATUSES = ['unpaid', 'installment', 'paid'] as const;
export type DuesStatus = (typeof DUES_STATUSES)[number];

/**
 * Rincian Item / Pos Kebutuhan Anggaran
 */
export interface BudgetItem {
  id: string;
  budgetId: string;
  label: string;
  quantity: string;
  unit: string | null;
  unitPrice: string;
  plannedTotal: string;
  realizedTotal?: string | null;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string | null;
}

/**
 * Entitas Proposal Anggaran (RAB)
 */
export interface Budget {
  id: string;
  budgetNumber: string;
  title: string;
  status: BudgetStatus;
  divisionId: string | null;
  divisionName?: string | null;
  programId?: string | null;
  programName?: string | null;
  subunitId?: string | null;
  totalPlanned?: string | number | null;
  totalRealized?: string | number | null;
  reviewNote?: string | null;
  periodId?: string | null;
  requestedBy?: string;
  version: number;
  createdAt: string;
  updatedAt?: string | null;
}

/**
 * Detail Lengkap Proposal Anggaran (termasuk list item rincian)
 */
export interface BudgetDetail extends Budget {
  items: BudgetItem[];
  availableTransitions?: BudgetStatus[];
}

/**
 * Entitas Mutasi Transaksi Kas
 */
export interface Transaction {
  id: string;
  transactionNumber: string;
  transactionType: TransactionType;
  category: string;
  amount: string;
  transactionDate?: string;
  picId?: string | null;
  picName?: string | null;
  programId?: string | null;
  programName?: string | null;
  budgetId?: string | null;
  budgetName?: string | null;
  periodId?: string | null;
  counterparty?: string | null;
  paymentMethod?: string | null;
  proofUrl?: string | null;
  verifiedBy?: string | null;
  verifiedByName?: string | null;
  verifiedAt?: string | null;
  version: number;
  createdAt: string;
  updatedAt?: string | null;
}

/**
 * Rincian Setoran Pembayaran Iuran
 */
export interface DuesPayment {
  id: string;
  duesId: string;
  amount: string;
  paymentDate: string;
  paymentMethod?: string | null;
  proofUrl?: string | null;
  note?: string | null;
  verifiedBy?: string | null;
  verifiedAt?: string | null;
  createdAt: string;
}

/**
 * Entitas Tagihan Iuran Anggota
 */
export interface DuesItem {
  id: string;
  periodId?: string | null;
  periodName?: string | null;
  memberId: string;
  memberName?: string | null;
  memberEmail?: string | null;
  targetAmount: string;
  paidAmount: string;
  status: DuesStatus;
  notes?: string | null;
  payments?: DuesPayment[];
  createdAt: string;
  updatedAt?: string | null;
}

/**
 * Filter Kueri Anggaran
 */
export interface BudgetFilterParams {
  status?: BudgetStatus;
  divisionId?: string;
  periodId?: string;
  limit?: number;
  offset?: number;
}

/**
 * Filter Kueri Transaksi
 */
export interface TransactionFilterParams {
  transactionType?: TransactionType;
  budgetId?: string;
  periodId?: string;
  verified?: boolean;
  limit?: number;
  offset?: number;
}

/**
 * Filter Kueri Iuran
 */
export interface DuesFilterParams {
  status?: DuesStatus;
  memberId?: string;
  periodId?: string;
  limit?: number;
  cursor?: string;
}
