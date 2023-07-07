import { useState } from "react";
import { cars, provinces, services } from "../../dummyData";
import "./home.css";
import { useDispatch } from "react-redux";
import { fetchAllWorkshops } from "../../redux/apiCalls/searchApiCall";
import { useNavigate } from "react-router-dom";
function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [service, setService] = useState("");
  const [car, setCar] = useState("");
  const [province, setProvince] = useState("");
  const searchFormHandler = (e) => {
    e.preventDefault();
    dispatch(fetchAllWorkshops(car, service, province));
    navigate("/search/workshops");
  };
  return (
    <div className="home">
      <section className="home-top">
        <h1>اكتشف أفضل مراكز الصيانة في منطقتك</h1>
        <form className="search-bar" onSubmit={searchFormHandler}>
          <select value={service} onChange={(e) => setService(e.target.value)}>
            <option value={""} disabled>
              نوع الصيانة
            </option>
            {services.map((service) => (
              <option key={service.value} value={service.label}>
                {service.label}
              </option>
            ))}
          </select>
          <select value={car} onChange={(e) => setCar(e.target.value)}>
            <option value={""} disabled>
              نوع العربية
            </option>
            {cars.map((car) => (
              <option key={car.value} value={car.value}>
                {car.label}
              </option>
            ))}
          </select>
          <select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
          >
            <option value={""} disabled>
              المحافظة
            </option>
            {provinces.map((province) => (
              <option key={province.name} value={province.name}>
                {province.name}
              </option>
            ))}
          </select>
          <button type="submit">بحث</button>
        </form>
      </section>
      {/* <section className="home-center">
        <div
          className="home-center-item"
          style={{ backgroundColor: "#134e6f" }}
        >
          <i className="bi bi-person-square"></i>
          <p>Create an account</p>
        </div>
        <div
          className="home-center-item"
          style={{ backgroundColor: "#ff6150" }}
        >
          <i className="bi bi-person-square"></i>
          <p>Browse the mechanic</p>
        </div>
        <div
          className="home-center-item "
          style={{ backgroundColor: "#1ac0c6" }}
        >
          <i className="bi bi-person-square"></i>
          <p>mechanic</p>
        </div>
      </section> */}

      {/* <section className="testimonial"></section> */}
    </div>
  );
}

export default Home;
