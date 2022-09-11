declare var hasShareWithStudents: boolean | undefined;

interface HTMLDialogElement {
  oncancel?: ((event: Event) => void) | null;
}

interface DocsStyleSheet {
  docs: string;
  slides: string;
  sheets: string;
}
