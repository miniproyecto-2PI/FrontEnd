/** Estado "cargando" de Mi Perfil (US-04): esqueleto con la misma forma de la pantalla. */
export function ProfileSkeleton() {
  const bar = 'rounded-md bg-[#dbe7f0] motion-safe:animate-pulse'
  return (
    <div role="status" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <span className="sr-only">Cargando tu perfil…</span>
      <div className="lg:col-span-4 flex flex-col gap-6" aria-hidden="true">
        <div className="bg-white border border-[#C2C6D5] rounded-2xl p-6 flex flex-col items-center gap-4">
          <div className={`${bar} h-5 w-32 self-start`} />
          <div className="w-32 h-32 rounded-full bg-[#dbe7f0] motion-safe:animate-pulse" />
          <div className={`${bar} h-5 w-40`} />
          <div className={`${bar} h-4 w-24`} />
          <div className={`${bar} h-11 w-full`} />
        </div>
      </div>
      <div className="lg:col-span-8" aria-hidden="true">
        <div className="bg-white border border-[#C2C6D5] rounded-2xl p-6 sm:p-8 flex flex-col gap-5">
          <div className={`${bar} h-7 w-56`} />
          <div className={`${bar} h-4 w-3/4`} />
          <div className="grid sm:grid-cols-2 gap-5">
            <div className={`${bar} h-12`} />
            <div className={`${bar} h-12`} />
          </div>
          <div className={`${bar} h-12`} />
          <div className={`${bar} h-12`} />
          <div className={`${bar} h-11 w-44 self-end`} />
        </div>
      </div>
    </div>
  )
}
