import React, { useEffect, useState } from "react";
import './BookForm.css'
import axiost from "../../../axiosConfig.js";
import { getFirebaseToken } from "../firebase/getFirebaseToken";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";


const BookForm = ({ uploadNotUpdate = true }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedGenreIds, setSelectedGenreIds] = useState([]);
  const [price, setPrice] = useState("");
  const [writer, setWriter] = useState("");
  const [pageNumber, setPageNumber] = useState("");
  const [datePublished, setDatePublished] = useState("");
  const [language, setLanguage] = useState("");
  const [bookDimension, setBookDimension] = useState("");
  const [barcode, setBarcode] = useState("");
  const [isbn, setIsbn] = useState("");
  const [editionNumber, setEditionNumber] = useState("");

  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);
  
  let params = null;
  let fetchBook = null, fetchDiscount;
  const [book, setBook] = useState({});
  let handleUpdate = null;
  const [discount, setDiscount] = useState({});
  const [endDate, setEndDate] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  let handleAddDiscount = null;
  let handleDelete = null;
  const [showModal, setShowModal] = useState(false);
  let handleReupload = null;
  if (uploadNotUpdate == false) {
    params = useParams();

    fetchBook = async (id) => {
      try {
        const token = await getFirebaseToken();
        const fetchedBook = await axiost.get(`${process.env.REACT_APP_API_BASE_URL}/book/get-publisher-bookId/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        setBook(fetchedBook.data || {});
        setName(fetchedBook.data.name || "");
        setDescription(fetchedBook.data.description || "");
        setSelectedGenreIds(fetchedBook.data.genres?.map((genre) => genre.id) || []);
        setPrice(fetchedBook.data.price || "");
        setWriter(fetchedBook.data.writer || "");
        setPageNumber(fetchedBook.data.pageNumber || "");
        setDatePublished(fetchedBook.data.datePublished || "");
        setLanguage(fetchedBook.data.language || "");
        setBookDimension(fetchedBook.data.bookDimension || "");
        setBarcode(fetchedBook.data.barcode || "");
        setIsbn(fetchedBook.data.isbn || "");
        setEditionNumber(fetchedBook.data.editionNumber || "");
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchDiscount = async (id) => {
      try {
        const fetchedDiscount = await axiost.get(`${process.env.REACT_APP_API_BASE_URL}/discount/get-discount/${id}`);
        setDiscount(fetchedDiscount.data || {});
      } catch (error) {
        console.log(error.message);
      }
    };

    useEffect(() => {
      fetchBook(params.id); 
      fetchDiscount(params.id);
    }, []);

    handleUpdate = async (e) => {
      e.preventDefault();
      try {
        const imagePath = 'bird.png';
        const requestBody = { 
          'name': name, 
          'description': description, 
          'price': parseFloat(price), 
          'writer': writer, 
          'pageNumber': parseInt(pageNumber), 
          'datePublished': parseInt(datePublished), 
          'language': language, 
          'bookDimension': bookDimension, 
          'barcode': barcode, 
          'isbn': isbn, 
          'editionNumber': editionNumber, 
          'imagePath': imagePath, 
          'genres': selectedGenreIds }

        console.log(requestBody);
        const token = await getFirebaseToken();
  
        const response = await axiost.patch(
          `${process.env.REACT_APP_API_BASE_URL}/book/update-book/${book.id}`, 
          requestBody, {
            headers: { Authorization: `Bearer ${token}` },
          });
  
        toast.success(`${book.name} successfully updated!`, {
          position: "top-right",
          autoClose: 2000,
        });
      } catch (error) {
        console.log(error.message);
      }
    };

    handleAddDiscount = async (e) => {
      e.preventDefault();
      try {
        const requestBody = { 
          'bookId': parseInt(book.id),
          'discountPercentage': parseInt(discountPercentage),
          'startDate': new Date(new Date().getTime() + 3000),
          'endDate': new Date(endDate),
        };

        const token = await getFirebaseToken();
  
        const response = await axiost.post(
          `${process.env.REACT_APP_API_BASE_URL}/discount/add-discount`, 
          requestBody, {
            headers: { Authorization: `Bearer ${token}` },
          });
  
        setTimeout(function() {
          navigate("/publisher-panel");
        }, 3000);
      } catch (error) {
        console.log(error.message);
      }
    };

    handleDelete = async () => {
      try {
        const token = await getFirebaseToken();
  
        const response = await axiost.delete(
          `${process.env.REACT_APP_API_BASE_URL}/book/delete-book/${book.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

        setShowModal(false);
        navigate("/publisher-panel");
        toast.warning(`${book.name} is deleted.`, {
          position: "top-right",
          autoClose: 2000,
        });
      } catch (error) {
        console.log(error.message);
      }
    };

    handleReupload = async () => {
      try {
        const token = await getFirebaseToken();
  
        const response = await axiost.post(
          `${process.env.REACT_APP_API_BASE_URL}/book/reupload-book/${book.id}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
          });

        setShowModal(false);
        navigate("/publisher-panel");
        toast.success(`${book.name} is reuploaded to the store.`, {
          position: "top-right",
          autoClose: 2000,
        });
      } catch (error) {
        console.log(error.message);
      }
    };
  }

  const fetchGenres = async () => {
    try {
      const response = await axiost.get(`${process.env.REACT_APP_API_BASE_URL}/genre/get-all-genres`);
      const sortedGenres = response.data.sort((a, b) => a.name.localeCompare(b.name));
      setGenres(sortedGenres);
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    fetchGenres();
  }, []);

  const toggleGenre = (id) => {
    setSelectedGenreIds((prev) =>
      prev.includes(id) ? prev.filter((genreId) => genreId !== id) : [...prev, id]
    );
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const imagePaths = [
        "bird.png",
        "castle.png",
        "flower.png",
        "horse.png",
        "jungle.png",
        "night.png",
        "sword.png",
        "girl.png"
      ];
      const randomIndex = Math.floor(Math.random() * imagePaths.length);

      const requestBody = { 
        'name': name, 
        'description': description, 
        'price': parseFloat(price), 
        'writer': writer, 
        'pageNumber': parseInt(pageNumber), 
        'datePublished': parseInt(datePublished), 
        'language': language, 
        'bookDimension': bookDimension, 
        'barcode': barcode, 
        'isbn': isbn, 
        'editionNumber': editionNumber, 
        'imagePath': imagePaths[randomIndex], 
        'genres': selectedGenreIds }
      const token = await getFirebaseToken();

      const response = await axiost.post(
        `${process.env.REACT_APP_API_BASE_URL}/book/upload-book`, 
        requestBody, {
          headers: { Authorization: `Bearer ${token}` },
        });

      navigate("/publisher-panel");
      toast.success(`${requestBody.name} is uploaded to the store.`, {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const getFormattedTime = () => {
    const dt = new Date();
    const padL = (nr, len = 2, chr = '0') => `${nr}`.padStart(len, chr);

    return `${
        dt.getFullYear()}-${
        padL(dt.getMonth()+1)}-${
        padL(dt.getDate())}T${
        padL(dt.getHours())}:${
        padL(dt.getMinutes())}`;
  };

  return (
    <>
    <div className="register-container">
      <h1 className="register-title">
        {uploadNotUpdate ? (<>Upload a New Book</>) : (<>Update {book.name}</>)}
      </h1>
      <form onSubmit={uploadNotUpdate ? handleUpload : handleUpdate} className="register-form">
        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            type="text" defaultValue={uploadNotUpdate ? null : book.name}
            className="form-control"
            placeholder="Enter the name"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            defaultValue={uploadNotUpdate ? null : book.description}
            className="form-control"
            placeholder="Enter the description"
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="form-group">
          <label className="form-label">Genres</label>
          <div className="genres-container">
            {genres.map((genre) => (
              <button
                key={genre.id}
                type="button"
                onClick={() => toggleGenre(genre.id)}
                className={`genre-button ${selectedGenreIds.includes(genre.id) ? "selected" : ""
                  }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Price</label>
          <input
            type="number" step="0.01" min="0" defaultValue={uploadNotUpdate ? null : book.price}
            className="form-control"
            placeholder="Enter the price"
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Author Name</label>
          <input
            type="text" defaultValue={uploadNotUpdate ? null : book.writer}
            className="form-control"
            placeholder="Enter the author name"
            onChange={(e) => setWriter(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Number of pages</label>
          <input
            type="number" min="0" defaultValue={uploadNotUpdate ? null : book.pageNumber}
            className="form-control"
            placeholder="Enter the number of pages"
            onChange={(e) => setPageNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Publish Year</label>
          <input
            type="number" min="0" defaultValue={uploadNotUpdate ? null : book.datePublished}
            className="form-control"
            placeholder="Enter the date"
            onChange={(e) => setDatePublished(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Language</label>
          <input
            type="text" defaultValue={uploadNotUpdate ? null : book.language}
            className="form-control"
            placeholder="Enter the Language"
            onChange={(e) => setLanguage(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Book Dimensions</label>
          <input
            type="text" defaultValue={uploadNotUpdate ? null : book.bookDimension}
            className="form-control"
            placeholder="Enter the book dimensions"
            onChange={(e) => setBookDimension(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Barcode</label>
          <input
            type="text" defaultValue={uploadNotUpdate ? null : book.barcode}
            className="form-control"
            placeholder="Enter the barcode"
            onChange={(e) => setBarcode(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">ISBN</label>
          <input
            type="text" defaultValue={uploadNotUpdate ? null : book.isbn}
            className="form-control"
            placeholder="Enter the ISBN"
            onChange={(e) => setIsbn(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Edition</label>
          <input
            type="number" min="0" defaultValue={uploadNotUpdate ? null : book.editionNumber}
            className="form-control"
            placeholder="Enter the edition number"
            onChange={(e) => setEditionNumber(e.target.value)}
            required
          />
        </div>
        <div className="submit-button-div">
          <button type="submit" className="submit-button">
            {uploadNotUpdate ? (<>Upload</>) : (<>Update</>)}
          </button>
        </div>
      </form>
      {uploadNotUpdate ? null : (
        <button onClick={() => setShowModal(true)} className="submit-button">
          {!book.isDeleted ? (<>Delete</>) : (<>Reupload</>) }
        </button>
      )}
    </div>
    {(uploadNotUpdate || book.isDeleted) ? null : (
    <div className="register-container">
      <h1 className="register-title">
        {Object.keys(discount).length === 0 ? (<>Add Discount</>) : (<>View Discount</>)}
      </h1>
      <form onSubmit={Object.keys(discount).length === 0 ? handleAddDiscount : null} className="register-form">
        <div className="form-group">
          <label className="form-label">End Date</label>
          <input
            type="datetime-local" min={getFormattedTime()} defaultValue={Object.keys(discount).length === 0 ? null : discount.endDate.slice(0, -1)}
            className="form-control"
            placeholder="Enter the end date"
            onChange={(e) => setEndDate(e.target.value)}
            required
            disabled={Object.keys(discount).length === 0 ? null : true}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Percentage</label>
          <input
            type="number" min="5" max="100" defaultValue={Object.keys(discount).length === 0 ? null : discount.discountPercentage}
            className="form-control"
            placeholder="Enter the percentage"
            onChange={(e) => setDiscountPercentage(e.target.value)}
            required
            disabled={Object.keys(discount).length === 0 ? null : true}
          />
        </div>
        {Object.keys(discount).length === 0 ? (
        <div className="submit-button-div">
          <button type="submit" className="submit-button">
            Add
          </button>
        </div>
        ) : null}
      </form>
    </div>
    )}
    {showModal && !book.isDeleted && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Confirm Delete</h2>
          <p>
            Your book will be deleted from the store. Are you sure?
          </p>
          <div className="modal-buttons">
            <button
              className="modal-cancel"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button
              className="modal-confirm-delete"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )}
    {showModal && book.isDeleted && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Confirm Reupload</h2>
          <p>
            Your book will be reuploaded to the store. Are you sure?
          </p>
          <div className="modal-buttons">
            <button
              className="modal-cancel"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button
              className="modal-confirm-reupload"
              onClick={handleReupload}
            >
              Reupload
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
export default BookForm;