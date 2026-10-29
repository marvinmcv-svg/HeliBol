// Browser APIs jsdom doesn't ship.
const mql = (query: string) => ({
  matches: query.includes("prefers-reduced-motion: reduce") ? false : false,
  media: query,
  onchange: null,
  addEventListener() {},
  removeEventListener() {},
  addListener() {},
  removeListener() {},
  dispatchEvent: () => false,
});
Object.defineProperty(window, "matchMedia", { writable: true, value: mql });

class IO {
  constructor(private cb: IntersectionObserverCallback) {}
  observe(el: Element) {
    this.cb([{ isIntersecting: true, target: el, intersectionRatio: 1 } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
  }
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
class RO {
  constructor(private cb: ResizeObserverCallback) {}
  observe(el: Element) {
    this.cb([{ target: el, contentRect: { width: 800, height: 600 } } as unknown as ResizeObserverEntry], this as unknown as ResizeObserver);
  }
  unobserve() {}
  disconnect() {}
}
Object.assign(globalThis, { IntersectionObserver: IO, ResizeObserver: RO });
window.scrollTo = () => {};
Element.prototype.scrollIntoView = () => {};
if (!("CSS" in globalThis)) Object.assign(globalThis, { CSS: { supports: () => false } });
Object.assign(navigator, { clipboard: { writeText: async () => {} } });
HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) {
  this.open = true;
};
HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) {
  this.open = false;
};
