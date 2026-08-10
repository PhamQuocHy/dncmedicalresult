import { useEffect, useRef } from "react";

/** Cuộn tab đang chọn vào vùng nhìn thấy (mobile scrollable tabs). */
export function useScrollTabIntoView<T extends string>(activeTab: T) {
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = tabsRef.current;
    if (!root) return;

    const scroller = root.querySelector<HTMLElement>(".MuiTabs-scroller");
    const selected = root.querySelector<HTMLElement>(
      '[role="tab"][aria-selected="true"]',
    );
    if (!scroller || !selected) return;

    const scrollerRect = scroller.getBoundingClientRect();
    const tabRect = selected.getBoundingClientRect();
    const tabCenter = tabRect.left + tabRect.width / 2;
    const scrollerCenter = scrollerRect.left + scrollerRect.width / 2;
    const delta = tabCenter - scrollerCenter;

    if (Math.abs(delta) < 1) return;

    scroller.scrollBy({ left: delta, behavior: "smooth" });
  }, [activeTab]);

  return tabsRef;
}
