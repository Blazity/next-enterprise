"use client"

import { CloseIcon, TrashIcon } from "components/icons"

interface DeleteConfirmModalProps {
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

export function DeleteConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
  isLoading = false,
}: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-lg font-bold text-primary m-0">Confirm Delete</h3>
          <button
            onClick={onCancel}
            className="size-8 rounded-full border-0 bg-transparent flex items-center justify-center text-muted hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer"
          >
            <CloseIcon width={18} height={18} />
          </button>
        </div>

        <div className="p-6">
          <div className="size-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4">
            <TrashIcon width={24} height={24} />
          </div>
          <h4 className="text-primary font-bold mb-2 m-0">{title}</h4>
          <p className="text-sm text-muted m-0 leading-relaxed">{message}</p>
        </div>

        <div className="flex items-center gap-3 p-6 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-full border-0 bg-primary/5 text-sm font-bold text-primary hover:bg-primary/10 transition-colors cursor-pointer"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-full border-0 bg-red-500 text-sm font-bold text-primary hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  )
}
