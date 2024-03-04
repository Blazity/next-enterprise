import { faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useField, useFormikContext } from "formik";
import React, { useRef, useState } from "react";
import ErrorMessage from "./ErrorMessage";
import RequiredAsterisk from "./RequiredAsterisk";

interface FileInputProps {
  label: string;
  required?: boolean;
  name: string;
}

const FileInput: React.FC<FileInputProps> = ({ label, ...props }) => {
  const { required } = props;
  const [field, meta] = useField(props);
  const { setFieldValue } = useFormikContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false); // State to handle drag styling
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number } | null>(null); // State to store file info
  const [uploadProgress, setUploadProgress] = useState(0);

  const simulateUpload = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 20); // Adjust time interval to control speed of the animation
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    const file = files ? files[0] : null;
    setFieldValue(props.name, file); // Update Formik's state
    if (file) {
      setFileInfo({ name: file.name, size: file.size });
      setUploadProgress(0); // Reset progress
      simulateUpload(); // Simulate upload process
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false); // Reset drag state
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
        const file = files[0];
        if (file) {
          setFileInfo({ name: file.name, size: file.size });
          setFieldValue(props.name, file);
        }
        setUploadProgress(0); // Reset progress
        simulateUpload(); // Simulate upload process
    }
};


  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!dragging) {
      setDragging(true);
    }
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
  };

  return (
    <div className="mb-4">
      <label className="text-md" htmlFor={props.name}>
        {label}
        <RequiredAsterisk required={required} />
      </label>
      <div
        className={`border border-grey-500 rounded-md p-4 flex flex-col items-center gap-4 ${dragging ? "bg-blue-100" : "bg-white"} cursor-pointer`}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="border border-grey-500 border-dashed flex flex-col gap-4 items-center justify-center rounded-md py-9 w-full">
          <FontAwesomeIcon icon={faFile} className="text-amber-500 h-5 w-5" />
          <h4>Drag & Drop Here or <span className="font-bold">Browse</span></h4>
        </div>
        <button type="button" className="text-white px-12 py-2 rounded-md bg-blue-950 w-fit">Upload Manifest</button>
      </div>
      <input type="file" className="hidden" ref={fileInputRef} onChange={handleChange} />
      {fileInfo && (
          <div className="flex gap-4 p-4 items-center">
            <FontAwesomeIcon icon={faFile} className="text-amber-500 h-5 w-5" />
            <div className="grow">
              <div className="flex justify-between text-sm text-slate-500">
                <p className="text-sm">{fileInfo.name}</p>
                <p className="text-xs">{Math.round(fileInfo.size / 1024)} KB</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1 dark:bg-gray-700">
                <div className="bg-amber-500 h-1 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            </div>
          </div>
        )}
      <ErrorMessage touched={meta.touched} error={meta.error} />
    </div>
  );
};

export default FileInput;
