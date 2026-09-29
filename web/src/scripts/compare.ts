/**
 * <gubia-compare> — before/after slider (~vanilla, progressive enhancement)
 */
class GubiaCompare extends HTMLElement {
  #range: HTMLInputElement | null = null;
  #after: HTMLElement | null = null;
  #handle: HTMLElement | null = null;
  #reduced = false;
  #animated = false;

  connectedCallback() {
    this.#range = this.querySelector('[data-compare-range]');
    this.#after = this.querySelector('[data-compare-after]');
    this.#handle = this.querySelector('[data-compare-handle]');
    if (!this.#range || !this.#after) return;

    this.classList.add('is-enhanced');
    this.#reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.#range.addEventListener('input', () => this.#apply(Number(this.#range!.value)));
    this.#apply(Number(this.#range.value));
    this.#updateValueText();

    this.#range.addEventListener('keydown', (e) => {
      const el = this.#range!;
      let v = Number(el.value);
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') v -= 1;
      else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') v += 1;
      else if (e.key === 'PageDown') v -= 10;
      else if (e.key === 'PageUp') v += 10;
      else if (e.key === 'Home') v = 0;
      else if (e.key === 'End') v = 100;
      else return;
      e.preventDefault();
      el.value = String(Math.min(100, Math.max(0, v)));
      this.#apply(Number(el.value));
      this.#updateValueText();
    });

    if (!this.#reduced && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && !this.#animated) {
              this.#animated = true;
              this.#nudge();
              io.disconnect();
            }
          }
        },
        { threshold: 0.4 },
      );
      io.observe(this);
    }
  }

  #apply(value: number) {
    if (!this.#after || !this.#handle) return;
    this.#after.style.clipPath = `inset(0 0 0 ${value}%)`;
    this.#handle.style.left = `${value}%`;
    this.#updateValueText();
  }

  #updateValueText() {
    if (!this.#range) return;
    const v = Number(this.#range.value);
    const beforeLabel = this.dataset.labelBefore ?? 'Antes';
    const afterLabel = this.dataset.labelAfter ?? 'Después';
    this.#range.setAttribute('aria-valuetext', `${beforeLabel} ${v} % · ${afterLabel} ${100 - v} %`);
  }

  #nudge() {
    if (!this.#range) return;
    const start = Number(this.#range.value);
    const target = 35;
    const duration = 700;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const ease = 1 - Math.pow(1 - p, 3);
      const v = start + (target - start) * ease;
      this.#range!.value = String(Math.round(v));
      this.#apply(Number(this.#range!.value));
      if (p < 1) requestAnimationFrame(tick);
      else {
        const t1 = performance.now();
        const back = (n: number) => {
          const q = Math.min(1, (n - t1) / duration);
          const ease = 1 - Math.pow(1 - q, 3);
          const v = target + (start - target) * ease;
          this.#range!.value = String(Math.round(v));
          this.#apply(Number(this.#range!.value));
          if (q < 1) requestAnimationFrame(back);
        };
        requestAnimationFrame(back);
      }
    };
    requestAnimationFrame(tick);
  }
}

if (!customElements.get('gubia-compare')) {
  customElements.define('gubia-compare', GubiaCompare);
}

export {};
