interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-[90vw]">
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="mb-6 text-gray-700">{message}</p>
        
        <div className="flex justify-end gap-3">
          <button 
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button 
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
} 