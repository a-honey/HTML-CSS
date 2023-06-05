import { NavLink } from "react-router-dom";
import "./Categories.css";

const List = [
  {
    ko: "전체보기",
    en: "all",
  },
  {
    ko: "경영",
    en: "business",
  },
  {
    ko: "연예",
    en: "entertainment",
  },
  {
    ko: "건강",
    en: "health",
  },
  {
    ko: "과학",
    en: "science",
  },
  {
    ko: "스포츠",
    en: "sports",
  },
  {
    ko: "기술",
    en: "technology",
  },
];

const Categories = ({ onSelect, category }) => {
  return (
    <div className="categories">
      {List.map((c) => (
        <NavLink
          key={c.en}
          className={({ isActive }) => (isActive ? "c active" : "c")}
          to={c.en === "all" ? "/" : `/${c.en}`}
        >
          {c.ko}
        </NavLink>
      ))}
    </div>
  );
};

export default Categories;
