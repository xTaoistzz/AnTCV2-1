import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, ImageIcon, Layers, Settings, X, Loader, AlertTriangle } from 'lucide-react';
import { FaChartBar, FaObjectGroup, FaImage } from 'react-icons/fa';
type AnnotationType = 'classification' | 'detection' | 'segmentation';

interface TabProps {
  initialType?: AnnotationType;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  isError: boolean;
}

interface LoadingProps {
  isLoading: boolean;
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, message, isError }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`bg-white rounded-lg p-6 max-w-sm w-full mx-4 ${isError ? 'border-red-500' : 'border-green-500'} border-4`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-semibold ${isError ? 'text-red-600' : 'text-green-600'}`}>
              {isError ? 'Error' : 'Success'}
            </h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
          <p className="text-gray-700">{message}</p>
          <button
            className={`mt-4 px-4 py-2 rounded ${isError ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white w-full`}
            onClick={onClose}
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const Loading: React.FC<LoadingProps> = ({ isLoading }) => (
  <AnimatePresence>
    {isLoading && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg p-6 flex flex-col items-center"
        >
          <Loader className="animate-spin text-blue-500 mb-4" size={40} />
          <p className="text-gray-700 font-semibold">Converting...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait</p>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, message }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 border-4 border-yellow-500"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center mb-4">
            <AlertTriangle className="text-yellow-500 mr-2" size={24} />
            <h3 className="text-lg font-semibold text-gray-800">Confirm Conversion</h3>
          </div>
          <p className="text-gray-700 mb-4">{message}</p>
          <div className="flex justify-end space-x-2">
            <button
              className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400 transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              Confirm
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const Tab: React.FC<TabProps> = ({ initialType = 'classification' }) => {
  const router = useRouter();
  const params = useParams();
  const [selectedType, setSelectedType] = useState<AnnotationType>(initialType);
  const [showDropdown, setShowDropdown] = useState<AnnotationType | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conversionType, setConversionType] = useState<{ from: AnnotationType; to: AnnotationType } | null>(null);

  useEffect(() => {
    const storedType = localStorage.getItem('Type') as AnnotationType;
    if (storedType) {
      setSelectedType(storedType);
    }
  }, []);

  const handleTypeChange = (type: AnnotationType) => {
    setSelectedType(type);
    localStorage.setItem('Type', type);
    router.push(`/workspace/${params.id}/${type}`);
    window.dispatchEvent(new CustomEvent('typeChange', { detail: type }));
  };

  const handleConfirmConvert = () => {
    if (conversionType) {
      performConversion(conversionType.from, conversionType.to);
    }
  };

  const handleConvert = (from: AnnotationType, to: AnnotationType) => {
    setConversionType({ from, to });
    setShowConfirmModal(true);
  };

  const performConversion = async (from: AnnotationType, to: AnnotationType) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.ORIGIN_URL}/convert/${from}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idproject: params.id }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        if (data.type === 'success') {
          setModalMessage(`Convert to ${to} successful!`);
          setIsError(false);
          handleTypeChange(to);
        } else {
          setModalMessage(data.message || `Failed to convert to ${to}`);
          setIsError(true);
        }
      } else {
        setModalMessage(data.message || `Failed to convert to ${to}`);
        setIsError(true);
      }

      setShowModal(true);
    } catch (error) {
      console.error(`Error converting to ${to}:`, error);
      setModalMessage(`Error converting to ${to}. Please try again.`);
      setIsError(true);
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const tabConfig = {
    classification: { icon: Tag, color: 'blue' },
    detection: { icon: FaObjectGroup, color: 'green' },
    segmentation: { icon: ImageIcon, color: 'purple' },
  };

  const renderTab = (type: AnnotationType) => {
    const { icon: Icon, color } = tabConfig[type];
    return (
      <div className="flex-1 relative">
        <motion.button
          className={`w-full py-3 px-4 rounded-t-xl text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2
                     ${selectedType === type 
                       ? `bg-${color}-100 text-${color}-700 shadow-md` 
                       : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          onClick={() => handleTypeChange(type)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Icon size={18} />
          <span className="flex-grow text-center">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
          {(type === 'detection' || type === 'segmentation') && (
            <Settings
              size={16}
              className="ml-2 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown(showDropdown === type ? null : type);
              }}
            />
          )}
        </motion.button>
        <AnimatePresence>
          {showDropdown === type && (type === 'detection' || type === 'segmentation') && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-10"
            >
              <button
                className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors duration-300 text-blue-700"
                onClick={() => handleConvert(type, type === 'detection' ? 'classification' : 'detection')}
              >
                Convert to {type === 'detection' ? 'Classification' : 'Detection'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="">
      <div className="bg-white  rounded-xl shadow-lg">
        <div className="flex space-x-4">
          {renderTab('classification')}
          {renderTab('detection')}
          {renderTab('segmentation')}
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        message={modalMessage}
        isError={isError}
      />
      <Loading isLoading={isLoading} />
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmConvert}
        message={`Are you sure you want to convert from ${conversionType?.from} to ${conversionType?.to}? This action cannot be undone.`}
      />
    </div>
  );
};

export default Tab;