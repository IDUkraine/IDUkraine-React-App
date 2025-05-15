import React, { useState, useEffect } from 'react';
import { Worker, WorkerFormData } from '../../../types/worker';
import { workerService } from '../../../services/workerService';
import '../../../assets/styles/worker-management.css';
import DOMPurify from 'dompurify';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const WorkersTab: React.FC = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [editingWorker, setEditingWorker] = useState<WorkerFormData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string>('');
  const [offsetPreview, setOffsetPreview] = useState<string>('0%');
  const [tempImagePath, setTempImagePath] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    onUpdate: ({ editor }) => {
      if (editingWorker) {
        setEditingWorker({
          ...editingWorker,
          description: editor.getHTML(),
        });
      }
    },
  });

  useEffect(() => {
    loadWorkers();
  }, []);

  useEffect(() => {
    if (editor && editingWorker) {
      editor.commands.setContent(editingWorker.description);
    }
  }, [editingWorker?.id, editor]);

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
    setEditingWorker({
      ...workerWithoutPhoto,
      currentPhotoPath: photo,
    });
    setOffsetPreview(worker.iconPhotoOffsetY);
    setTempImagePath(null);
    if (editor) {
      editor.commands.setContent(worker.description);
    }
  };

  const handleCreateWorker = () => {
    setEditingWorker({
      name: '',
      email: '',
      position: '',
      specialty: '',
      years: 0,
      description: '',
      iconPhotoOffsetY: '0%',
      links: {},
      isDisplayedInCircle: false,
    });
    setOffsetPreview('0%');
    setTempImagePath(null);
  };

  const handleDeleteWorker = async (worker: Worker) => {
    if (window.confirm('Are you sure you want to delete this worker?')) {
      try {
        await workerService.deleteWorkerPhoto(worker.photo);
        const updatedWorkers = workers.filter((w) => w.id !== worker.id);
        await workerService.saveWorkers({
          employees: updatedWorkers,
          radiuses: [190, 180, 230, 190, 210, 190],
        });
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
        photoPath = await workerService.saveWorkerPhoto(editingWorker.photo);

        if (
          editingWorker.id &&
          editingWorker.currentPhotoPath &&
          editingWorker.currentPhotoPath !== photoPath
        ) {
          try {
            await workerService.deleteWorkerPhoto(
              editingWorker.currentPhotoPath
            );
          } catch (error) {
            console.error('Error deleting old photo:', error);
          }
        }
      }

      const description = editor?.getHTML() || '';

      const workerData: Worker = {
        ...editingWorker,
        id: editingWorker.id || Math.max(...workers.map((w) => w.id), 0) + 1,
        photo: photoPath,
        description,
      };

      const updatedWorkers = editingWorker.id
        ? workers.map((w) => (w.id === editingWorker.id ? workerData : w))
        : [...workers, workerData];

      await workerService.saveWorkers({
        employees: updatedWorkers,
        radiuses: [190, 180, 230, 190, 210, 190],
      });

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
        const newPhotoPath = await workerService.saveWorkerPhoto(file);

        if (tempImagePath) {
          try {
            await workerService.deleteWorkerPhoto(tempImagePath);
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
        await workerService.deleteWorkerPhoto(tempImagePath);
      } catch (error) {
        console.error('Error deleting temporary photo:', error);
      }
    }

    setEditingWorker(null);
    setTempImagePath(null);
    if (editor) {
      editor.commands.setContent('');
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

  const getWorkerPhotoUrl = (photoPath: string): string => {
    const photoData = workerService.getPhotoData(photoPath);
    return photoData || photoPath;
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
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="header">
        <button onClick={handleCreateWorker} className="addButton">
          Add New Worker
        </button>
      </div>

      {message && (
        <div className="message">
          {message.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      )}

      {editingWorker && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h2 className="modalTitle">
              {editingWorker.id ? 'Edit Worker' : 'Add New Worker'}
            </h2>
            <button className="modalClose" onClick={handleCloseForm}>
              ×
            </button>
            <form onSubmit={handleSubmit} className="form">
              <div className="formGroup">
                <label className="label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editingWorker.name}
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
                <label className="label">Position</label>
                <input
                  type="text"
                  name="position"
                  value={editingWorker.position}
                  onChange={handleInputChange}
                  className="input"
                  required
                />
              </div>
              <div className="formGroup">
                <label className="label">Specialty</label>
                <input
                  type="text"
                  name="specialty"
                  value={editingWorker.specialty}
                  onChange={handleInputChange}
                  className="input"
                  required
                />
              </div>
              <div className="formGroup">
                <label className="label">Years of Experience</label>
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
                <label className="label">Description</label>
                <div className="editor-controls">
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={`editor-button ${
                      editor?.isActive('bold') ? 'active' : ''
                    }`}
                  >
                    Bold
                  </button>
                </div>
                <div className="editor-container">
                  <EditorContent editor={editor} />
                </div>
              </div>
              <div className="formGroup">
                <label className="label">Photo</label>
                <input
                  type="file"
                  onChange={handlePhotoChange}
                  accept="image/*"
                  className="input"
                />
                {editingWorker.currentPhotoPath && (
                  <div className="imageContainer">
                    <span className="imageLabel">Current Photo:</span>
                    <img
                      src={editingWorker.currentPhotoPath}
                      alt="Current"
                      className="previewImage"
                    />
                  </div>
                )}
                {editingWorker.photo && (
                  <div className="imageContainer">
                    <span className="imageLabel">New Photo Preview:</span>
                    <img
                      src={URL.createObjectURL(editingWorker.photo)}
                      alt="Preview"
                      className="previewImage"
                    />
                  </div>
                )}
              </div>
              <div className="formGroup">
                <label className="label">Photo Offset</label>
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
              <div className="formGroup">
                <label className="label">Facebook Link</label>
                <input
                  type="url"
                  name="facebook"
                  value={editingWorker.links.facebook || ''}
                  onChange={(e) =>
                    setEditingWorker({
                      ...editingWorker,
                      links: {
                        ...editingWorker.links,
                        facebook: e.target.value,
                      },
                    })
                  }
                  className="input"
                />
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
                <span className="checkboxLabel">Display in Circle (max 6)</span>
              </div>
              <div className="formActions">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="cancelButton"
                >
                  Cancel
                </button>
                <button type="submit" className="saveButton">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid">
        {workers.map((worker) => (
          <div key={worker.id} className="card">
            <img
              src={getWorkerPhotoUrl(worker.photo)}
              alt={worker.name}
              className="cardImage"
              style={{ objectPosition: `center ${worker.iconPhotoOffsetY}` }}
            />
            <div className="cardContent">
              <h3 className="cardTitle">{worker.name}</h3>
              <p className="cardPosition">{worker.position}</p>
              <p className="cardSpecialty">{worker.specialty}</p>
              <div
                className="cardDescription"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(worker.description),
                }}
              />
              <div className="cardActions">
                <button
                  onClick={() => handleEditWorker(worker)}
                  className="editButton"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteWorker(worker)}
                  className="deleteButton"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkersTab;
