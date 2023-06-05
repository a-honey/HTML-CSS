import "./NewsItem.css";

const NewsItem = ({ article }) => {
  const { title, description, url, urlToImage } = article;

  return (
    <div className="NewsItem">
      <div className="News-Img-wrapper">
        {urlToImage && (
          <img className="News-img" src={urlToImage} alt="article-img" />
        )}
      </div>
      <div className="News">
        <div className="News-title">{title}</div>
        <p className="News-description">{description}</p>
        <a className="News-link" href={url}>
          기사 보러가기
        </a>
      </div>
    </div>
  );
};

export default NewsItem;
