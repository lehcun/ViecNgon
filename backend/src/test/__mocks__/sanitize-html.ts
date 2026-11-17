function sanitizeHtml(dirty: string): string {
  return dirty;
}

sanitizeHtml.simpleTransform = () => {
  return (tagName: string, attribs: Record<string, string>) => ({
    tagName,
    attribs,
  });
};

export = sanitizeHtml;
