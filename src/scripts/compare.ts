// Before/after sliders written as raw HTML in posts (<figure class="compare">): the
// range input lies invisibly over the images, so a click, drag or arrow key moves
// the divider; the buttons swap the image on the right.
for (const fig of document.querySelectorAll<HTMLElement>('figure.compare')) {
  const stage = fig.querySelector<HTMLElement>('.compare-stage');
  const range = fig.querySelector<HTMLInputElement>('.compare-range');
  const after = fig.querySelector<HTMLImageElement>('.compare-after');
  const tag = fig.querySelector<HTMLElement>('.compare-tag-after');
  if (!stage || !range || !after) continue;

  range.addEventListener('input', () => stage.style.setProperty('--pos', `${range.value}%`));

  const buttons = fig.querySelectorAll<HTMLButtonElement>('.compare-tabs button');
  for (const button of buttons) {
    button.addEventListener('click', () => {
      const src = after.dataset[`src${button.dataset.ed?.replace(/^./, (c) => c.toUpperCase())}`];
      if (!src) return;
      after.src = src;
      if (tag && button.dataset.label) tag.textContent = button.dataset.label;
      for (const b of buttons) b.setAttribute('aria-pressed', String(b === button));
    });
  }
}
