import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../../redux/apiCalls/profileApiCall";
import { Link, useParams } from "react-router-dom";
import "./profile.css";
import {
  deleteRating,
  fetchSingleUserRatings,
} from "../../redux/apiCalls/ratingApiCall";

function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { ratings, loading } = useSelector((state) => state.rating);
  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchUserProfile(id));
    dispatch(fetchSingleUserRatings(id));
  }, [id]);

  const handleDeleteRating = (ratingId) => {
    dispatch(deleteRating(ratingId));
  };
  return (
    <div className="profile">
      <div className="profile-top">{user.username}</div>
      <div className="profile-bottom">
        <div className="profile-bottom-right">
          <h2>المفضلة</h2>
        </div>
        <div className="profile-bottom-left">
          <h2>تقييماتك</h2>
          <div className="user-ratings-wrapper">
            {loading ? (
              <p>يتم التحميل...</p>
            ) : ratings.length ? (
              ratings.map((rating) => (
                <div className="user-rating" key={rating._id}>
                  <Link
                    to={`/workshop-owner/profile/${rating.workshopOwner._id}`}
                  >
                    <p>ورشة: {rating.workshopOwner.workshopName}</p>
                    <p>التقييم: {rating.rating} / 5</p>
                    <p>{rating.text}</p>
                  </Link>
                  <button
                    className="delete-rating-button"
                    onClick={() => handleDeleteRating(rating._id)}
                  >
                    حذف
                  </button>
                </div>
              ))
            ) : (
              <p>لا توجد تقييمات</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
