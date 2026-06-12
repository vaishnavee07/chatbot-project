export function parseStructuredMessage(text) {
  if (!text) return { raw: '' };

  const lines = text.split('\n');
  const sections = [];
  let current = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (current) { sections.push(current); current = null; }
      continue;
    }

    const headingMatch = trimmed.match(/^(📖|📚|🔑|🔗|💡|⚠️)\s+\*\*(.+?)\*\*/);
    const boldOnlyMatch = trimmed.match(/^\*\*(.+?)\*\*$/);

    if (headingMatch) {
      if (current) sections.push(current);
      current = { type: 'section', icon: headingMatch[1], title: headingMatch[2], content: [] };
    } else if (boldOnlyMatch) {
      if (current) sections.push(current);
      current = { type: 'section', icon: null, title: boldOnlyMatch[1], content: [] };
    } else if (trimmed.startsWith('•') || trimmed.startsWith('  •')) {
      const bullet = trimmed.replace(/^•\s*/, '').replace(/^\s*•\s*/, '');
      if (current) {
        current.content.push({ type: 'bullet', text: bullet });
      } else {
        sections.push({ type: 'bullet-standalone', text: bullet });
      }
    } else {
      if (current) {
        current.content.push({ type: 'text', text: trimmed });
      } else {
        sections.push({ type: 'text', text: trimmed });
      }
    }
  }
  if (current) sections.push(current);

  return { sections, raw: text };
}
