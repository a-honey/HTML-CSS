import { useEffect, useState } from "react";
import NewsItem from "./NewsItem";
import axios from "axios";
import LoadingPage from "../pages/LoadingPage";

const NewsItemList = ({ category }) => {
  const [articles, setArticles] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const query = category === "all" ? "" : `&category=${category}`;
        const res = await axios.get(
          `https://newsapi.org/v2/top-headlines?country=kr${query}&apiKey=9da76e0cf2f94b489903abf2d45ff974`
        );
        setArticles(res.data.articles);
      } catch (err) {
        console.log("Error!!!");
      }
      setLoading(false);
    };
    fetchData();
  }, [category]);

  if (loading) {
    return <LoadingPage />;
  }

  if (!articles) {
    return null;
  }

  return (
    <div className="NewsItemList">
      {articles.map((article) => (
        <NewsItem key={article.url} article={article} />
      ))}
    </div>
  );
};

export default NewsItemList;
