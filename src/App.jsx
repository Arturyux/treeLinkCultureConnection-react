import './App.css'
import SocialIcons from './Socialmedia.jsx'
import './fontawesome';

function App() {
  const links = [
    {
      color: "bg-red-300",
      text: "Bylaws",
      link: "https://bylaws.cultureconnection.se"
    },
    {
      color: "bg-yellow-100",
      text: "Normal size text",
      link: "https://bylaws.cultureconnection.se"
    },
    {
      color: "bg-blue-400",
      text: "Lets see how long can it go because idk",
      link: "https://bylaws.cultureconnection.se"
    },
  ];

  return (
    <div className='flex justify-center items-center'>
      <div className='max-w-xl mx-auto p-6'>
        <div className='h-70 w-70 mx-auto sm:w-96 sm:h-96'>
        <div className='aspect-square'>
          <img src='https://activities.cultureconnection.se/images/logo.png' className='rounded-full object-cover object-center'/>
        </div>
        </div>
        {links.map((item, index) => {
          return (
          <a key={index} href={item.link} target='_blank'>
            <div className={`sm:w-96 mx-auto ${item.color} mt-6 text-center p-4 rounded py-3 border-2 border-black shadow-custom sm:w-64 hover:shadow-none transition-all hover:translate-x-1 tranlate-y-1`}>
              <p className='text-xl font-bold'>
              {item.text}
              </p>
            </div>
          </a>
          );
        })}
        <SocialIcons />
      </div>
    </div>
  );
}

export default App;