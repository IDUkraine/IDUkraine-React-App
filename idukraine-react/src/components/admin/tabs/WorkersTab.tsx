import React, { useState, useEffect } from 'react';
import { Worker } from '../../../types/worker';
import { workerService } from '../../../services/workerService';
import '../../../assets/styles/worker-management.css';
import DOMPurify from 'dompurify';
import { useLanguage } from '../../../context/LanguageContext';
import WorkersFormModal from '../WorkersFormModal';

interface EditingWorker extends Omit<Worker, 'photo' | 'years' | 'id'> {
  id?: number;
  photo?: File;
  currentPhotoPath?: string;
  years: number | null;
}

const WorkersTab: React.FC = () => {
  const { t } = useLanguage();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [editingWorker, setEditingWorker] = useState<EditingWorker | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    loadWorkers();
  }, []);

  const loadWorkers = async () => {
    try {
      const data = await workerService.getWorkers();
      setWorkers(data.employees);
    } catch (error) {
      console.error('Error loading workers:', error);
      setMessage('Error loading workers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditWorker = (worker: Worker) => {
    const { photo, ...workerWithoutPhoto } = worker;
    const links = {
      facebook: worker.facebook || worker.links?.facebook || undefined,
    };

    setEditingWorker({
      ...workerWithoutPhoto,
      currentPhotoPath: photo,
      links,
      years: worker.years,
    });
  };

  const handleCreateWorker = () => {
    setEditingWorker(workerService.createEmptyWorker() as EditingWorker);
  };

  const handleDeleteWorker = async (worker: Worker) => {
    if (window.confirm('Are you sure you want to delete this worker?')) {
      try {
        await workerService.deleteWorkerPhotos({
          photo: worker.photo,
          avatar: worker.avatar as string,
        });
        const updatedWorkers = workers.filter((w) => w.id !== worker.id);
        await workerService.saveWorkers(updatedWorkers);
        setWorkers(updatedWorkers);
        setMessage('Worker deleted successfully');
      } catch (error) {
        console.error('Error deleting worker:', error);
        setMessage('Error deleting worker. Please try again.');
      }
    }
  };

  const handleSaveWorker = async (workerData: Worker) => {
    const updatedWorkers = editingWorker?.id
      ? workers.map((w) => (w.id === editingWorker.id ? workerData : w))
      : [...workers, workerData];

    await workerService.saveWorkers(updatedWorkers);
    setWorkers(updatedWorkers);
    setMessage('Changes saved successfully');
  };

  if (isLoading) {
    return <div className="loading">{t('admin.loading')}</div>;
  }

  return (
    <div className="container">
      <div className="header">
        <button onClick={handleCreateWorker} className="addButton">
          {t('admin.worker.addNew')}
        </button>
      </div>

      {message && (
        <div className="message">
          {message.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      )}

      <div className="grid">
        {workers.map((worker) => (
          <div key={worker.id} className="card">
            <img
              src={worker.photo}
              alt={worker.nameEn}
              className="cardImage"
              style={{ objectPosition: `center 0%` }}
            />
            <div className="cardContent">
              <h3 className="cardTitle">
                {worker.nameEn} / {worker.nameUk}
              </h3>
              <p className="cardPosition">
                {worker.positionEn} / {worker.positionUk}
              </p>
              <p className="cardSpecialty">
                {worker.specialtyEn} / {worker.specialtyUk}
              </p>
              <div className="cardDescription">
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(worker.descriptionEn),
                  }}
                />
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(worker.descriptionUk),
                  }}
                />
              </div>
              <div className="cardActions">
                <button
                  onClick={() => handleEditWorker(worker)}
                  className="editButton"
                >
                  {t('admin.worker.edit')}
                </button>
                <button
                  onClick={() => handleDeleteWorker(worker)}
                  className="deleteButton"
                >
                  {t('admin.worker.delete')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingWorker && (
        <WorkersFormModal
          editingWorker={editingWorker}
          onClose={() => setEditingWorker(null)}
          onSave={handleSaveWorker}
          workers={workers}
        />
      )}
    </div>
  );
};

export default WorkersTab;
