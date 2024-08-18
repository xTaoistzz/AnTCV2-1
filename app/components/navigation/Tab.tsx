import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

type AnnotationType = 'classification' | 'detection' | 'segmentation';

interface TabProps {
  initialType?: AnnotationType;
}

const Tab: React.FC<TabProps> = ({ initialType = 'classification' }) => {
  const router = useRouter();
  const params = useParams();
  const [selectedType, setSelectedType] = useState<AnnotationType>(initialType);

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
    
    // Dispatch a custom event to notify other components
    window.dispatchEvent(new CustomEvent('typeChange', { detail: type }));
  };

  const tabVariants = {
    active: { backgroundColor: '#3B82F6', color: 'white' },
    inactive: { backgroundColor: '#E5E7EB', color: '#1F2937' }
  };

  return (
    <div className="mb-6">
      <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
        {['classification', 'detection', 'segmentation'].map((type) => (
          <motion.button
            key={type}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200`}
            variants={tabVariants}
            animate={selectedType === type ? 'active' : 'inactive'}
            onClick={() => handleTypeChange(type as AnnotationType)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </motion.button>
        ))}
      </div>
      <div className="mt-4">
        {/* {selectedType === 'classification' && <ClassificationContent />}
        {selectedType === 'detection' && <DetectionContent />}
        {selectedType === 'segmentation' && <SegmentationContent />} */}
      </div>
    </div>
  );
};

const ClassificationContent: React.FC = () => (
  <div>
    <h2 className="text-xl font-bold mb-4">Classification</h2>
    {/* Add classification-specific content here */}
  </div>
);

const DetectionContent: React.FC = () => (
  <div>
    <h2 className="text-xl font-bold mb-4">Detection</h2>
    {/* Add detection-specific content here */}
  </div>
);

const SegmentationContent: React.FC = () => (
  <div>
    <h2 className="text-xl font-bold mb-4">Segmentation</h2>
    {/* Add segmentation-specific content here */}
  </div>
);

export default Tab;