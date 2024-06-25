import { setDefaultOptions } from 'date-fns'
import { de, enUS, ptBR } from 'date-fns/locale'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const locales = {
  de: de,
  en: enUS,
  pt: ptBR,
}

export default function DateFnsLocaleProvider() {
  const { i18n } = useTranslation()

  useEffect(() => {
    // @ts-ignore
    setDefaultOptions({ locale: locales[i18n.language] ?? enUS })
  }, [i18n.language])

  return null
}
