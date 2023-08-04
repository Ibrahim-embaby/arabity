import { useEffect, useState } from "react";
import { fetchWorkshops } from "../../redux/apiCalls/searchApiCall";
import SearchItem from "./SearchItem";
import "./search.css";
import { useDispatch, useSelector } from "react-redux";
import { cars, provinces, services } from "../../dummyData";
import CircularProgress from "@mui/joy/CircularProgress";
import { useLocation, useSearchParams } from "react-router-dom";
import Pagination from "../../components/pagination/Pagination";

function SearchResults() {
  const { searchResults, loading, searchResultsCount } = useSelector(
    (state) => state.search
  );
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const dispatch = useDispatch();
  const [service, setService] = useState(params.get("service") || "");
  const [car, setCar] = useState(params.get("car") || "");
  const [province, setProvince] = useState(params.get("province") || "");
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);

  const RESULTS_PER_PAGE = 5;
  const pages = Math.ceil((searchResultsCount ?? 0) / RESULTS_PER_PAGE);

  const resetFormHandler = (e) => {
    e.preventDefault();
    setService("");
    setCar("");
    setProvince("");
    setPage(1);
  };

  useEffect(() => {
    dispatch(
      fetchWorkshops(car || "", service || "", province || "", page || null)
    );
  }, [dispatch, car, service, province, page]);

  useEffect(() => {
    // Check if the `service`, `car`, or `province` state variables have changed.
    setSearchParams(
      {
        service: service,
        car: car,
        province: province,
        page: page,
      },
      { relative: "route", replace: true }
    );
  }, [searchParams, service, car, province, page]);

  return (
    <div className="search-results">
      <div className="search-results-sidebar">
        <div className="search-results-sidebar-wrapper">
          <h4>تعديل البحث</h4>
          <form className="search-results-form">
            <select
              value={service}
              onChange={(e) => {
                setService(e.target.value);
                params.set("service", e.target.value);
              }}
            >
              <option value={""} disabled>
                نوع الصيانة
              </option>
              {services.map((service) => (
                <option key={service.value} value={service.label}>
                  {service.label}
                </option>
              ))}
            </select>
            <select
              value={car}
              onChange={(e) => {
                setCar(e.target.value);
                params.set("car", e.target.value);
              }}
            >
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
              onChange={(e) => {
                setProvince(e.target.value);
                params.set("province", e.target.value);
              }}
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

            <button
              className="search-results-form-btn"
              onClick={resetFormHandler}
            >
              تفريغ الحقول
            </button>
          </form>
        </div>
      </div>

      <div className="search-results-main">
        <div className="search-results-main-items">
          {loading ? (
            <div className="loading-page">
              <CircularProgress color="primary" />
            </div>
          ) : searchResults.length ? (
            searchResults.map((item) => (
              <SearchItem key={item._id} item={item} />
            ))
          ) : (
            <p className="no-results-found">لا توجد نتائج</p>
          )}
        </div>
        <Pagination page={page} setPage={setPage} pages={pages} />
      </div>
    </div>
  );
}

export default SearchResults;
