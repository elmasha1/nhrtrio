import { useEffect } from 'react'

const SUFFIX = 'NHR Trio'

export default function useTitle(title) {
  useEffect(() => {
    if (!title) return
    const prev = document.title
    document.title = `${title} · ${SUFFIX}`
    return () => { document.title = prev }
  }, [title])
}

export { SUFFIX }
