// useStorage.ts
import { useState } from 'react';
import { uploadBytesResumable, getDownloadURL, ref } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { v4 as uuidv4 } from 'uuid';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { useAuth } from './useAuth';

const useStorage = () => {
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const startUpload = (file: File, locationAddress: string) => {
    if (!file) {
      return;
    }

    // Generate a unique fileId using uuid
    const fileId = uuidv4();

    // Extract file format from the file type
    const formatFile = file.type.split('/')[1];

    // Create a storage reference for the file
    const storageRef = ref(storage, `images/${fileId}.${formatFile}`);

    // Create an upload task for the file
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Set up event listeners for the upload task
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Update progress as the file is uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        setProgress(progress);
      },
      async (uploadError) => {
        // Handle errors during the upload
        setError(uploadError);
        console.error('Error during upload:', uploadError);
        setProgress(0); // Reset progress to 0 in case of an error
      },
      async () => {
        try {
          // Get the download URL for the uploaded file
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('Download URL:', downloadURL);

          // Set progress to 100% as the upload is complete
          setProgress(100);

          // Check if the downloadURL is undefined
          if (!downloadURL) {
            throw new Error('Download URL is undefined');
          }

          // Add a document to Firestore with relevant information
          const timestamp = Timestamp.fromDate(new Date()); // Firestore Timestamp
          await addDoc(collection(db, 'images'), {
            createdAt: timestamp,
            userEmail: user?.email,
            imageUrl: downloadURL,
            likes: 0, // Initial like count
            locationAddress: locationAddress,
          });

          console.log('Firestore Document Added:', {
            createdAt: timestamp,
            userEmail: user?.email,
            downloadURL,
            locationAddress,
          });
        } catch (uploadError) {
          // Handle errors during getting download URL or adding Firestore document
          setError(uploadError);
          console.error('Error getting download URL or adding Firestore document:', uploadError);
        }
      }
    );
  };

  return { progress, error, startUpload };
};

export default useStorage;
