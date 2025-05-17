import React, { useState, useEffect } from 'react';
import { Worker, WorkerFormData } from '../../../types/worker';
import { workerService } from '../../../services/workerService';
import '../../../assets/styles/worker-management.css';
import DOMPurify from 'dompurify';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useLanguage } from '../../../context/LanguageContext';

const WorkersTab: React.FC = () => {
  const { t } = useLanguage();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [editingWorker, setEditingWorker] = useState<WorkerFormData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string>('');
  const [offsetPreview, setOffsetPreview] = useState<string>('0%');
  const [tempImagePath, setTempImagePath] = useState<string | null>(null);

  const editorEn = useEditor({
    extensions: [StarterKit],
    content: '',
    onUpdate: ({ editor }) => {
      if (editingWorker) {
        setEditingWorker({
          ...editingWorker,
          descriptionEn: editor.getHTML(),
        });
      }
    },
  });

  const editorUk = useEditor({
    extensions: [StarterKit],
    content: '',
    onUpdate: ({ editor }) => {
      if (editingWorker) {
        setEditingWorker({
          ...editingWorker,
          descriptionUk: editor.getHTML(),
        });
      }
    },
  });

  useEffect(() => {
    loadWorkers();
  }, []);

  useEffect(() => {
    if (editorEn && editorUk && editingWorker) {
      editorEn.commands.setContent(editingWorker.descriptionEn || '');
      editorUk.commands.setContent(editingWorker.descriptionUk || '');
    }
  }, [editingWorker?.id, editorEn, editorUk]);

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
    console.log('Editing worker:', worker);
    const { photo, ...workerWithoutPhoto } = worker;

    // Handle both facebook property formats
    const links = {
      facebook: worker.facebook || worker.links?.facebook || undefined,
    };

    const editingData = {
      ...workerWithoutPhoto,
      currentPhotoPath: photo,
      links,
    };

    console.log('Setting editing worker:', editingData);
    setEditingWorker(editingData);
    setOffsetPreview(worker.iconPhotoOffsetY);
    setTempImagePath(null);
    if (editorEn && editorUk) {
      editorEn.commands.setContent(worker.descriptionEn);
      editorUk.commands.setContent(worker.descriptionUk);
    }
  };

  const handleCreateWorker = () => {
    setEditingWorker(workerService.createEmptyWorker());
    setOffsetPreview('0%');
    setTempImagePath(null);
    if (editorEn && editorUk) {
      editorEn.commands.setContent('');
      editorUk.commands.setContent('');
    }
  };

  const handleDeleteWorker = async (worker: Worker) => {
    if (window.confirm('Are you sure you want to delete this worker?')) {
      try {
        if (worker.photo) {
          await workerService.deletePhoto(worker.photo);
        }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWorker) return;

    try {
      let photoPath = editingWorker.currentPhotoPath || '';

      if (editingWorker.photo) {
        photoPath = await workerService.uploadPhoto(editingWorker.photo);

        if (
          editingWorker.id &&
          editingWorker.currentPhotoPath &&
          editingWorker.currentPhotoPath !== photoPath
        ) {
          try {
            await workerService.deletePhoto(editingWorker.currentPhotoPath);
          } catch (error) {
            console.error('Error deleting old photo:', error);
          }
        }
      }

      const workerData: Worker = {
        ...editingWorker,
        id: editingWorker.id || Math.max(...workers.map((w) => w.id), 0) + 1,
        photo: photoPath,
        descriptionEn: editorEn?.getHTML() || '',
        descriptionUk: editorUk?.getHTML() || '',
        links: editingWorker.links || {},
      };
      console.log('Saving worker data:', workerData);

      const updatedWorkers = editingWorker.id
        ? workers.map((w) => (w.id === editingWorker.id ? workerData : w))
        : [...workers, workerData];

      await workerService.saveWorkers(updatedWorkers);
      setWorkers(updatedWorkers);
      handleCloseForm();
      setMessage('Changes saved successfully');
    } catch (error) {
      console.error('Error saving worker:', error);
      setMessage('Error saving worker. Please try again.');
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingWorker) {
      try {
        const newPhotoPath = await workerService.uploadPhoto(file);

        if (tempImagePath) {
          try {
            await workerService.deletePhoto(tempImagePath);
          } catch (error) {
            console.error('Error deleting previous temp photo:', error);
          }
        }

        setTempImagePath(newPhotoPath);
        setEditingWorker({
          ...editingWorker,
          photo: file,
        });
      } catch (error) {
        console.error('Error uploading photo:', error);
        setMessage('Error uploading photo. Please try again.');
      }
    }
  };

  const handleCloseForm = async () => {
    if (tempImagePath) {
      try {
        await workerService.deletePhoto(tempImagePath);
      } catch (error) {
        console.error('Error deleting temporary photo:', error);
      }
    }

    setEditingWorker(null);
    setTempImagePath(null);
    if (editorEn && editorUk) {
      editorEn.commands.setContent('');
      editorUk.commands.setContent('');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!editingWorker) return;

    const { name, value, type } = e.target;
    setEditingWorker({
      ...editingWorker,
      [name]: type === 'number' ? parseFloat(value) : value,
    });
  };

  const handleOffsetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const offset = `${value}%`;
    setOffsetPreview(offset);
    if (editingWorker) {
      setEditingWorker({
        ...editingWorker,
        iconPhotoOffsetY: offset,
      });
    }
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
              style={{ objectPosition: `center ${worker.iconPhotoOffsetY}` }}
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
        <div className="modalOverlay">
          <div className="modalContent">
            <h2 className="modalTitle">
              {editingWorker.id
                ? t('admin.worker.edit')
                : t('admin.worker.add')}
            </h2>
            <button className="modalClose" onClick={handleCloseForm}>
              ×
            </button>
            <form onSubmit={handleSubmit} className="form">
              <div className="formGroup">
                <label className="label">Name (English)</label>
                <input
                  type="text"
                  name="nameEn"
                  value={editingWorker.nameEn}
                  onChange={handleInputChange}
                  className="input"
                  required
                />
              </div>

              <div className="formGroup">
                <label className="label">Name (Ukrainian)</label>
                <input
                  type="text"
                  name="nameUk"
                  value={editingWorker.nameUk}
                  onChange={handleInputChange}
                  className="input"
                  required
                />
              </div>

              <div className="formGroup">
                <label className="label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editingWorker.email}
                  onChange={handleInputChange}
                  className="input"
                  required
                />
              </div>

              <div className="formGroup">
                <label className="label">Position (English)</label>
                <input
                  type="text"
                  name="positionEn"
                  value={editingWorker.positionEn}
                  onChange={handleInputChange}
                  className="input"
                  required
                />
              </div>

              <div className="formGroup">
                <label className="label">Position (Ukrainian)</label>
                <input
                  type="text"
                  name="positionUk"
                  value={editingWorker.positionUk}
                  onChange={handleInputChange}
                  className="input"
                  required
                />
              </div>

              <div className="formGroup">
                <label className="label">Specialty (English)</label>
                <input
                  type="text"
                  name="specialtyEn"
                  value={editingWorker.specialtyEn}
                  onChange={handleInputChange}
                  className="input"
                  required
                />
              </div>

              <div className="formGroup">
                <label className="label">Specialty (Ukrainian)</label>
                <input
                  type="text"
                  name="specialtyUk"
                  value={editingWorker.specialtyUk}
                  onChange={handleInputChange}
                  className="input"
                  required
                />
              </div>

              <div className="formGroup">
                <label className="label">{t('admin.worker.years')}</label>
                <input
                  type="number"
                  name="years"
                  value={editingWorker.years}
                  onChange={handleInputChange}
                  className="input"
                  required
                  step="0.5"
                />
              </div>

              <div className="formGroup">
                <label className="label">Description (English)</label>
                <div className="editor-controls">
                  <button
                    type="button"
                    onClick={() => editorEn?.chain().focus().toggleBold().run()}
                    className={`editor-button ${
                      editorEn?.isActive('bold') ? 'active' : ''
                    }`}
                  >
                    {t('admin.editor.bold')}
                  </button>
                </div>
                <div className="editor-container">
                  <EditorContent editor={editorEn} />
                </div>
              </div>

              <div className="formGroup">
                <label className="label">Description (Ukrainian)</label>
                <div className="editor-controls">
                  <button
                    type="button"
                    onClick={() => editorUk?.chain().focus().toggleBold().run()}
                    className={`editor-button ${
                      editorUk?.isActive('bold') ? 'active' : ''
                    }`}
                  >
                    {t('admin.editor.bold')}
                  </button>
                </div>
                <div className="editor-container">
                  <EditorContent editor={editorUk} />
                </div>
              </div>

              <div className="formGroup">
                <label className="label">{t('admin.worker.photo')}</label>
                <input
                  type="file"
                  onChange={handlePhotoChange}
                  accept="image/*"
                  className="input"
                />
                {editingWorker.currentPhotoPath && (
                  <div className="imageContainer">
                    <span className="imageLabel">
                      {t('admin.worker.currentPhoto')}:
                    </span>
                    <img
                      src={editingWorker.currentPhotoPath}
                      alt="Current"
                      className="previewImage"
                    />
                  </div>
                )}
                {editingWorker.photo && (
                  <div className="imageContainer">
                    <span className="imageLabel">
                      {t('admin.worker.newPhoto')}:
                    </span>
                    <img
                      src={URL.createObjectURL(editingWorker.photo)}
                      alt="Preview"
                      className="previewImage"
                    />
                  </div>
                )}
              </div>

              <div className="formGroup">
                <label className="label">{t('admin.worker.photoOffset')}</label>
                <div className="photoPreviewSection">
                  <div className="photoPreviewContainer">
                    <div className="photoPreviewInner">
                      {(editingWorker.photo ||
                        editingWorker.currentPhotoPath) && (
                        <img
                          src={
                            editingWorker.photo
                              ? URL.createObjectURL(editingWorker.photo)
                              : editingWorker.currentPhotoPath
                          }
                          alt="Preview"
                          className="photoPreviewImage"
                          style={{ objectPosition: `center ${offsetPreview}` }}
                        />
                      )}
                    </div>
                  </div>
                  <div className="offsetControls">
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={parseInt(offsetPreview?.replace('%', '') || '0')}
                      onChange={handleOffsetChange}
                      className="offsetSlider"
                    />
                    <span className="offsetValue">{offsetPreview}</span>
                  </div>
                </div>
              </div>

              <div className="checkbox">
                <input
                  type="checkbox"
                  checked={editingWorker.isDisplayedInCircle}
                  onChange={(e) =>
                    setEditingWorker({
                      ...editingWorker,
                      isDisplayedInCircle: e.target.checked,
                    })
                  }
                  className="checkboxInput"
                />
                <span className="checkboxLabel">
                  {t('admin.worker.displayInCircle')}
                </span>
              </div>

              <div className="formGroup">
                <label className="label">{t('admin.worker.facebook')}</label>
                <input
                  type="url"
                  name="facebook"
                  value={editingWorker.links?.facebook || ''}
                  onChange={(e) =>
                    setEditingWorker({
                      ...editingWorker,
                      links: {
                        ...(editingWorker.links || {}),
                        facebook: e.target.value,
                      },
                    })
                  }
                  className="input"
                />
              </div>

              <div className="formActions">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="cancelButton"
                >
                  {t('admin.worker.cancel')}
                </button>
                <button type="submit" className="saveButton">
                  {t('admin.worker.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkersTab;
