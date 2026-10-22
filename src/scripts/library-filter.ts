import {track} from '../lib/analytics';

// Filters the library's cards by industry, capability and search text. The state lives in the URL, so a filtered
// library can be shared or reloaded.

const form = document.querySelector<HTMLFormElement>('#library-filter');

if (form) {
  const items = [...document.querySelectorAll<HTMLElement>('#library-list > li')];
  const empty = document.querySelector<HTMLElement>('#library-empty');
  const query = form.elements.namedItem('q') as HTMLInputElement;
  const industry = form.elements.namedItem('industry') as HTMLSelectElement;
  const capability = form.elements.namedItem('capability') as HTMLSelectElement;
  const fields = {q: query, industry, capability};

  const params = new URLSearchParams(location.search);
  for (const [name, field] of Object.entries(fields)) {
    const value = params.get(name) ?? '';
    // Ignore an unknown industry or capability, which leaves "All …" selected.
    if (field instanceof HTMLInputElement || [...field.options].some((option) => option.value === value)) field.value = value;
  }

  const apply = () => {
    const text = query.value.trim().toLowerCase();
    let shown = 0;
    for (const item of items) {
      const matches =
        (!industry.value || item.dataset.industry === industry.value) &&
        (!capability.value || (item.dataset.capabilities ?? '').split(' ').includes(capability.value)) &&
        (!text || (item.dataset.text ?? '').includes(text));
      item.hidden = !matches;
      if (matches) shown++;
    }
    if (empty) empty.hidden = shown > 0;

    const next = new URLSearchParams();
    for (const [name, field] of Object.entries(fields)) if (field.value.trim()) next.set(name, field.value.trim());
    history.replaceState(null, '', next.size ? `?${next}` : location.pathname);
  };

  form.hidden = false;
  apply();
  form.addEventListener('input', apply);
  form.addEventListener('change', () =>
    track('library_filter', {industry: industry.value, capability: capability.value, has_query: query.value.trim() !== ''}),
  );
  form.addEventListener('submit', (event) => event.preventDefault());
}
