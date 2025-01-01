import { parseEther } from 'viem'
import { usePrepareSendTransaction, useSendTransaction } from 'wagmi'

export const useEthSender = () => {
  const { config } = usePrepareSendTransaction({
    to: undefined,
    value: undefined,
  })
  
  const { sendTransaction, isLoading, isSuccess, isError } = useSendTransaction(config)

  const sendEth = async (to: string, amount: string) => {
    try {
      const value = parseEther(amount)
      await sendTransaction?.({
        to,
        value,
      })
      return true
    } catch (error) {
      console.error('Error sending ETH:', error)
      return false
    }
  }

  return { sendEth, isLoading, isSuccess, isError }
} 