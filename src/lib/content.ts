import type {UseCase} from '../content/schema';
import {APPROVED_PROOFS} from '../data/proofs';

export const isProofApproved = (id: string | null) => id !== null && APPROVED_PROOFS.includes(id);

const STATUS_LABELS: Record<UseCase['status'], string> = {
  live: 'Live',
  'pilot-ready': 'Pilot-ready',
  'early-access': 'Early access',
};

/** The label shown on a use case's cards and hero. */
export const statusLabel = (status: UseCase['status']) => STATUS_LABELS[status];

/** What each status means, for the use case library and the banners on use-case pages. */
export const STATUS_NOTES: Record<UseCase['status'], string> = {
  live: 'Running for a customer every month today.',
  'pilot-ready':
    'Runs on the same claims engine as our live distributor claims settlement, configured to your policy and documents during a pilot.',
  'early-access': 'Being built with a small number of brands as design partners.',
};

/** Display order of the statuses: live first. */
export const STATUS_ORDER: readonly UseCase['status'][] = ['live', 'pilot-ready', 'early-access'];
