
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";

type Image = {
  longitude: any;
  latitude: any;
  id: any;
  createdAt: Date;
  userEmail: string;
  imageUrl: string;
  likes: number;
  locationAddress: string;
};

const useFirestore = (collectionName: string) => {
  const [docs, setDocs] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let unsubscribe: () => void;

    const getData = async () => {
      try {
        const q = query(collection(db, collectionName), orderBy("createdAt", "desc"));
        unsubscribe = onSnapshot(q, (querySnapshot) => {
          const images: Image[] = [];
          querySnapshot.forEach((doc) => {
            const imageUrl = doc.data().imageUrl;
            const createdAt = doc.data().createdAt.toDate();
            const userEmail = doc.data().userEmail;
            const likes = doc.data().likes || 0;
            const locationAddress = doc.data().locationAddress || '';
            images.push({
              imageUrl,
              createdAt,
              userEmail,
              likes,
              id: doc.id,
              longitude: undefined,
              latitude: undefined,
              locationAddress,
            });
          });

          setDocs(images);
          setIsLoading(false);
        });
      } catch (error) {
        setIsLoading(false);
        console.error("Error getting documents:", error);
      }
    };

    getData();

    return () => unsubscribe && unsubscribe();
  }, [collectionName]);

  return { docs, isLoading };
};

export default useFirestore;
