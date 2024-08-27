import React, { useState, useEffect } from 'react';
import { FaChartBar, FaObjectGroup, FaImage } from 'react-icons/fa';
import { Tag, ImageIcon, Layers, Settings, X, Loader, AlertTriangle } from 'lucide-react';
interface ProgressBarProps {
  idproject: number;
}

interface ProgressData {
  total: number;
  process: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ idproject }) => {
  const [progressData, setProgressData] = useState<{ [key: string]: ProgressData }>({
    detection: { total: 0, process: 0 },
    segmentation: { total: 0, process: 0 },
    classification: { total: 0, process: 0 },
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const types = ['classification','detection','segmentation' ];
        const results = await Promise.all(
          types.map(type =>
            fetch(`${process.env.ORIGIN_URL}/${type}/getProcess/${idproject}`, {
              credentials: 'include',
            }).then(res => res.json())
          )
        );

        const newProgressData = types.reduce((acc, type, index) => {
          acc[type] = results[index];
          return acc;
        }, {} as { [key: string]: ProgressData });

        setProgressData(newProgressData);
      } catch (error) {
        console.error('Error fetching progress:', error);
        setError('Failed to load progress');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [idproject]);

  if (loading) {
    return <div className="text-sm text-gray-600 animate-pulse">Loading progress...</div>;
  }

  if (error) {
    return <div className="text-sm text-red-600">{error}</div>;
  }

  const typeConfig = {
    classification: { icon: Tag, color: 'blue' },
    detection: { icon: FaObjectGroup, color: 'green' },
    segmentation: { icon: FaImage, color: 'purple' },

  };

  const renderProgressBar = (type: string, data: ProgressData) => {
    const percentage = data.total > 0 ? (data.process / data.total) * 100 : 0;
    const { icon: Icon, color } = typeConfig[type as keyof typeof typeConfig];

    return (
      <div key={type} className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center mb-2">
          <Icon className={`text-${color}-500 mr-2`} />
          <h3 className="text-sm font-semibold text-gray-700 capitalize">{type}</h3>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`bg-${color}-500 h-2.5 rounded-full transition-all duration-300 ease-in-out`}
            style={{width: `${percentage}%`}}
          ></div>
        </div>
        <div className="flex justify-between mt-1">
          <p className="text-xs text-gray-500">
            {data.process} / {data.total}
          </p>
          <p className="text-xs font-medium text-gray-700">
            {percentage.toFixed(1)}%
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Object.entries(progressData).map(([type, data]) => renderProgressBar(type, data))}
    </div>
  );
};

export default ProgressBar;