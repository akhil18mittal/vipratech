// The header menus are native <details> elements. Opening one closes the others; a click outside or Escape closes all.

const menus = [...document.querySelectorAll<HTMLDetailsElement>('details[data-nav-menu]')];

const closeAll = (except?: HTMLDetailsElement) => {
  for (const menu of menus) if (menu !== except) menu.open = false;
};

for (const menu of menus) {
  menu.addEventListener('toggle', () => {
    if (menu.open) closeAll(menu);
  });
}

document.addEventListener('click', (event) => {
  if (!(event.target as Element).closest('details[data-nav-menu]')) closeAll();
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  const open = menus.find((menu) => menu.open);
  if (!open) return;
  open.open = false;
  open.querySelector('summary')?.focus();
});
