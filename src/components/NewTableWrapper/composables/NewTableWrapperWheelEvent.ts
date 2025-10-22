import { onBeforeUnmount, onMounted, Ref, toValue } from "vue";

export function useNewTableWrapperWheelEvent(
  onNext: () => void,
  onPrevious: () => void,
) {
  let resultDeltaY = 0;
  let ticking = false;

  const onWheelEvent = (e: WheelEvent) => {
    if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) {
      return;
    }

    resultDeltaY += e.deltaY;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        // Throttle the event to "do something" every 20ms
        setTimeout(() => {
          if (resultDeltaY > 0) {
            onNext();
          } else if (resultDeltaY < 0) {
            onPrevious();
          }
          resultDeltaY = 0;
          ticking = false;
        }, 20);
      });

      ticking = true;
    }
  };

  return {
    onWheelEvent,
  };
};
