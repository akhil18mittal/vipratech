import type {UseCase} from '../content/schema';
import {CATEGORIES} from '../data/categories';
import {APPROVED_PROOFS} from '../data/proofs';

export const isProofApproved = (id: string | null) => id !== null && APPROVED_PROOFS.includes(id);

/** The label shown on a use case's cards and hero: its category. */
export const categoryLabel = (category: UseCase['category']) => CATEGORIES[category].label;

/** Whether a use case has an approved, published customer deployment behind it. */
export const isInProduction = (useCase: Pick<UseCase, 'proof_ref'>) => isProofApproved(useCase.proof_ref);
