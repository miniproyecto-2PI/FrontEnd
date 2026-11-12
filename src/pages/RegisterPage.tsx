import { useRegisterForm } from '../hooks/useRegisterForm'
import { RegisterSuccessCard } from '../components/auth/RegisterSuccessCard'
import { RegisterForm } from '../components/auth/RegisterForm'

export function RegisterPage() {
  const form = useRegisterForm()

  return (
    <main
      id="main-content"
      className="min-h-[calc(100vh-140px)] bg-[#f5faff] py-8 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center"
    >
      {form.successUser ? (
        <div className="w-full max-w-[560px] animate-fade-in">
          <RegisterSuccessCard user={form.successUser} />
        </div>
      ) : (
        <div className="w-full max-w-[560px] flex flex-col gap-4 animate-fade-in">
          <RegisterForm form={form} />
        </div>
      )}
    </main>
  )
}
