import { headers } from 'next/headers'
import ContextProvider from '@/context'

export default function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  const cookies = headers().get('cookie')

  return <ContextProvider cookies={cookies}>{children}</ContextProvider>
} 