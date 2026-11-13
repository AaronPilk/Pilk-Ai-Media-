/**
 * Legal documents are plain data so the text can be reviewed in one place and
 * rendered consistently. Inline markup inside any string:
 *   **bold**            strong text
 *   [label](href)       link
 *   {{s:id}}            "section N" link to the section with that id
 *   {{s:id.2}}          "section N.2" (links to section N)
 * An unknown {{s:...}} id fails the build, so cross-references can't go stale
 * when sections are added or reordered.
 */
export type LegalBlock =
  | string
  | { list: string[]; ordered?: boolean }
  | { table: { head: string[]; rows: string[][] } }
  | { callout: string };

export type LegalSubsection = {
  title: string;
  blocks: LegalBlock[];
};

export type LegalSection = {
  id: string;
  title: string;
  blocks?: LegalBlock[];
  subsections?: LegalSubsection[];
};

export type LegalDocument = {
  title: string;
  /** Long-form dates, e.g. "November 13, 2026". */
  effective: string;
  updated: string;
  intro: LegalBlock[];
  sections: LegalSection[];
};
