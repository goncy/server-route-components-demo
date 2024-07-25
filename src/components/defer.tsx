"use client";

import {unstable_postpone as postpone, useEffect, useState, useTransition} from "react";

/**
 * ## Current iteration of the idea
 *
 * We still fetch only once but we get the suspense behavior we want by using postpone during pre-rendering and a transition during client side fetching.
 */

export default function Defer<Props>({
  as: getPayload,
  reloadEvery = 0,
  ...props
}: Props & {as: (props: Props) => Promise<React.ReactElement>; reloadEvery?: number}) {
  const [payload, setPayload] = useState<React.ReactNode>(null);
  const [isLoading, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      setPayload(await getPayload(props as Props));
    });
  }, [getPayload, reloadEvery, props]);

  if (typeof window === "undefined" || isLoading)
    postpone("Suspend while pre-rendering and fetching");

  return payload;
}

/**
 * You could even refresh the data every N seconds by adding a `setInterval` inside the `useEffect` callback.
 *
 * ```jsx
 *  useEffect(() => {
 *    let interval: NodeJS.Timeout;
 *
 *    async function fetchPayload() {
 *      setPayload(await getPayload(props as Props))
 *    }
 *
 *    if (reloadEvery > 0) {
 *      interval = setInterval(fetchPayload, reloadEvery)
 *    }
 *
 *    startTransition(async () => {
 *      fetchPayload()
 *    })
 *
 *    return () => {
 *      clearInterval(interval)
 *    }
 *  }, [getPayload, reloadEvery, props])
 * ```
 */

/**
 * ## Previous iterations of this idea:
 *
 * ### Using `useEffect`
 *
 * ```jsx
 * const [payload, setPayload] = useState<React.ReactElement>(null)
 *
 * useEffect(() => {
 *   getPayload(props as P).then(setPayload)
 * }, [getPayload, props])
 *
 * if (typeof window === "undefined") postpone("Omit SSR")
 *
 * return payload
 * ```
 *
 * > This is the "safer" approach as you ensure that the fetching is done only once. However, I couldn't find a way to postpone the component while `useEffect` is running, so the component is only postponed during pre-render.
 *
 * ### Using server action as a component
 *
 * ```jsx
 * if (typeof window === "undefined") postpone("Omit SSR")
 *
 * return <Component {...props as P} />
 * ```
 *
 * > The tradeoff here is that this server action is called in every render, and server actions are not cached by default, which can be a performance issue.
 *
 * ## Using `use`
 *
 * ```jsx
 * if (typeof window === "undefined") postpone("Omit SSR")
 *
 * return use(Component(props as P))
 * ```
 *
 * > The tradeoff here is that we don't use a component (a server action as a component) when we could. I'm not sure if `use` has some kind of caching that might help in this case.
 */
