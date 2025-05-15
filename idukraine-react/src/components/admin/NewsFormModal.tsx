import React, { useRef, useState, useEffect } from 'react';
import { NewsItem, NewsCreateInput, NewsUpdateInput } from '../../types/news';
import { newsService } from '../../services/newsService';
import '../../assets/styles/modal.css';
import '../../assets/styles/news-management.css';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';

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
  const isEditing = !!selectedNews;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tempImagePath, setTempImagePath] = useState<string | null>(null);

  const editor = useEditor({
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
        text: editor.getHTML(),
      }));
    },
  });

  const initialFormState = {
    title: '',
    text: '',
    category: '',
    image: '',
    isTopNews: false,
    date: new Date().toISOString().split('T')[0],
  };

  const [formData, setFormData] = useState<NewsCreateInput>(initialFormState);

  useEffect(() => {
    if (selectedNews) {
      setFormData({
        title: selectedNews.title,
        text: selectedNews.text,
        category: selectedNews.category,
        image: selectedNews.image,
        isTopNews: selectedNews.isTopNews,
        date: new Date(selectedNews.date).toISOString().split('T')[0],
      });
      if (editor) {
        editor.commands.setContent(selectedNews.text);
      }
      setTempImagePath(null);
    } else {
      resetForm();
    }
  }, [selectedNews, isOpen, editor]);

  const resetForm = () => {
    setFormData(initialFormState);
    setTempImagePath(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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

      onSuccess();
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const setLink = () => {
    const url = window.prompt('Enter URL:');
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const removeLink = () => {
    if (editor) {
      editor.chain().focus().unsetLink().run();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h2 className="modalTitle">{isEditing ? 'Edit News' : 'Add News'}</h2>
        <button className="modal-close-btn" onClick={handleClose}>
          ×
        </button>
        <form onSubmit={handleSubmit} className="news-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label className="label">Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="input"
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Content:</label>
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
              <button
                type="button"
                onClick={() =>
                  editor?.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={`editor-button ${
                  editor?.isActive('heading', { level: 2 }) ? 'active' : ''
                }`}
              >
                H2
              </button>
              <button
                type="button"
                onClick={() =>
                  editor?.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={`editor-button ${
                  editor?.isActive('heading', { level: 3 }) ? 'active' : ''
                }`}
              >
                H3
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().setParagraph().run()}
                className={`editor-button ${
                  editor?.isActive('paragraph') ? 'active' : ''
                }`}
              >
                Paragraph
              </button>
              <button
                type="button"
                onClick={setLink}
                className={`editor-button ${
                  editor?.isActive('link') ? 'active' : ''
                }`}
              >
                Add Link
              </button>
              {editor?.isActive('link') && (
                <button
                  type="button"
                  onClick={removeLink}
                  className="editor-button"
                >
                  Remove Link
                </button>
              )}
            </div>
            <div className="editor-container">
              <EditorContent editor={editor} />
            </div>
          </div>

          <div className="form-group">
            <label className="label">Category:</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="input"
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Date:</label>
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
            <label className="label">Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="input"
              disabled={isUploading}
            />
            {isUploading && <div className="upload-status">Uploading...</div>}
            {(formData.image || selectedNews?.image) && (
              <div className="image-preview">
                {selectedNews?.image &&
                  formData.image === selectedNews.image && (
                    <div className="imageContainer">
                      <span className="imageLabel">Current Image:</span>
                      <img
                        src={selectedNews.image}
                        alt="Current"
                        className="previewImage"
                      />
                    </div>
                  )}
                {formData.image && formData.image !== selectedNews?.image && (
                  <div className="imageContainer">
                    <span className="imageLabel">New Image Preview:</span>
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
            <span className="checkboxLabel">Display in Top News (max 3)</span>
          </div>

          <div className="button-group">
            <button
              type="button"
              onClick={handleClose}
              className="cancel-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isUploading}
            >
              {isEditing ? 'Update' : 'Add'} News
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewsFormModal;
