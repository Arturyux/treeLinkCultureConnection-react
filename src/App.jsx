import './App.css'

function App() {
  const links = [
    {
      color: "bg-red-300",
      text: "Bylaws",
      link: "https://bylaws.cultureconnection.se"
    },
    {
      color: "bg-yellow-100",
      text: "Bylaws",
      link: "https://bylaws.cultureconnection.se"
    },
    {
      color: "bg-blue-400",
      text: "Bylaws",
      link: "https://bylaws.cultureconnection.se"
    }
  ];

  return (
    <div className='w-full h-screen bg-yellow-300'>
      <div className='max-w-xl mx-auto h-screen p-6'>
        <div className='h-80 w-80 mx-auto'>
        <div className='aspect-squere'>
          <img src='https://activities.cultureconnection.se/images/logo.png' className='rounded-full object-cover object-center'/>
        </div>
        </div>
        {links.map((item, index) => {
          return (
          <a key={index} href={item.link}>
            <div className={`w-96 mx-auto ${item.color} mt-6 text-center p-4 rounded py-3 border-2 border-black shadow-custom`}>
              <p className='text-xl font-bold '>
              {item.text}
              </p>
            </div>
          </a>
          );
        })}
      </div>
    </div>
  );
}

export default App;