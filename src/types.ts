export interface NavLink {
  name: string;
  href: string;
}

/** A card on a content page. Without `href` the card is shown without a link. */
export interface CardItem {
  label?: string;
  title: string;
  text: string;
  href?: string;
  featured?: boolean;
}

/** A pre-rendered diagram in public/diagrams/, with its natural size. */
export interface Diagram {
  src: string;
  width: number;
  height: number;
}

/** The buttons a page offers: its main action, a demo, and WhatsApp. `cta` names the button in the cta_click event. */
export interface ContactLinks {
  primary: {href: string; label: string; cta: string};
  /** The Calendly booking page once it is set up, a demo request email until then. */
  demo: {href: string; cta: string};
  whatsapp: string;
}
