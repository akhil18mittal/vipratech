import type {Industry, UseCase} from '../content/schema';
import {INDUSTRY_ORDER} from '../data/order';

const position = (order: readonly string[], slug: string) => {
  const index = order.indexOf(slug);
  return index === -1 ? order.length : index;
};

export const inOrder = <T extends {slug: string}>(items: readonly T[], order: readonly string[]) =>
  [...items].sort((a, b) => position(order, a.slug) - position(order, b.slug));

/** Use cases whose main capability is `capability`, in industry display order and then each industry's own order. */
export function capabilityUseCases(capability: string, industries: readonly Industry[], useCases: readonly UseCase[]) {
  const bySlug = new Map(useCases.map((useCase) => [useCase.slug, useCase]));
  return inOrder(industries, INDUSTRY_ORDER).flatMap((industry) =>
    industry.use_cases.flatMap((slug) => {
      const useCase = bySlug.get(slug);
      return useCase?.capability === capability ? [useCase] : [];
    }),
  );
}

/** Industries with at least one use case whose main capability is `capability`, in industry display order. */
export function capabilityIndustries(capability: string, industries: readonly Industry[], useCases: readonly UseCase[]) {
  const withCapability = new Set(useCases.filter((useCase) => useCase.capability === capability).map((useCase) => useCase.industry));
  return inOrder(industries, INDUSTRY_ORDER).filter((industry) => withCapability.has(industry.slug));
}
