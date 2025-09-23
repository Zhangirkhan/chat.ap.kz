import { ref } from 'vue'
import type { Contractor } from '@/shared/api/contractors'

export function useChatDialogs() {
  const showContractorDialog = ref(false)
  const showTestDataDialog = ref(false)
  const showTestChatsDialog = ref(false)

  const openContractorDialog = () => {
    showContractorDialog.value = true
  }

  const closeContractorDialog = () => {
    showContractorDialog.value = false
  }

  const openTestDataDialog = () => {
    showTestDataDialog.value = true
  }

  const closeTestDataDialog = () => {
    showTestDataDialog.value = false
  }

  const openTestChatsDialog = () => {
    showTestChatsDialog.value = true
  }

  const closeTestChatsDialog = () => {
    showTestChatsDialog.value = false
  }

  const handleCreateNewContractor = () => {
    window.open('/contractors', '_blank')
    closeContractorDialog()
  }

  return {
    showContractorDialog,
    showTestDataDialog,
    showTestChatsDialog,
    openContractorDialog,
    closeContractorDialog,
    openTestDataDialog,
    closeTestDataDialog,
    openTestChatsDialog,
    closeTestChatsDialog,
    handleCreateNewContractor
  }
}
