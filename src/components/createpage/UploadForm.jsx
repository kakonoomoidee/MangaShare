import { useState } from "react";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, auth, storage } from "../../lib/firebase"; // Pastikan konfigurasi ini sesuai dengan Firebase Anda
import { useRouter } from "next/navigation";
import Slider from "react-slick";
import { useDropzone } from "react-dropzone";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [serving, setServing] = useState("1");
  const [servingError, setServingError] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [photoUrls, setPhotoUrls] = useState([]);
  const router = useRouter();

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setPhotos((prevPhotos) => [...prevPhotos, ...acceptedFiles]);
      const newUrls = acceptedFiles.map((file) => URL.createObjectURL(file));
      setPhotoUrls((prevUrls) => [...prevUrls, ...newUrls]);
    },
  });

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  const getUniqueTitle = async (baseTitle) => {
    const postsRef = collection(db, "foodPosts");
    const q = query(postsRef, where("title", "==", baseTitle));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return baseTitle;
    } else {
      let count = 1;
      let newTitle = `${baseTitle} (${count})`;
      while (!snapshot.empty) {
        count++;
        newTitle = `${baseTitle} (${count})`;
        const q = query(postsRef, where("title", "==", newTitle));
        const snapshot = await getDocs(q);
      }
      return newTitle;
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setUploading(true);

    if (isNaN(serving)) {
      setServingError("Serving size must be a number");
      setUploading(false);
      return;
    } else {
      setServingError("");
    }

    try {
      const uniqueTitle = await getUniqueTitle(title);

      // Mengunggah gambar dan mendapatkan URL-nya
      const uploadedPhotoUrls = await Promise.all(
        photos.map(async (photo) => {
          const photoRef = ref(
            storage,
            `foodPhotos/${auth.currentUser.uid}/${uniqueTitle}/${photo.name}`
          );
          await uploadBytes(photoRef, photo);
          return await getDownloadURL(photoRef); // Dapatkan URL gambar yang diunggah
        })
      );

      // Menyimpan data ke Firestore
      await addDoc(collection(db, "foodPosts"), {
        title: uniqueTitle,
        servings: serving,
        ingredients: ingredients.split(",").map((item) => item.trim()),
        instructions,
        photoUrls: uploadedPhotoUrls, // Array URL gambar
        userId: auth.currentUser.uid,
        createdAt: new Date(),
        likes: 0,
        comments: 0,
      });

      // Reset form fields after successful submission
      setTitle("");
      setServing("1");
      setServingError("");
      setIngredients("");
      setInstructions("");
      setPhotos([]);
      setPhotoUrls([]);

      router.push("/create");
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-800 p-6">
      <div className="bg-gray-900  w-[70vw] p-6 rounded-lg shadow-lg flex">
        <div className="w-1/2 overflow-hidden rounded-lg mr-4">
          {photoUrls.length > 0 ? (
            <Slider {...sliderSettings}>
              {photoUrls.map((url, index) => (
                <div
                  key={index}
                  className="w-full h-full flex items-center justify-center"
                >
                  <img
                    src={url}
                    alt={`Post ${index}`}
                    className="max-w-full max-h-full object-cover"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ))}
            </Slider>
          ) : (
            <div
              {...getRootProps()}
              className="text-center text-gray-400 p-4 h-full flex items-center justify-center border-dashed border-2 border-gray-500 rounded-lg"
            >
              <input {...getInputProps()} />
              <p>Drag & drop some files here, or click to select files</p>
            </div>
          )}
        </div>

        <div className="w-1/2 flex flex-col">
          <form
            onSubmit={handleSave}
            className="flex flex-col h-full space-y-4"
          >
            <div>
              <h4 className="text-lg font-semibold text-white mb-1">Title:</h4>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
              />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-1">
                Serving Size:
              </h4>
              <input
                type="text"
                value={serving}
                onChange={(e) => setServing(e.target.value)}
                required
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
              />
              {servingError && (
                <p className="text-red-500 text-sm mt-1">{servingError}</p>
              )}
            </div>
            <div className="flex-grow">
              <h4 className="text-lg font-semibold text-white mb-1">
                Ingredients:
              </h4>
              <textarea
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                required
                rows="4"
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                placeholder="Separate ingredients with commas"
              />
            </div>
            <div className="flex-grow">
              <h4 className="text-lg font-semibold text-white mb-1">
                Instructions:
              </h4>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                required
                rows="6"
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                placeholder="give some instructur how to "
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
              disabled={uploading} // Disable button while uploading
            >
              {uploading ? "Uploading..." : "Create Post"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
