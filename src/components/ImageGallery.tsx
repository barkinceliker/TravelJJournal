// ImageGallery.tsx
import { useEffect, useState } from 'react';
import LikeButton from './LikeButton';
import useFirestore from '../hooks/useFirestore';
import '../components/styles.css';

type Image = {
  id: any;
  createdAt: Date;
  userEmail: string;
  imageUrl: string;
  likes: number;
  latitude?: any;
  longitude?: any;
  locationAddress: string; // Added locationAddress to the Image type
};

const ImageGallery = () => {
  const { docs: images, isLoading } = useFirestore('images');

  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    if (selectedImage) {
      fetchLocationAddress(selectedImage.latitude, selectedImage.longitude);
    }
  }, [selectedImage]);

  const fetchLocationAddress = async (latitude: any, longitude: any) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch location address');
      }

      const data = await response.json();
      const address = data.results[0].formatted_address;

      setSelectedImage((prevImage) => ({
        ...prevImage!,
        locationAddress: address,
      }));
    } catch (error) {
      console.error('Error fetching location address:', error);
    }
  };

  const handleImageClick = (image: Image | null) => {
    setSelectedImage(image);
  };

  const filteredImages = images.filter((image) =>
    image.locationAddress.toLowerCase().includes(searchTerm)
  );

  if (isLoading) {
    return (
      <div className='text-center mt-10'>
        <progress className="progress w-56"></progress>
      </div>
    );
  }

  return (
    <div>
      <div className="flex mt-10 mb-4 justify-center">
        <input
          type="text"
          placeholder="Search location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mr-2 px-2 py-1 border border-gray-400 rounded"
        />
        {/* You can add the search button here if needed */}
      </div>

      <div className="grid md:grid-cols-3 justify-center gap-4 mt-10">
        {filteredImages.length > 0 ? (
          filteredImages.map((image) => (
            <div
              key={image.imageUrl}
              className="card card-compact w-full bg-base-100 shadow-2xl"
              onClick={() => handleImageClick(image)}
            >
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${image.locationAddress}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <figure className="h-48 relative overflow-hidden">
                  <img
                    src={image.imageUrl}
                    alt={`Travel`}
                    className="object-cover w-full h-full absolute inset-0"
                    onError={(e) => {
                      console.error(`Error loading image: ${image.imageUrl}`, e);
                    }}
                  />
                </figure>
              </a>
              <div className="card-body">
                {image && (
                  <>
                    <p>Upload by: {image.userEmail}</p>
                    <span>Created On: {image.createdAt.toLocaleDateString()}</span>
                    <p>Location: {image.locationAddress}</p>
                    <div className="avatar-group -space-x-6 rtl:space-x-reverse">
                      <div className="avatar">
                        <div className="w-8">
                          <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                        </div>
                      </div>
                      <div className="avatar">
                        <div className="w-8">
                          <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                        </div>
                      </div>
                      <div className="avatar">
                        <div className="w-8">
                          <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                        </div>
                      </div>
                      <div className="avatar placeholder">
                        <div className="w-8 bg-neutral text-neutral-content">
                          <span>+99</span>
                        </div>
                      </div>
                    </div>
                    <div className="avatar-group -space-x-6 rtl:space-x-reverse">
                      <LikeButton imageId={image.id} initialLikes={image.likes} />
                    </div>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center mx-auto">
  <div className="alert alert-warning ">
    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
    <span>Warning: Location not found!</span>
  </div>
</div>

        )}
      </div>
    </div>
  );
};

export default ImageGallery;
