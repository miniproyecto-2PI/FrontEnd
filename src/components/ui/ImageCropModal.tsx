import React, { useEffect, useRef, useState } from 'react'

export interface ImageCropModalProps {
  isOpen: boolean
  imageSrc: string | null
  onCropComplete: (croppedFile: File, previewUrl: string) => void
  onCancel: () => void
}

export function ImageCropModal({
  isOpen,
  imageSrc,
  onCropComplete,
  onCancel,
}: ImageCropModalProps) {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 })
  const imgRef = useRef<HTMLImageElement | null>(null)
  const [imgLoaded, setImgLoaded] = useState(false)

  const VIEWPORT_SIZE = 280
  const CROP_SIZE = 400

  // Reiniciar estado cuando se abre una nueva imagen
  useEffect(() => {
    if (isOpen) {
      setZoom(1)
      setPan({ x: 0, y: 0 })
      setImgLoaded(false)
    }
  }, [isOpen, imageSrc])

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onCancel])

  if (!isOpen || !imageSrc) return null

  // Manejo de arrastre con ratón
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const dx = e.clientX - dragStartRef.current.x
    const dy = e.clientY - dragStartRef.current.y
    setPan({
      x: dragStartRef.current.panX + dx,
      y: dragStartRef.current.panY + dy,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Manejo de arrastre táctil (móviles / tablets)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return
    const touch = e.touches[0]
    setIsDragging(true)
    dragStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      panX: pan.x,
      panY: pan.y,
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return
    const touch = e.touches[0]
    const dx = touch.clientX - dragStartRef.current.x
    const dy = touch.clientY - dragStartRef.current.y
    setPan({
      x: dragStartRef.current.panX + dx,
      y: dragStartRef.current.panY + dy,
    })
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // Zoom con rueda del ratón
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY < 0 ? 0.1 : -0.1
    setZoom((prev) => Math.min(3, Math.max(1, Number((prev + delta).toFixed(2)))))
  }

  // Aplicar recorte en canvas
  const handleApplyCrop = () => {
    const img = imgRef.current
    if (!img) return

    const canvas = document.createElement('canvas')
    canvas.width = CROP_SIZE
    canvas.height = CROP_SIZE
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const naturalWidth = img.naturalWidth || 400
    const naturalHeight = img.naturalHeight || 400

    // Escala base para cubrir el visor
    const baseScale = Math.max(VIEWPORT_SIZE / naturalWidth, VIEWPORT_SIZE / naturalHeight)
    const currentScale = baseScale * zoom

    const renderedWidth = naturalWidth * currentScale
    const renderedHeight = naturalHeight * currentScale

    const imgLeft = (VIEWPORT_SIZE - renderedWidth) / 2 + pan.x
    const imgTop = (VIEWPORT_SIZE - renderedHeight) / 2 + pan.y

    // Mapear al tamaño de destino en canvas (400x400)
    const factor = CROP_SIZE / VIEWPORT_SIZE
    const destX = imgLeft * factor
    const destY = imgTop * factor
    const destW = renderedWidth * factor
    const destH = renderedHeight * factor

    // Fondo blanco por defecto para transparencias
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, CROP_SIZE, CROP_SIZE)

    ctx.drawImage(img, destX, destY, destW, destH)

    canvas.toBlob(
      (blob) => {
        if (!blob) return
        const croppedFile = new File([blob], 'foto-perfil.jpg', { type: 'image/jpeg' })
        const previewUrl = URL.createObjectURL(blob)
        onCropComplete(croppedFile, previewUrl)
      },
      'image/jpeg',
      0.92
    )
  }

  // Cálculos visuales para el render del visor
  let renderedWidth = VIEWPORT_SIZE
  let renderedHeight = VIEWPORT_SIZE
  let imgLeft = 0
  let imgTop = 0

  if (imgRef.current && imgLoaded) {
    const nw = imgRef.current.naturalWidth || VIEWPORT_SIZE
    const nh = imgRef.current.naturalHeight || VIEWPORT_SIZE
    const baseScale = Math.max(VIEWPORT_SIZE / nw, VIEWPORT_SIZE / nh)
    const currentScale = baseScale * zoom
    renderedWidth = nw * currentScale
    renderedHeight = nh * currentScale
    imgLeft = (VIEWPORT_SIZE - renderedWidth) / 2 + pan.x
    imgTop = (VIEWPORT_SIZE - renderedHeight) / 2 + pan.y
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="crop-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Cabecera del modal */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex flex-col">
            <h3 id="crop-modal-title" className="text-base font-bold text-[#102c40]">
              Recortar foto de perfil
            </h3>
            <p className="text-xs text-slate-500">
              Ajusta y centra tu imagen para tu perfil universitario
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Cerrar recorte"
          >
            ✕
          </button>
        </div>

        {/* Visor interactivo de recorte */}
        <div className="flex flex-col items-center justify-center p-5 bg-slate-950/5">
          <div
            className={`relative rounded-xl overflow-hidden cursor-grab bg-slate-900 select-none shadow-inner ${
              isDragging ? 'cursor-grabbing' : ''
            }`}
            style={{ width: `${VIEWPORT_SIZE}px`, height: `${VIEWPORT_SIZE}px` }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
          >
            {/* Imagen a recortar */}
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Ajuste de recorte"
              onLoad={() => setImgLoaded(true)}
              draggable={false}
              className="absolute pointer-events-none transition-transform duration-75 max-w-none"
              style={{
                width: `${renderedWidth}px`,
                height: `${renderedHeight}px`,
                left: `${imgLeft}px`,
                top: `${imgTop}px`,
              }}
            />

            {/* Máscara y guía circular de avatar */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div
                className="w-full h-full rounded-full border-2 border-white/90 shadow-[0_0_0_9999px_rgba(15,23,42,0.55)]"
                aria-hidden="true"
              />
            </div>
          </div>

          <p className="mt-2.5 text-[11px] text-slate-500 text-center">
            Arrastra para centrar la foto • El círculo indica cómo se verá tu avatar
          </p>
        </div>

        {/* Controles de Zoom */}
        <div className="px-6 py-3 border-t border-slate-100 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(1, Number((z - 0.2).toFixed(2))))}
            disabled={zoom <= 1}
            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-bold shrink-0 transition-colors"
            title="Alejar"
            aria-label="Alejar foto"
          >
            −
          </button>

          <div className="flex-1 flex flex-col gap-1">
            <div className="flex justify-between text-[11px] text-slate-500 font-medium">
              <span>Zoom</span>
              <span>{Math.round(zoom * 100)}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              aria-label="Nivel de zoom de la foto"
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1f4e79]"
            />
          </div>

          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(3, Number((z + 0.2).toFixed(2))))}
            disabled={zoom >= 3}
            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-bold shrink-0 transition-colors"
            title="Acercar"
            aria-label="Acercar foto"
          >
            +
          </button>
        </div>

        {/* Botones de acción */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleApplyCrop}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-[#1f4e79] hover:bg-[#163a5c] rounded-lg transition-colors shadow-xs"
          >
            Aplicar recorte
          </button>
        </div>
      </div>
    </div>
  )
}
