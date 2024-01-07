// LikeButton.js
import { useState, useEffect } from "react";
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Heart } from 'react-feather'; // Import the Heart icon
import "./styles.css";

interface LikeButtonProps {
  imageId: any;
  initialLikes: number;
}

function LikeButton({ imageId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    // Update likes in Firestore whenever it changes locally
    const updateLikesInFirestore = async () => {
      try {
        const imageRef = doc(db, 'images', imageId);
        await updateDoc(imageRef, { likes });
      } catch (error) {
        console.error('Error updating likes in Firestore:', error);
      }
    };

    updateLikesInFirestore();
  }, [imageId, likes]);

  return (
    <div className="like-button-container">
      <button
        className={`like-button ${liked ? 'liked' : ''}`}
        onClick={() => {
          setLikes(liked ? likes - 1 : likes + 1);
          setLiked(!liked);
        }}
      >
        <Heart size={20} /> {likes} Likes {/* Display the Heart icon */}
      </button>
    </div>
  );
}

export default LikeButton;
