
import { useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface ContractEditorQuillProps {
  content: string;
  processedContent: string;
  onChange: (content: string) => void;
  isInitializing: boolean;
  previewClient?: boolean;
}

const ContractEditorQuill = ({
  content,
  processedContent,
  onChange,
  isInitializing,
  previewClient
}: ContractEditorQuillProps) => {
  const editorRef = useRef<ReactQuill>(null);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link'],
      ['clean'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }]
    ],
  };

  if (isInitializing) {
    return null;
  }

  return (
    <ReactQuill 
      ref={editorRef}
      theme="snow" 
      value={previewClient ? processedContent : content}
      onChange={onChange} 
      modules={modules}
      className="h-[450px] mb-12"
    />
  );
};

export default ContractEditorQuill;
