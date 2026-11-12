import { PRESET_AVATARS, type PresetAvatar } from '../../constants/avatars'

export { PRESET_AVATARS, type PresetAvatar }

export interface AvatarSelectorProps {
  selectedId: string
  onSelect: (id: string) => void
  error?: string
}

export function AvatarSelector({ selectedId, onSelect, error }: AvatarSelectorProps) {
  const selectedAvatar = PRESET_AVATARS.find((a) => a.id === selectedId) || PRESET_AVATARS[0]

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold tracking-wide text-[#102c40]">
          Elige tu avatar institucional <span className="text-red-600 font-bold" aria-hidden="true">*</span>
        </label>
        <span className="text-[11px] text-slate-500 font-medium">
          {selectedAvatar.label}
        </span>
      </div>

      <div
        role="radiogroup"
        aria-label="Selecciona un avatar predeterminado"
        className="grid grid-cols-4 sm:grid-cols-8 gap-2 p-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl"
      >
        {PRESET_AVATARS.map((avatar) => {
          const isSelected = avatar.id === selectedId
          return (
            <button
              key={avatar.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={avatar.label}
              onClick={() => onSelect(avatar.id)}
              className={`relative flex items-center justify-center p-2 rounded-lg transition-all duration-150 min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4e79]
                ${
                  isSelected
                    ? 'ring-2 ring-[#1f4e79] shadow-sm transform scale-105'
                    : 'hover:bg-white hover:border-[#cbd5e1] border border-transparent'
                }`}
              style={{
                backgroundColor: avatar.bgColor,
                color: avatar.textColor,
              }}
            >
              <div className="relative">
                {avatar.icon}
                {isSelected && (
                  <span
                    className="absolute -top-1 -right-1.5 w-3.5 h-3.5 bg-[#1f4e79] text-white rounded-full flex items-center justify-center text-[9px] font-bold"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
        <span>8 avatares predeterminados incluidos</span>
        <span className="text-slate-400">Subida personalizada: PNG/JPG máx. 2MB (próx.)</span>
      </div>

      {error && (
        <p role="alert" className="text-xs font-medium text-red-700 flex items-center gap-1.5">
          <span aria-hidden="true">⚠</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}
