import './App.css'

function App() {
  const links = [
    {
      color: "bg-red-300",
      text: "Bylaws",
      link: "https://bylaws.cultureconnection.se"
    },
    {
      color: "bg-red-300",
      text: "Bylaws",
      link: "https://bylaws.cultureconnection.se"
    },
    {
      color: "bg-red-300",
      text: "Bylaws",
      link: "https://bylaws.cultureconnection.se"
    }
  ];

  return (
    <div className='w-full h-screen bg-yellow-300 flex justify-center items-center'>
      <div className='w-full max-w-xl h-full bg-black p-6'>
        {links.map((item, index) => (
          <p key={index} className={item.color}>
            <a href={item.link} target="_blank" rel="noopener noreferrer">
              {item.text}
            </a>
          </p>
        ))}
        <p className="text-white">asdsa</p>
      </div>
    </div>
  );
}

export default App;