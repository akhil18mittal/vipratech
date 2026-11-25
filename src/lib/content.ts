import type {UseCase} from '../content/schema';
import {APPROVED_PROOFS} from '../data/proofs';

export const isProofApproved = (id: string | null) => id !== null && APPROVED_PROOFS.includes(id);

/** The label shown on a use case's cards and hero. */
export const statusLabel = (status: UseCase['status']) => (status === 'live' ? 'Live' : 'Early access');
