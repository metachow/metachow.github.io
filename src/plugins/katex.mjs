import katex from 'katex';

/**
 * Sätteri mdast plugin: typesets $…$ and $$…$$ (parsed by `features.math`) with KaTeX at
 * build time, so posts ship finished HTML and need only the KaTeX stylesheet, no script.
 * The output goes in as raw `html` nodes, which Markdown does not re-parse.
 */
function render(tex, displayMode, ctx, node) {
  try {
    return katex.renderToString(tex, { displayMode, throwOnError: true, strict: 'warn' });
  } catch (err) {
    ctx.report({ message: `KaTeX: ${err.message}`, node, severity: 'error' });
    return katex.renderToString(tex, { displayMode, throwOnError: false });
  }
}

export const katexPlugin = {
  name: 'katex',
  inlineMath(node, ctx) {
    ctx.replaceNode(node, { type: 'html', value: render(node.value, false, ctx, node) });
  },
  math(node, ctx) {
    ctx.replaceNode(node, { type: 'html', value: render(node.value, true, ctx, node) });
  },
};
