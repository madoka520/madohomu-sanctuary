const Scroll = ((className: string, el?: HTMLElement) => {
  const wheel = (e: WheelEvent) => {

    if (!el) return;

    const target = e.target as HTMLElement;

    // 找最近的可纵向滚动父元素
    const scrollable = target.closest(className) as HTMLElement | null;

    if (scrollable) {
      const { scrollTop, scrollHeight, clientHeight } = scrollable;

      const isAtTop = scrollTop === 0 && e.deltaY < 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight && e.deltaY > 0;

      // 👉 内部还能滚，就放行
      if (!isAtTop && !isAtBottom) {
        return;
      }
    }

    // 👉 内部滚不动了，交给横向
    e.preventDefault();
    el.scrollLeft += e.deltaY * 20;
  };

  return reactive({ wheel });
});

export default Scroll;