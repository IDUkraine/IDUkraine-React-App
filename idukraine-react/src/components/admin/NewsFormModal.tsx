import React, { useRef, useState, useEffect } from 'react';
import { NewsItem, NewsCreateInput, NewsUpdateInput } from '../../types/news';
import { newsService } from '../../services/newsService';
import '../../assets/styles/modal.css';
import '../../assets/styles/news-management.css';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { useLanguage } from '../../context/LanguageContext';

interface NewsFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNews?: NewsItem | null;
  onSuccess: () => void;
}

const NewsFormModal: React.FC<NewsFormModalProps> = ({
  isOpen,
  onClose,
  selectedNews,
  onSuccess,
}) => {
  const { t } = useLanguage();
  const isEditing = !!selectedNews;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tempImagePath, setTempImagePath] = useState<string | null>(null);

  const editorEn = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'news-content-link',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({
        ...prev,
        textEn: editor.getHTML(),
      }));
    },
  });

  const editorUk = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'news-content-link',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({
        ...prev,
        textUk: editor.getHTML(),
      }));
    },
  });

  const initialFormState = {
    titleEn: '',
    titleUk: '',
    textEn: '',
    textUk: '',
    categoryEn: '',
    categoryUk: '',
    image: '',
    isTopNews: false,
    date: new Date().toISOString().split('T')[0],
  };

  const [formData, setFormData] = useState<NewsCreateInput>(initialFormState);

  useEffect(() => {
    if (selectedNews) {
      setFormData({
        titleEn: selectedNews.titleEn,
        titleUk: selectedNews.titleUk,
        textEn: selectedNews.textEn,
        textUk: selectedNews.textUk,
        categoryEn: selectedNews.categoryEn,
        categoryUk: selectedNews.categoryUk,
        image: selectedNews.image,
        isTopNews: selectedNews.isTopNews,
        date: new Date(selectedNews.date).toISOString().split('T')[0],
      });
      if (editorEn && editorUk) {
        editorEn.commands.setContent(selectedNews.textEn);
        editorUk.commands.setContent(selectedNews.textUk);
      }
      setTempImagePath(null);
    } else {
      resetForm();
    }
  }, [selectedNews, isOpen, editorEn, editorUk]);

  const resetForm = () => {
    setFormData(initialFormState);
    setTempImagePath(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (editorEn) {
      editorEn.commands.setContent('');
    }
    if (editorUk) {
      editorUk.commands.setContent('');
    }
  };

  const handleClose = async () => {
    if (tempImagePath) {
      try {
        await newsService.deleteImage(tempImagePath);
        console.log('Temporary image deleted:', tempImagePath);
      } catch (err) {
        console.error('Failed to delete temporary image:', tempImagePath, err);
      }
    }
    resetForm();
    onClose();
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name === 'text') return;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      if (tempImagePath) {
        try {
          await newsService.deleteImage(tempImagePath);
          console.log('Cleared previous temp image:', tempImagePath);
        } catch (err) {
          console.error(
            'Failed to delete image during file input clear:',
            tempImagePath,
            err
          );
        }
      }
      setTempImagePath(null);
      setFormData((prev) => ({ ...prev, image: selectedNews?.image || '' }));
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      if (tempImagePath) {
        try {
          await newsService.deleteImage(tempImagePath);
          console.log(
            'Deleted previous temp image before new upload:',
            tempImagePath
          );
        } catch (err) {
          console.error(
            'Failed to delete previous temporary image:',
            tempImagePath,
            err
          );
        }
      }

      const imagePath = await newsService.uploadImage(file);
      setTempImagePath(imagePath);
      setFormData((prev) => ({ ...prev, image: imagePath }));
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to upload image'
      );
      setTempImagePath(null);
      setFormData((prev) => ({ ...prev, image: selectedNews?.image || '' }));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isEditing && selectedNews) {
        await newsService.updateNews(
          selectedNews.id,
          formData as NewsUpdateInput
        );
      } else {
        await newsService.createNews(formData as NewsCreateInput);
      }

      setTempImagePath(null);
      resetForm();

      onSuccess();
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h2 className="modalTitle">
          {isEditing ? t('admin.news.editNews') : t('admin.news.addNews')}
        </h2>
        <button className="modal-close-btn" onClick={handleClose}>
          ×
        </button>
        <form onSubmit={handleSubmit} className="news-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label className="label">{t('admin.news.title')} (UK):</label>
              <input
                type="text"
                name="titleUk"
                value={formData.titleUk}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>
            <div className="form-group">
              <label className="label">{t('admin.news.title')} (EN):</label>
              <input
                type="text"
                name="titleEn"
                value={formData.titleEn}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="label">{t('admin.news.category')} (UK):</label>
              <input
                type="text"
                name="categoryUk"
                value={formData.categoryUk}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>
            <div className="form-group">
              <label className="label">{t('admin.news.category')} (EN):</label>
              <input
                type="text"
                name="categoryEn"
                value={formData.categoryEn}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="label">{t('admin.news.content')} (UK):</label>
            <div className="editor-buttons">
              <button
                type="button"
                onClick={() => editorUk?.chain().focus().toggleBold().run()}
                className={`editor-button ${
                  editorUk?.isActive('bold') ? 'active' : ''
                }`}
              >
                {t('admin.editor.bold')}
              </button>
              <button
                type="button"
                onClick={() =>
                  editorUk?.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={`editor-button ${
                  editorUk?.isActive('heading', { level: 2 }) ? 'active' : ''
                }`}
              >
                {t('admin.editor.h2')}
              </button>
              <button
                type="button"
                onClick={() =>
                  editorUk?.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={`editor-button ${
                  editorUk?.isActive('heading', { level: 3 }) ? 'active' : ''
                }`}
              >
                {t('admin.editor.h3')}
              </button>
              <button
                type="button"
                onClick={() => editorUk?.chain().focus().setParagraph().run()}
                className={`editor-button ${
                  editorUk?.isActive('paragraph') ? 'active' : ''
                }`}
              >
                {t('admin.editor.paragraph')}
              </button>
              <button
                type="button"
                onClick={() => {
                  const url = window.prompt('Enter URL:');
                  if (url && editorUk) {
                    editorUk.chain().focus().setLink({ href: url }).run();
                  }
                }}
                className={`editor-button ${
                  editorUk?.isActive('link') ? 'active' : ''
                }`}
              >
                {t('admin.editor.addLink')}
              </button>
              <button
                type="button"
                onClick={() => editorUk?.chain().focus().unsetLink().run()}
                className="editor-button"
                disabled={!editorUk?.isActive('link')}
              >
                {t('admin.editor.removeLink')}
              </button>
            </div>
            <div className="editor-container">
              <EditorContent editor={editorUk} className="editor-content" />
            </div>
          </div>

          <div className="form-group">
            <label className="label">{t('admin.news.content')} (EN):</label>
            <div className="editor-buttons">
              <button
                type="button"
                onClick={() => editorEn?.chain().focus().toggleBold().run()}
                className={`editor-button ${
                  editorEn?.isActive('bold') ? 'active' : ''
                }`}
              >
                {t('admin.editor.bold')}
              </button>
              <button
                type="button"
                onClick={() =>
                  editorEn?.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={`editor-button ${
                  editorEn?.isActive('heading', { level: 2 }) ? 'active' : ''
                }`}
              >
                {t('admin.editor.h2')}
              </button>
              <button
                type="button"
                onClick={() =>
                  editorEn?.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={`editor-button ${
                  editorEn?.isActive('heading', { level: 3 }) ? 'active' : ''
                }`}
              >
                {t('admin.editor.h3')}
              </button>
              <button
                type="button"
                onClick={() => editorEn?.chain().focus().setParagraph().run()}
                className={`editor-button ${
                  editorEn?.isActive('paragraph') ? 'active' : ''
                }`}
              >
                {t('admin.editor.paragraph')}
              </button>
              <button
                type="button"
                onClick={() => {
                  const url = window.prompt('Enter URL:');
                  if (url && editorEn) {
                    editorEn.chain().focus().setLink({ href: url }).run();
                  }
                }}
                className={`editor-button ${
                  editorEn?.isActive('link') ? 'active' : ''
                }`}
              >
                {t('admin.editor.addLink')}
              </button>
              <button
                type="button"
                onClick={() => editorEn?.chain().focus().unsetLink().run()}
                className="editor-button"
                disabled={!editorEn?.isActive('link')}
              >
                {t('admin.editor.removeLink')}
              </button>
            </div>
            <div className="editor-container">
              <EditorContent editor={editorEn} className="editor-content" />
            </div>
          </div>

          <div className="form-group">
            <label className="label">{t('admin.news.date')}:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="input"
              required
            />
          </div>

          <div className="form-group">
            <label className="label">{t('admin.news.image')}:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="input"
              disabled={isUploading}
            />
            {isUploading && (
              <div className="upload-status">{t('admin.news.uploading')}</div>
            )}
            {(formData.image || selectedNews?.image) && (
              <div className="image-preview">
                {selectedNews?.image &&
                  formData.image === selectedNews.image && (
                    <div className="imageContainer">
                      <span className="imageLabel">
                        {t('admin.news.currentImage')}:
                      </span>
                      <img
                        src={selectedNews.image}
                        alt="Current"
                        className="previewImage"
                      />
                    </div>
                  )}
                {formData.image && formData.image !== selectedNews?.image && (
                  <div className="imageContainer">
                    <span className="imageLabel">
                      {t('admin.news.newImage')}:
                    </span>
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="previewImage"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              name="isTopNews"
              checked={formData.isTopNews}
              onChange={handleInputChange}
              className="checkboxInput"
            />
            <span className="checkboxLabel">
              {t('admin.news.topNewsCheckbox')}
            </span>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleClose}
              className="cancel-button"
            >
              {t('admin.news.cancel')}
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isUploading}
            >
              {isEditing ? t('admin.news.update') : t('admin.news.add')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewsFormModal;
