import React, { useState, useEffect } from 'react';
import { Worker } from '../../types/worker';
import { workerService } from '../../services/workerService';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useLanguage } from '../../context/LanguageContext';

interface ValidationErrors {
  nameEn?: string;
  nameUk?: string;
  positionEn?: string;
  positionUk?: string;
  specialtyEn?: string;
  specialtyUk?: string;
  years?: string;
  descriptionEn?: string;
  descriptionUk?: string;
}

interface EditingWorker extends Omit<Worker, 'photo' | 'years' | 'id'> {
  id?: number;
  photo?: File;
  currentPhotoPath?: string;
  years: number | null;
}

interface WorkersFormModalProps {
  editingWorker: EditingWorker | null;
  onClose: () => void;
  onSave: (worker: Worker) => void;
  workers: Worker[];
}

const WorkersFormModal: React.FC<WorkersFormModalProps> = ({
  editingWorker,
  onClose,
  onSave,
  workers,
}) => {
  const { t } = useLanguage();
  const [worker, setWorker] = useState<EditingWorker | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [offsetPreview, setOffsetPreview] = useState<string>('0%');
  const [tempImagePath, setTempImagePath] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const editorEn = useEditor({
    extensions: [StarterKit],
    content: '',
    onUpdate: ({ editor }) => {
      if (worker) {
        setWorker({
          ...worker,
          descriptionEn: editor.getHTML(),
        });
      }
    },
  });

  const editorUk = useEditor({
    extensions: [StarterKit],
    content: '',
    onUpdate: ({ editor }) => {
      if (worker) {
        setWorker({
          ...worker,
          descriptionUk: editor.getHTML(),
        });
      }
    },
  });

  useEffect(() => {
    if (editingWorker) {
      setWorker(editingWorker);
      setOffsetPreview(editingWorker.iconPhotoOffsetY || '0%');
      setTempImagePath(null);
    }
  }, [editingWorker]);

  useEffect(() => {
    if (editorEn && editorUk && worker) {
      editorEn.commands.setContent(worker.descriptionEn || '');
      editorUk.commands.setContent(worker.descriptionUk || '');
    }
  }, [worker?.id, editorEn, editorUk]);

  useEffect(() => {
    if (touched.descriptionEn) {
      setValidationErrors((prev) => ({
        ...prev,
        descriptionEn:
          !editorEn?.getHTML() || editorEn.getHTML() === '<p></p>'
            ? t('admin.validation.required')
            : undefined,
      }));
    }
  }, [editorEn?.getHTML(), touched.descriptionEn, t]);

  useEffect(() => {
    if (touched.descriptionUk) {
      setValidationErrors((prev) => ({
        ...prev,
        descriptionUk:
          !editorUk?.getHTML() || editorUk.getHTML() === '<p></p>'
            ? t('admin.validation.required')
            : undefined,
      }));
    }
  }, [editorUk?.getHTML(), touched.descriptionUk, t]);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && worker) {
      try {
        setIsUploading(true);
        const newPhotoPath = await workerService.uploadPhoto(file);

        if (tempImagePath) {
          try {
            await workerService.deletePhoto(tempImagePath);
          } catch (error) {
            console.error('Error deleting previous temp photo:', error);
          }
        }

        setTempImagePath(newPhotoPath);
        setWorker({
          ...worker,
          photo: file,
        });
      } catch (error) {
        console.error('Error uploading photo:', error);
        onSave({ error: 'Error uploading photo. Please try again.' } as any);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const validateField = (name: string, value: any): string | undefined => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return t('admin.validation.required');
    }

    if (name === 'years' && (value === null || value < 0)) {
      return t('admin.validation.required');
    }

    return undefined;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!worker) return;

    const { name, value, type } = e.target;

    let newValue: string | number | null = value;
    if (name === 'years') {
      newValue = value === '' ? null : parseFloat(value);
    } else if (type === 'number') {
      newValue = parseFloat(value);
    }

    const updatedWorker = {
      ...worker,
      [name]: newValue,
    };
    setWorker(updatedWorker);

    if (touched[name]) {
      const error = validateField(name, newValue);
      setValidationErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (field: string) => {
    if (!worker) return;

    setTouched((prev) => ({ ...prev, [field]: true }));

    const value = worker[field as keyof EditingWorker];
    const error = validateField(field, value);
    setValidationErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const handleOffsetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const offset = `${value}%`;
    setOffsetPreview(offset);
    if (worker) {
      setWorker({
        ...worker,
        iconPhotoOffsetY: offset,
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;

    if (!worker) return false;

    if (!worker.nameEn?.trim()) {
      errors.nameEn = t('admin.validation.required');
      isValid = false;
    }

    if (!worker.nameUk?.trim()) {
      errors.nameUk = t('admin.validation.required');
      isValid = false;
    }

    if (!worker.positionEn?.trim()) {
      errors.positionEn = t('admin.validation.required');
      isValid = false;
    }

    if (!worker.positionUk?.trim()) {
      errors.positionUk = t('admin.validation.required');
      isValid = false;
    }

    if (!worker.specialtyEn?.trim()) {
      errors.specialtyEn = t('admin.validation.required');
      isValid = false;
    }

    if (!worker.specialtyUk?.trim()) {
      errors.specialtyUk = t('admin.validation.required');
      isValid = false;
    }

    if (!worker.years || worker.years < 0) {
      errors.years = t('admin.validation.required');
      isValid = false;
    }

    if (!editorEn?.getHTML() || editorEn.getHTML() === '<p></p>') {
      errors.descriptionEn = t('admin.validation.required');
      isValid = false;
    }

    if (!editorUk?.getHTML() || editorUk.getHTML() === '<p></p>') {
      errors.descriptionUk = t('admin.validation.required');
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!worker) return;

    const allFields = [
      'nameEn',
      'nameUk',
      'positionEn',
      'positionUk',
      'specialtyEn',
      'specialtyUk',
      'years',
      'descriptionEn',
      'descriptionUk',
    ];
    setTouched(
      allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {})
    );

    if (!validateForm()) {
      onSave({ error: t('admin.validation.checkFields') } as any);
      return;
    }

    try {
      setIsSaving(true);
      let photoPath = worker.currentPhotoPath || '';

      if (worker.photo) {
        photoPath = await workerService.uploadPhoto(worker.photo);

        if (worker.currentPhotoPath && worker.currentPhotoPath !== photoPath) {
          try {
            await workerService.deletePhoto(worker.currentPhotoPath);
          } catch (error) {
            console.error('Error deleting old photo:', error);
          }
        }
      }

      const workerData: Worker = {
        ...worker,
        id: worker.id || Math.max(...workers.map((w) => w.id), 0) + 1,
        photo: photoPath,
        years: worker.years || 0,
        descriptionEn: editorEn?.getHTML() || '',
        descriptionUk: editorUk?.getHTML() || '',
        links: worker.links || {},
      };

      onSave(workerData);
      handleClose();
    } catch (error) {
      console.error('Error saving worker:', error);
      onSave({ error: 'Error saving worker. Please try again.' } as any);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = async () => {
    if (tempImagePath) {
      try {
        await workerService.deletePhoto(tempImagePath);
      } catch (error) {
        console.error('Error deleting temporary photo:', error);
      }
    }

    setWorker(null);
    setTempImagePath(null);
    setValidationErrors({});
    setTouched({});
    if (editorEn && editorUk) {
      editorEn.commands.setContent('');
      editorUk.commands.setContent('');
    }
    onClose();
  };

  if (!worker) return null;

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h2 className="modalTitle">
          {worker.id ? t('admin.worker.edit') : t('admin.worker.add')}
        </h2>
        <button className="modalClose" onClick={handleClose}>
          ×
        </button>
        <form onSubmit={handleSubmit} className="form">
          <div className="formGroup">
            <label className="label">Name (English)</label>
            <input
              type="text"
              name="nameEn"
              value={worker.nameEn}
              onChange={handleInputChange}
              onBlur={() => handleBlur('nameEn')}
              className={`input ${
                touched.nameEn && validationErrors.nameEn ? 'error' : ''
              }`}
              required
            />
            {touched.nameEn && validationErrors.nameEn && (
              <span className="error-text">{validationErrors.nameEn}</span>
            )}
          </div>

          <div className="formGroup">
            <label className="label">Name (Ukrainian)</label>
            <input
              type="text"
              name="nameUk"
              value={worker.nameUk}
              onChange={handleInputChange}
              onBlur={() => handleBlur('nameUk')}
              className={`input ${
                touched.nameUk && validationErrors.nameUk ? 'error' : ''
              }`}
              required
            />
            {touched.nameUk && validationErrors.nameUk && (
              <span className="error-text">{validationErrors.nameUk}</span>
            )}
          </div>

          <div className="formGroup">
            <label className="label">Position (English)</label>
            <input
              type="text"
              name="positionEn"
              value={worker.positionEn}
              onChange={handleInputChange}
              onBlur={() => handleBlur('positionEn')}
              className={`input ${
                touched.positionEn && validationErrors.positionEn ? 'error' : ''
              }`}
              required
            />
            {touched.positionEn && validationErrors.positionEn && (
              <span className="error-text">{validationErrors.positionEn}</span>
            )}
          </div>

          <div className="formGroup">
            <label className="label">Position (Ukrainian)</label>
            <input
              type="text"
              name="positionUk"
              value={worker.positionUk}
              onChange={handleInputChange}
              onBlur={() => handleBlur('positionUk')}
              className={`input ${
                touched.positionUk && validationErrors.positionUk ? 'error' : ''
              }`}
              required
            />
            {touched.positionUk && validationErrors.positionUk && (
              <span className="error-text">{validationErrors.positionUk}</span>
            )}
          </div>

          <div className="formGroup">
            <label className="label">Specialty (English)</label>
            <input
              type="text"
              name="specialtyEn"
              value={worker.specialtyEn}
              onChange={handleInputChange}
              onBlur={() => handleBlur('specialtyEn')}
              className={`input ${
                touched.specialtyEn && validationErrors.specialtyEn
                  ? 'error'
                  : ''
              }`}
              required
            />
            {touched.specialtyEn && validationErrors.specialtyEn && (
              <span className="error-text">{validationErrors.specialtyEn}</span>
            )}
          </div>

          <div className="formGroup">
            <label className="label">Specialty (Ukrainian)</label>
            <input
              type="text"
              name="specialtyUk"
              value={worker.specialtyUk}
              onChange={handleInputChange}
              onBlur={() => handleBlur('specialtyUk')}
              className={`input ${
                touched.specialtyUk && validationErrors.specialtyUk
                  ? 'error'
                  : ''
              }`}
              required
            />
            {touched.specialtyUk && validationErrors.specialtyUk && (
              <span className="error-text">{validationErrors.specialtyUk}</span>
            )}
          </div>

          <div className="formGroup">
            <label className="label">{t('admin.worker.years')}</label>
            <input
              type="number"
              name="years"
              value={worker.years === null ? '' : worker.years}
              onChange={handleInputChange}
              onBlur={() => handleBlur('years')}
              className={`input ${
                touched.years && validationErrors.years ? 'error' : ''
              }`}
              required
              step="0.5"
              min="0"
            />
            {touched.years && validationErrors.years && (
              <span className="error-text">{validationErrors.years}</span>
            )}
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
            <div
              className={`editor-container ${
                touched.descriptionEn && validationErrors.descriptionEn
                  ? 'error'
                  : ''
              }`}
            >
              <EditorContent
                editor={editorEn}
                onBlur={() => handleBlur('descriptionEn')}
              />
            </div>
            {touched.descriptionEn && validationErrors.descriptionEn && (
              <span className="error-text">
                {validationErrors.descriptionEn}
              </span>
            )}
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
            <div
              className={`editor-container ${
                touched.descriptionUk && validationErrors.descriptionUk
                  ? 'error'
                  : ''
              }`}
            >
              <EditorContent
                editor={editorUk}
                onBlur={() => handleBlur('descriptionUk')}
              />
            </div>
            {touched.descriptionUk && validationErrors.descriptionUk && (
              <span className="error-text">
                {validationErrors.descriptionUk}
              </span>
            )}
          </div>

          <div className="formGroup">
            <label className="label">{t('admin.worker.photo')}</label>
            <div className={`form-group ${isUploading ? 'uploading' : ''}`}>
              <input
                type="file"
                onChange={handlePhotoChange}
                accept="image/*"
                className="input"
                disabled={isUploading}
                data-choose-text={t('admin.worker.photo')}
              />
              {isUploading && (
                <div className="upload-status">{t('admin.news.uploading')}</div>
              )}
              {worker.currentPhotoPath && (
                <div className="imageContainer">
                  <span className="imageLabel">
                    {t('admin.worker.currentPhoto')}:
                  </span>
                  <img
                    src={worker.currentPhotoPath}
                    alt="Current"
                    className="previewImage"
                  />
                </div>
              )}
              {worker.photo && (
                <div className="imageContainer">
                  <span className="imageLabel">
                    {t('admin.worker.newPhoto')}:
                  </span>
                  <img
                    src={URL.createObjectURL(worker.photo)}
                    alt="Preview"
                    className="previewImage"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="formGroup">
            <label className="label">{t('admin.worker.photoOffset')}</label>
            <div className="photoPreviewSection">
              <div className="photoPreviewContainer">
                <div className="photoPreviewInner">
                  {(worker.photo || worker.currentPhotoPath) && (
                    <img
                      src={
                        worker.photo
                          ? URL.createObjectURL(worker.photo)
                          : worker.currentPhotoPath
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
              checked={worker.isDisplayedInCircle}
              onChange={(e) =>
                setWorker({
                  ...worker,
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
              value={worker.links?.facebook || ''}
              onChange={(e) =>
                setWorker({
                  ...worker,
                  links: {
                    ...(worker.links || {}),
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
              onClick={handleClose}
              className="cancelButton"
              disabled={isSaving}
            >
              {t('admin.worker.cancel')}
            </button>
            <button
              type="submit"
              className={`saveButton ${isSaving ? 'loading' : ''}`}
              disabled={isUploading || isSaving}
            >
              {t('admin.worker.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkersFormModal;
