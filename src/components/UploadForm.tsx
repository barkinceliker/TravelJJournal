// UploadForm.tsx
import { useState } from "react";
import useStorage from "../hooks/useStorage";

const UploadForm = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [locationAddress, setLocationAddress] = useState<string>('');
  const { startUpload, progress, error } = useStorage();
  const [isUploading, setIsUploading] = useState(false); // Add isUploading state

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationAddress(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedFile && !isUploading) {
      setIsUploading(true);

      try {
        await startUpload(selectedFile, locationAddress);
        setSelectedFile(null);
        setLocationAddress('');
      } catch (uploadError) {
        console.error(uploadError);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="text-center mt-10">
      <form onSubmit={handleSubmit} className="flex items-center flex-col gap-8">
        <input
          type="file"
          onChange={handleFileChange}
          className="file-input file-input-bordered w-full max-w-xs"
        />
        <input
          type="text"
          placeholder="Enter location"
          value={locationAddress}
          onChange={handleLocationChange}
          className="text-input w-full max-w-xs"
        />
        <button
          type="submit"
          className={`btn btn-neutral gap-3 ${isUploading ? 'loading' : ''}`}
          disabled={!selectedFile || isUploading}
        >
          <p>Upload</p> <span>🛫</span>
        </button> 

        {Boolean(progress) && (
          <div>
            <p>Progress: {progress}%</p>
            <div style={{ width: '100%', height: '10px', background: '#ddd' }}>
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: '#4caf50',
                }}
              />
            </div>
          </div>
        )}
        {error && <p>Error: {error.message}</p>}
      </form>
    </div>
  );
};

export default UploadForm;
