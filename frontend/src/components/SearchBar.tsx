export function SearchBar() {
  return (
    <div className="flex items-center bg-white/90 rounded-lg shadow px-3 py-2 w-64">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
      </svg>
      <input
        id="search"
        type="search"
        placeholder="Busque pelo nome do arquivo"
        className="ml-3 w-full bg-transparent outline-none text-sm text-[#081C33]"
      />
    </div>
  );
}
