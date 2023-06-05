import { useParams } from "react-router-dom";
import Categories from "../components/Categories";
import NewsItemList from "../components/NewsItemList";
import "./NewsPage.css";

const NewsPage = () => {
  const params = useParams();
  const category = params.category || "all";

  return (
    <div>
      <div className="header">
        <div className="moving">
          <h1>
            The <span>NEW</span>S
          </h1>
        </div>
      </div>
      <Categories />
      <NewsItemList category={category} />
    </div>
  );
};

export default NewsPage;
