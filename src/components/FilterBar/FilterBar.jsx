import { faArrowRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Select from "react-select";
import AllProducts from "../../data/products";
import { SET_PRODUCTS } from "../../store/productsSlice";
import {
  filterByCategory,
  filterBySearch,
  filterBySize,
} from "../../utils/filters";
import "./FilterBar.scss";
const FilterBar = () => {
  const [cat, setCat] = useState("");
  const [size, setSize] = useState("");
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const unFilteredData = AllProducts;
  const [filteredResult, setFilteredResults] = useState(unFilteredData);

  useEffect(() => {
    let result = [...unFilteredData];

    result = filterByCategory(result, cat);
    result = filterBySize(result, size);

    setFilteredResults(result);
    dispatch(SET_PRODUCTS(result));

    // eslint-disable-next-line
  }, [size, cat, dispatch]);

  const handleResetFilters = () => {
    setCat("");
    setSize("");
    setQuery("");
  };

  const debounceSearch = (cb, delay = 1000) => {
    let timeout;

    return function (...args) {
      setQuery(args[0]);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        cb(args);
        console.log(args);
      }, delay);
    };
  };

  const effectiveSearch = debounceSearch((args) => {
    let result = [...filteredResult];
    let data = filterBySearch(result, query);
    dispatch(SET_PRODUCTS(data));
  });

  const categoryOptions = [
    { value: "hoodies", label: "Hoodies" },
    { value: "shoes", label: "Shoes" },
    { value: "shirts", label: "Shirts" },
    { value: "jeans", label: "Jeans" },
  ];
  const sizeOptions = [
    { value: "XL", label: "XL" },
    { value: "L", label: "L" },
    { value: "M", label: "M" },
    { value: "S", label: "S" },
  ];

  return (
    <div className="filters-header">
      <div className="filters-header-left">
        <Select
          value={cat}
          options={categoryOptions}
          onChange={(cat) => setCat(cat)}
        />
        <Select
          value={size}
          options={sizeOptions}
          onChange={(size) => setSize(size)}
        />
        <div className="reset-box">
          <FontAwesomeIcon
            icon={faArrowRotateLeft}
            className="icon-reset"
            onClick={handleResetFilters}
          />
          <span className="reset-text">Reset</span>
        </div>
      </div>
      <div className="filters-header-right">
        <input
          type="search"
          placeholder="Search Products..."
          className="input-search"
          value={query}
          onChange={(e) => effectiveSearch(e.target.value)}
        />
        <Link to="/cart">
          <button className="btn btn-add">Add To Cart</button>
        </Link>
      </div>
    </div>
  );
};

export default FilterBar;
