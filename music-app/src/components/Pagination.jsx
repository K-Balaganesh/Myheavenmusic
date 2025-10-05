export default function Pagination({ total, perPage, currentPage, setCurrentPage }) {
  const pages = [];
  for (let i = 1; i <= Math.ceil(total / perPage); i++) {
    pages.push(i);
  }
  return (
    <div className="pagination">
      {pages.map((num) => (
        <button
          key={num}
          onClick={() => setCurrentPage(num)}
          className={num === currentPage ? "active" : ""}
        >
          {num}
        </button>
      ))}
    </div>
  );
}
