import { useChooseUsername } from '../hooks/useChooseUsername'
import { UsernameSelectionForm } from '../components/auth/UsernameSelectionForm'
import { useLocation } from 'react-router-dom'
import { RegisterSuccessCard } from '../components/auth/RegisterSuccessCard'
import { ExitConfirmModal } from '../components/auth/ExitConfirmModal'

export function ChooseUsernamePage() {
  const {
    user,
    username,
    setUsername,
    status,
    error,
    suggestions,
    isLoading,
    showExitModal,
    setShowExitModal,
    successUser,
    handleSelectSuggestion,
    handleSubmit,
    handleConfirmExit,
  } = useChooseUsername()

  const { state } = useLocation()
  const target = (state as { from?: { pathname?: string } } | null)?.from?.pathname

  if (!user) return null

  return (
    <main
      id="main-content"
      className="min-h-[calc(100vh-140px)] bg-[#f5faff] py-8 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center"
    >
      {successUser ? (
        <RegisterSuccessCard user={successUser} continueTo={target} />
      ) : (
        <UsernameSelectionForm
          user={user}
          username={username}
          onChange={setUsername}
          onSubmit={handleSubmit}
          onBack={() => setShowExitModal(true)}
          onSelectSuggestion={handleSelectSuggestion}
          suggestions={suggestions}
          status={status}
          error={error}
          isLoading={isLoading}
        />
      )}

      <ExitConfirmModal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        onConfirmExit={handleConfirmExit}
      />
    </main>
  )
}

